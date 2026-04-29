import { GoogleGenAI, Type } from "@google/genai";
import { templates } from "../src/templates";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { brandUrl, adImage, templateObj, userApiKey } = req.body;
    
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[Nexus] Error: Gemini API Key is missing.");
      return res.status(400).json({ error: "Gemini API Key is missing. Please provide it in settings." });
    }

    console.info(`[Nexus] Orchestrating: Brand=${brandUrl}`);

    const ai = new GoogleGenAI(apiKey);
    
    // We can't easily import the prompt logic if we want to share it, so I'll keep it here for now
    // or better, I should have a shared service logic.
    // For simplicity, I'll just duplicate the logic from server.ts or move it to a shared file.
    
    const prompt = `
You are the "Nexus-ACE" System (Version 2.7.0), a high-tier multi-agent architecture for generating high-conversion, brand-synchronized marketing funnels.

## MISSION
Synthesize the provided Ad Creative and Brand Identity into a professional, "award-worthy" Landing Page.

## DESIGN SYSTEM (MANDATORY)
- THEME: Modern, bold, and clean. Use high-contrast headings.
- LAYOUT: Use multi-column sections, bento grids, and overlapping visual elements. Avoid "boxy" standard layouts.
- COLOR: Interpolate brand colors (identified from the creative) into the background, buttons, and accents using Tailwind (e.g., bg-[#F43397] for primary).
- INTERACTION: Every button should have a smooth hover lift/glow effect. Use transitions.
- IMAGERY: Use the primary ad creative as the HERO image. Replace the 'src' with 'AD_IMAGE_URL_PLACEHOLDER'.
- RESPONSIVENESS: Ensure full responsiveness (mobile/tablet/desktop).

## AGENT PROTOCOLS
1. [AdAnalyzer (Vision)]: Identify core HEX colors, lighting, and the primary "Emotional Hook" from the creative.
2. [SemanticBridge (Context)]: Synchronize the ad's offer with the ecosystem of ${brandUrl}. For example, if it's Meesho, use social commerce/reselling terminology.
3. [DTR_Generator (Tokens)]: Construct a precise Design Token Registry.
4. [MasterRenderer (Frontend)]: Output the final HTML + Tailwind production code.

## INPUT DATA
- Target Domain: ${brandUrl}
- Ad Content: ${adImage.url ? `Image URL: ${adImage.url}` : 'Vision Buffer (Image provided in binary chunk)'}
- Architecture: ${templateObj?.name || 'V2_High_Conversion'}

## OUTPUT SCHEMA
- code: Complete HTML string (Head + Body). Include <script src="https://cdn.tailwindcss.com"></script>.
- logs: 4 items (AdAnalyzer, SemanticBridge, DTR_Generator, MasterRenderer) with name, role, and a TECHNICAL status update.
- dtr: Detailed registry including brandDna (voice, tone, audience), colors (hex), typography, and geometry.

## SEED ARCHITECTURE
${templateObj?.content || '<!-- Start from a clean, modern canvas -->'}
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
                },
                brandDna: {
                  type: Type.OBJECT,
                  properties: {
                    voice: { type: Type.STRING },
                    tone: { type: Type.STRING },
                    audience: { type: Type.STRING }
                  },
                  required: ["voice", "audience"]
                }
              },
              required: ["colors", "typography", "geometry", "brandDna"]
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
    return res.status(200).json(data);
      } catch (err: any) {
        console.warn(`[Nexus] Model \${modelName} fallback triggered:`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error("All models failed.");
  } catch (error: any) {
    console.error("[Nexus] Server Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
