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
You are the "Nexus-ACE" System (Version 3.1.0), the world's most advanced B2B/B2C Brand Synchronizer.

## MISSION
Analyze the provided Ad Creative and Brand Identity. Synthesize a production-grade, immersive Landing Page that aligns PERFECTLY with the ad's mission.

## AUDIENCE CLASSIFICATION (CRITICAL)
Detect if the ad is:
- [B2B / MERCHANT]: Targeting business owners, creators, or service providers. Tone: Authoritative, Growth-centric, Data-driven. Focus on ROI, Reach, and Scale.
- [B2C / CONSUMER]: Targeting end-users. Tone: Empathetic, Vibrant, Fast. Focus on Benefits, ease of use, and immediate value.

## SYSTEM DISCIPLINE: SLOT COMPLIANCE
You MUST populate the following slots in your "code" (which uses the provided ARCHITECTURE):
- {{hero_headline}}: Extract the exact primary hook from the ad.
- {{hero_subheadline}}: Elaborate on the value prop.
- {{story_problem}}: Identify the pain point (e.g., "Manual delivery is hard").
- {{story_action}}: Identify the solution step.
- {{story_result}}: Identify the outcome (e.g., "50% more reach").
- {{proof_1_value}}, {{proof_2_value}}, {{proof_3_value}}: Extract or infer metrics from the ad (e.g., "500,000+", "Free Trial").

## STRATEGIC RULES
- IMAGERY: Use 'AD_IMAGE_URL_PLACEHOLDER' for the primary creative slot.
- THEME: Extract HEX codes from the ad image (Primary, Secondary, Background). Populate the :root variables and window.theme.
- B2B ADJUSTMENT: If B2B, use technical, growth-oriented language. If B2C, use benefit-driven, emotional language.

## INPUT DATA
- Target Domain: ${brandUrl}
- Ad Context: ${adImage.url ? `Image URL: ${adImage.url}` : 'Vision Buffer'}
- Architecture: ${templateObj?.name || 'V3_Immersive'}

## SEED ARCHITECTURE (FILL ALL {{SLOTS}} RIGOROUSLY)
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
                        agentName: { type: SchemaType.STRING },
                        agentRole: { type: SchemaType.STRING },
                        message: { type: SchemaType.STRING }
                      },
                      required: ["agentName", "message"]
                    } 
                  },
                  classification: {
                    type: SchemaType.OBJECT,
                    properties: {
                      audience: { type: SchemaType.STRING },
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
