import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/orchestrate", async (req, res) => {
    try {
      const { brandUrl, adImage, templateObj, userApiKey } = req.body;
      
      const apiKey = userApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Gemini API Key is required. Please provide it in settings or ensure server is configured." });
      }

      const userClient = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are the "Nexus-ACE" System, a multi-agent architecture for converting Ad Creatives into high-fidelity, brand-aligned Landing Pages.

## INPUTS
${adImage.url ? `- Ad Image URL: ${adImage.url}` : '- Ad Image: Provided via vision data.'}
- Target Brand URL: ${brandUrl}
- Target Architecture Template: ${templateObj ? templateObj.name : 'Default'}

## MISSION
Generate a Design Token Registry (DTR) and complete HTML/Tailwind code based on the brand identity and ad creative.
Use the provided template structure.

## OUTPUT FORMAT
Return a valid JSON object:
{
  "logs": [],
  "dtr": {
    "colors": { "primary": "...", "secondary": "...", "accent": "...", "background": "...", "surface": "...", "ink": "..." },
    "typography": { "displayFont": "...", "bodyFont": "...", "monoFont": "..." },
    "geometry": { "borderRadius": "...", "spacingUnit": "...", "containerWidth": "..." },
    "brandDna": { "voice": "...", "tone": "...", "audience": "..." }
  },
  "code": "..."
}
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
      const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          const response = await userClient.models.generateContent({
            model: modelName,
            contents,
            config: {
              responseMimeType: "application/json"
            }
          });

          return res.json(JSON.parse(response.text || "{}"));
        } catch (err: any) {
          console.warn(`Model ${modelName} failed, trying next...`);
          lastError = err;
        }
      }

      throw lastError || new Error("All models failed to generate content.");
    } catch (error: any) {
      console.error("Orchestration Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
