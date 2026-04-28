import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { put } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/orchestrate", async (req, res) => {
    try {
      const { brandUrl, adImage, templateObj, userApiKey, blobToken } = req.body;
      
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Gemini API Key is required. Please provide it in settings or ensure server is configured." });
      }

      console.info(`[Nexus] Request received for brand: ${brandUrl}`);

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are the "Nexus-ACE" System, a high-performance multi-agent architecture.
Your mission is to transform an Ad Creative into a high-fidelity, brand-aligned Landing Page.

## OPERATIONAL FLOW
1. [AdAnalyzer]: Extract core visual themes, colors, and value propositions from the ad.
2. [SemanticBridge]: Align the ad's message with the target brand's voice and domain.
3. [DTR_Generator]: Construct a Design Token Registry (DTR) for the new page.
4. [MasterRenderer]: Generate complete, production-ready HTML with Tailwind CSS.

## INPUTS
${adImage.url ? `- Ad Image URL: ${adImage.url}` : '- Ad Image: Vision data provided.'}
- Target Brand Domain: ${brandUrl}
- Chosen Architecture Template: ${templateObj?.name || 'Standard'}

## MANDATORY OUTPUT SPECIFICATIONS
- The 'code' field MUST contain the full, self-contained HTML including all sections (Hero, Features, Social Proof, etc.) using Tailwind CSS utility classes. 
- Interpolate colors from the DTR directly into the HTML using hex codes or Tailwind arbitrary values.
- Use 'AD_IMAGE_URL_PLACEHOLDER' as the 'src' for the primary ad image.
- Ensure the DTR object is fully populated with specific, high-quality values (colors, fonts, geometry).

## TEMPLATE CONSTRAINTS
Use the structure below as your foundation, but expand it into a full, high-fidelity experience:
\`\`\`html
${templateObj?.content || '<!-- Build a high-conversion layout -->'}
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

      // Model fallback logic
      const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash-latest"];
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
          
          const result = JSON.parse(response.text);
          console.log(`[Nexus] SUCCESS using ${modelName}`);
          
          if (result.logs) {
            console.group(`[Nexus] Agent Trace (${modelName})`);
            result.logs.forEach((log: any) => {
              console.log(`[${log.agentName}] ${log.message}`);
            });
            console.groupEnd();
          }

          return res.json(result);
        } catch (err: any) {
          console.warn(`[Nexus] Model ${modelName} failed: ${err.message}`);
          lastError = err;
        }
      }

      throw lastError || new Error("All models failed.");
    } catch (error: any) {
      console.error("[Nexus] Orchestration Error:", error.message);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Proxy Blob Upload (optional but nice to have server-side)
  app.post("/api/upload", async (req, res) => {
    try {
      const { fileName, fileData, mimeType, token } = req.body;
      const finalToken = token || process.env.BLOB_READ_WRITE_TOKEN;
      
      if (!finalToken) return res.status(400).json({ error: "Blob token required" });
      
      console.info(`[Nexus] Uploading blob: ${fileName}`);
      const buffer = Buffer.from(fileData, 'base64');
      const blob = await put(fileName, buffer, {
        access: 'public',
        contentType: mimeType,
        token: finalToken
      });
      
      console.log(`[Nexus] Blob uploaded successfully: ${blob.url}`);
      res.json(blob);
    } catch (error: any) {
      console.error(`[Nexus] Blob upload failed:`, error.message);
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
    console.log(`[Nexus] Server running on http://localhost:${PORT}`);
  });
}

startServer();
