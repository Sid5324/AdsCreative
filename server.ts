import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { put } from "@vercel/blob";
import dotenv from "dotenv";

import orchestrateHandler from "./api/orchestrate.ts";
import uploadHandler from "./api/upload.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  // Middleware to log all requests for "Vercel Logs" visibility
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  // API Routes
  app.post("/api/orchestrate", async (req, res) => {
    try {
      const { brandUrl, adImage, templateObj, userApiKey } = req.body;
      
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("[Nexus] Error: Gemini API Key is missing.");
        return res.status(400).json({ error: "Gemini API Key is missing. Please provide it in settings." });
      }

      console.info(`[Nexus] Orchestrating: Brand=${brandUrl}`);

      const ai = new GoogleGenerativeAI(apiKey);
      
      const seedContent = templateObj?.content || '<!-- Start from a clean, modern canvas -->';
      
      const prompt = `
You are the "Nexus-ACE" System (Version 4.0.0-PRO), a multi-agent orchestration engine for high-conversion Brand Synchronization.

### OPERATIONAL AGENTS (VIRTUAL)
Before generating code, you must pass the request through these internal agents:
1. [MARKET_ANALYST]: Analyze the Ad Creative. Identify the EXACT target - is it the End Consumer (Eating the food) or the Merchant (Running the business)? 
   - RULE: If there are dashboards, profit metrics, or "Join us" text, it is MERCHANT (B2B).
   - RULE: If there is delicious food, hunger-inducing imagery, or "Order now" text, it is CONSUMER (B2C).
2. [DESIGN_ARCHITECT]: Ensure the layout respects the visual assets.
   - RULE: NEVER change 'object-contain' to 'object-cover' if the original template suggests contain. This prevents "cutting" important ad copy or faces.
   - RULE: Ensure padding is responsive (px-4 on mobile, px-8+ on desktop).
3. [COPYWRITER]: Match the tone of the ad. Use the same vocabulary.

### MISSION
Synthesize a production-grade, immersive Landing Page that aligns PERFECTLY with the ad's mission and audience.

### AUDIENCE CLASSIFICATION (CRITICAL)
- [B2B / MERCHANT]: Targeting business owners, creators, or service providers. Tone: Authoritative, Growth-centric, Data-driven. Focus on ROI, Partnering, and Infrastructure.
- [B2C / CONSUMER]: Targeting end-users. Tone: Empathetic, Vibrant, Immediate. Focus on Pleasure, Ease, and Quick Satisfaction.

### SYSTEM DISCIPLINE: SLOT COMPLIANCE
Populate the following slots in your "code" (which uses the provided ARCHITECTURE):
- {{hero_headline}}: The primary hook.
- {{hero_subheadline}}: The secondary value prop.
- {{story_problem}}: The pain point.
- {{story_action}}: The solution.
- {{story_result}}: THE PAYOFF.
- {{proof_1_value}}, {{proof_2_value}}, {{proof_3_value}}: Metrics or trust signals (e.g., "50k+ Merchants", "4.9 Stars").

### STRATEGIC RULES
- IMAGERY: Use 'AD_IMAGE_URL_PLACEHOLDER' for the primary creative slot.
- THEME: Extract HEX codes (Primary, Secondary, Background) from the image. Populate CSS variables.
- IMAGE SAFETY: Always use 'object-contain' for the hero image to prevent cropping of ad content.

### INPUT DATA
- Target Domain: ${brandUrl}
- Ad Context: ${adImage.url ? `Image URL: ${adImage.url}` : 'Vision Buffer'}
- Architecture: ${templateObj?.name || 'V3_Immersive'}

### SEED ARCHITECTURE
${seedContent}
`;

      const contents: any[] = [{ role: 'user', parts: [{ text: prompt }] }];
      
      if (adImage.base64) {
        contents[0].parts.push({
          inlineData: {
            data: adImage.base64.data,
            mimeType: adImage.base64.mimeType
          }
        });
      }

      const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash"];
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          console.info(`[Nexus] Dispatching to Model: ${modelName}`);
          
          const model = ai.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                  logs: { 
                    type: SchemaType.ARRAY, 
                    items: { 
                      type: SchemaType.OBJECT,
                      properties: {
                        agentName: { type: SchemaType.STRING, description: "One of [MARKET_ANALYST, DESIGN_ARCHITECT, COPYWRITER, SYSTEM_VERIFIER]" },
                        agentRole: { type: SchemaType.STRING },
                        message: { type: SchemaType.STRING, description: "Detailed report of the agent's findings and decisions." }
                      },
                      required: ["agentName", "message"]
                    } 
                  },
                  classification: {
                    type: SchemaType.OBJECT,
                    properties: {
                      audience: { type: SchemaType.STRING, description: "MUST BE EITHER 'B2B/MERCHANT' OR 'B2C/CONSUMER'" },
                      intent: { type: SchemaType.STRING },
                      tone: { type: SchemaType.STRING }
                    },
                    required: ["audience", "intent"]
                  },
                  dtr: { 
                    type: SchemaType.OBJECT,
                    properties: {
                      colors: { 
                        type: SchemaType.OBJECT,
                        properties: {
                          primary: { type: SchemaType.STRING },
                          secondary: { type: SchemaType.STRING },
                          accent: { type: SchemaType.STRING },
                          background: { type: SchemaType.STRING },
                          surface: { type: SchemaType.STRING },
                          ink: { type: SchemaType.STRING }
                        }
                      },
                      brandDna: {
                        type: SchemaType.OBJECT,
                        properties: {
                          voice: { type: SchemaType.STRING },
                          audience: { type: SchemaType.STRING },
                          hooks: { 
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING }
                          }
                        }
                      }
                    }
                  },
                  code: { 
                    type: SchemaType.STRING,
                    description: "The complete HTML with all template slots filled."
                  }
                },
                required: ["code", "classification"]
              }
            }
          });

          const result = await model.generateContent({ contents });
          const resultResponse = await result.response;
          const responseText = resultResponse.text();
          
          const data = JSON.parse(responseText);
          console.log(`[Nexus] SUCCESS using ${modelName}. Output length: ${data.code?.length}`);
          
          if (data.logs) {
            console.log("------- AGENT TRACE START -------");
            data.logs.forEach((log: any) => {
              console.log(`[${log.agentName}] ${log.message}`);
            });
            console.log("------- AGENT TRACE END ---------");
          }

          return res.json(data);
        } catch (err: any) {
          console.warn(`[Nexus] Model ${modelName} fallback triggered:`, err.message);
          lastError = err;
        }
      }

      throw lastError || new Error("All models failed.");
    } catch (error: any) {
      console.error("[Nexus] Server Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/upload", uploadHandler);
  
  app.get("/api/health", (req, res) => res.json({ status: "alive", timestamp: new Date() }));


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nexus] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
