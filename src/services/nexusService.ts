import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageResult } from "../types";

export class NexusService {
  static async orchestrate(
    brandUrl: string, 
    adImage: { url?: string; base64?: { data: string; mimeType: string } }, 
    templateObj?: any, 
    userApiKey?: string
  ): Promise<LandingPageResult> {
    
    // API Priority: User Settings > Environment variable
    const apiKey = userApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string);
    
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please provide it in Protocol Settings.");
    }

    const ai = new GoogleGenAI(apiKey);
    
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

    // Model fallback sequence: 3-flash-preview -> 2.0-flash -> 1.5-flash
    const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash-latest"];
    let lastError = null;

    console.log("%c[SYSTEM] NEXUS_CORE_DISPATCHING", "color: #3b82f6; font-weight: bold; font-family: monospace;");
    console.info(`[Nexus] Protocol: Orchestration | Source: ${brandUrl}`);

    for (const modelName of modelsToTry) {
      try {
        console.group(`[Model_Attempt] ${modelName}`);
        console.info(`Initiating stream...`);
        
        const model = ai.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                logs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      agentName: { type: Type.STRING },
                      agentRole: { type: Type.STRING },
                      message: { type: Type.STRING },
                      status: { type: Type.STRING }
                    },
                    required: ["agentName", "message"]
                  }
                },
                dtr: {
                  type: Type.OBJECT,
                  properties: {
                    colors: { type: Type.OBJECT },
                    typography: { type: Type.OBJECT },
                    geometry: { type: Type.OBJECT },
                    brandDna: { type: Type.OBJECT }
                  },
                  required: ["colors", "typography", "geometry"]
                },
                code: { type: Type.STRING }
              },
              required: ["code", "dtr"]
            }
          }
        });

        const result = await model.generateContent({ contents });
        const responseText = result.response.text();
        const data = JSON.parse(responseText) as LandingPageResult;

        console.info(`[SUCCESS] Block hash received. Processing ${data.code?.length} bytes.`);
        
        // Trace logging for "Vercel Logs" / Browser Console
        if (data.logs) {
          console.groupCollapsed("[AGENT_TRACE] Operational Manifest");
          data.logs.forEach((log: any) => {
            console.log(`%c[${log.agentName}] %c${log.message}`, "color: #3b82f6; font-weight: bold;", "color: #94a3b8;");
          });
          console.groupEnd();
        }

        console.groupEnd();
        return data;
      } catch (err: any) {
        console.warn(`[FAIL] ${modelName} encountered an error:`, err.message);
        console.groupEnd();
        lastError = err;
      }
    }

    throw lastError || new Error("Orchestration Node failure. All attempts exhausted.");
  }
}
