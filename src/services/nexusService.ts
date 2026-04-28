import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageResult } from "../types";

export class NexusService {
  static async orchestrate(brandUrl: string, adImage: { url?: string; base64?: { data: string; mimeType: string } }, templateObj?: any, userApiKey?: string): Promise<LandingPageResult> {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key is required. Please provide it in settings.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are the "Nexus-ACE" System, a multi-agent architecture for converting Ad Creatives into high-fidelity, brand-aligned Landing Pages.

## MISSION
Generate a Design Token Registry (DTR) and complete HTML/Tailwind code based on the brand identity and ad creative.
Use the provided template structure. Fill in the content intelligently based on the brand and ad.

## INPUTS
${adImage.url ? `- Ad Image URL: ${adImage.url}` : '- Ad Image: Provided via vision data.'}
- Target Brand URL: ${brandUrl}
- Target Architecture Template: ${templateObj ? templateObj.name : 'Default'}

## TEMPLATE TO USE:
\`\`\`html
${templateObj?.content || '<!-- Standard layout output goes here -->'}
\`\`\`

## OUTPUT FORMAT
Return a valid JSON object:
{
  "logs": [],
  "dtr": {
    "colors": { "primary": "#...", "secondary": "#...", "accent": "#...", "background": "#...", "surface": "#...", "ink": "#..." },
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

    const modelsToTry = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.info(`[Nexus] Attempting orchestration with model: ${modelName}`);
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                logs: { type: Type.ARRAY, items: { type: Type.OBJECT } },
                dtr: { type: Type.OBJECT },
                code: { type: Type.STRING }
              },
              required: ["dtr", "code"]
            }
          }
        });

        if (!response.text) throw new Error("Empty response from model");
        
        const parsed = JSON.parse(response.text) as LandingPageResult;
        console.info(`[Nexus] Successfully orchestrated using ${modelName}`);
        console.info(`[Nexus] Generated ${parsed.code.length} chars of code.`);
        
        if (parsed.logs && parsed.logs.length > 0) {
          console.group('[Nexus] Agent Trace');
          parsed.logs.forEach(log => {
            console.log(`[${log.agentName}] (${log.agentRole}): ${log.message}`);
          });
          console.groupEnd();
        }
        
        return parsed;
      } catch (err: any) {
        console.error(`[Nexus] Model ${modelName} failed context:`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error("All models failed to generate content.");
  }
}
