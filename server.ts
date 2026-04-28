import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { put } from "@vercel/blob";
import dotenv from "dotenv";

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

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are the "Nexus-ACE" System (Version 2.5.12), an advanced multi-agent architecture for synthetic brand orchestration.

## MISSION
Transform the provided Ad Creative and Brand Identity into a high-fidelity, high-conversion Landing Page.

## AGENT PROTOCOLS
1. [AdAnalyzer]: Deconstruct vision data, color hierarchies, and spatial relationships.
2. [SemanticBridge]: Synchronize ad value prop with the domain: ${brandUrl}.
3. [DTR_Generator]: Synthesize a Design Token Registry (DTR) for visual consistency.
4. [MasterRenderer]: Output complete, production-ready HTML with integrated Tailwind CSS.

## INPUTS
${adImage.url ? `- Source Image URL: ${adImage.url}` : '- Vision Buffer: Ad Image Provided via multi-modal channel.'}
- Target Architecture: ${templateObj?.name || 'Standard_Vertical'}
- Target Domain: ${brandUrl}

## OUTPUT CONSTRAINTS
- Return a valid JSON object only.
- The 'code' field MUST contain the entire HTML including Hero, features, and footer.
- The 'code' MUST use Tailwind CSS.
- Replace the main ad image 'src' with 'AD_IMAGE_URL_PLACEHOLDER'.
- Generate exactly 4 LOG items simulating the agent workflow.

## TEMPLATE FOUNDATION
\`\`\`html
${templateObj?.content || '<!-- Standard layout -->'}
\`\`\`
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
          
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  logs: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT,
                      properties: {
                        agentName: { type: Type.STRING },
                        agentRole: { type: Type.STRING },
                        message: { type: Type.STRING }
                      },
                      required: ["agentName", "message"]
                    } 
                  },
                  dtr: { 
                    type: Type.OBJECT,
                    properties: {
                      colors: { type: Type.OBJECT },
                      typography: { 
                        type: Type.OBJECT,
                        properties: {
                          displayFont: { type: Type.STRING },
                          bodyFont: { type: Type.STRING },
                          monoFont: { type: Type.STRING }
                        },
                        required: ["displayFont", "bodyFont"]
                      },
                      geometry: { 
                        type: Type.OBJECT,
                        properties: {
                          borderRadius: { type: Type.STRING },
                          spacingUnit: { type: Type.STRING }
                        },
                        required: ["borderRadius", "spacingUnit"]
                      }
                    },
                    required: ["colors", "typography", "geometry"]
                  },
                  code: { type: Type.STRING }
                },
                required: ["dtr", "code"]
              }
            }
          });

          if (!response.text) throw new Error("Empty response from model");
          
          const data = JSON.parse(response.text);
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

  app.post("/api/upload", async (req, res) => {
    try {
      const { fileName, fileData, mimeType, userBlobToken } = req.body;
      const token = userBlobToken || process.env.BLOB_READ_WRITE_TOKEN;
      
      if (!token) {
        console.error("[Nexus] Error: Blob token is missing.");
        return res.status(400).json({ error: "Vercel Blob Token is missing." });
      }

      console.info(`[Nexus] Uploading to Blob: ${fileName}`);
      const buffer = Buffer.from(fileData, 'base64');
      const blob = await put(fileName, buffer, {
        access: 'public',
        contentType: mimeType,
        token: token
      });
      
      console.log(`[Nexus] Upload Success: ${blob.url}`);
      res.json(blob);
    } catch (error: any) {
      console.error("[Nexus] Upload Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

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
