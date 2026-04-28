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
You are the "Nexus-ACE" System (Version 2.5.12), an advanced multi-agent architecture for synthetic brand orchestration.

## MISSION
Transform the provided Ad Creative and Brand Identity into a high-fidelity, high-conversion Landing Page.

## AGENT PROTOCOLS
1. [AdAnalyzer]: Deconstruct vision data, color hierarchies, and spatial relationships.
2. [SemanticBridge]: Synchronize ad value prop with the domain: \${brandUrl}.
3. [DTR_Generator]: Synthesize a Design Token Registry (DTR) for visual consistency.
4. [MasterRenderer]: Output complete, production-ready HTML with integrated Tailwind CSS.

## INPUTS
\${adImage.url ? \`- Source Image URL: \${adImage.url}\` : '- Vision Buffer: Ad Image Provided via multi-modal channel.'}
- Target Architecture: \${templateObj?.name || 'Standard_Vertical'}
- Target Domain: \${brandUrl}

## OUTPUT CONSTRAINTS
- Return a valid JSON object only.
- The 'code' field MUST contain the entire HTML including Hero, features, and footer.
- The 'code' MUST use Tailwind CSS.
- Replace the main ad image 'src' with 'AD_IMAGE_URL_PLACEHOLDER'.
- Generate exactly 4 LOG items simulating the agent workflow.

## TEMPLATE FOUNDATION
\`\`\`html
\${templateObj?.content || '<!-- Standard layout -->'}
\`\`\`
`.replace(/\${brandUrl}/g, brandUrl)
 .replace(/\${adImage\.url \? \`- Source Image URL: \${adImage\.url}\` : '- Vision Buffer: Ad Image Provided via multi-modal channel\.'}/g, adImage.url ? `- Source Image URL: ${adImage.url}` : '- Vision Buffer: Ad Image Provided via multi-modal channel.')
 .replace(/\${templateObj\?\.name \|\| 'Standard_Vertical'}/g, templateObj?.name || 'Standard_Vertical')
 .replace(/\${templateObj\?\.content \|\| '<!-- Standard layout -->'/g, templateObj?.content || '<!-- Standard layout -->');

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
