import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageResult, DesignTokenRegistry, AgentLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class NexusService {
  static async orchestrate(brandUrl: string, adImage: { url?: string; base64?: { data: string; mimeType: string } }, templateObj?: any): Promise<LandingPageResult> {
    const prompt = `
You are the "Nexus-ACE" System, a multi-agent architecture for converting Ad Creatives into high-fidelity, brand-aligned Landing Pages.

## INPUTS
${adImage.url ? `- Ad Image URL: ${adImage.url}` : '- Ad Image: Provided via vision data.'}
- Target Brand URL: ${brandUrl}
- Target Architecture Template: ${templateObj ? templateObj.name : 'Default'}

## YOUR MISSION
Follow the 30+ agent workflow (AdAnalyzer, SemanticBridge, DTR_Extractor, CopySynth, NexusBrain, V2_Renderer, etc.) to generate:
1. [LOG_TRACE]: A summary of thoughts from Agents #1 (AdAnalyzer), #3 (DTR_Extractor), #7 (NexusBrain), and #27 (QA_Validator).
2. [DTR_JSON]: The final Design Token Registry.
3. [CODE]: The complete, self-contained HTML/Tailwind landing page code based on the provided template structure.

## CRITICAL: HTML GENERATION INSTRUCTIONS
The user has selected the "${templateObj?.name}" template. You must base your output HTML on this template structure. You should smartly fill in the {{placeholder_tags}} with actual content aligned with the brand and the ad creative. 
DO NOT simply return the template string as is. Perform string interpolation/replacement to insert brand-colors as CSS variables or hex codes, actual copy, etc., as described in the template's guidelines.
Here is the template you MUST USE:
\`\`\`html
${templateObj?.content || '<!-- Standard layout output goes here -->'}
\`\`\`

## CONSTRAINTS
- ACCESSIBILITY LOCK: Check contrast. If L < 4.5:1, invert text color.
- SEMANTIC PURITY: No B2B fluff unless in brand manifest.
- DESIGN: Use polished Tailwind styles. Incorporate entry animations.
- DO NOT use external image URLs other than the provided Ad Image input. Use high-quality placeholders for other images if needed.

## OUTPUT FORMAT
Your entire response must be a valid JSON object with the following structure:
{
  "logs": [
    { "id": "1", "agentName": "AdAnalyzer", "agentRole": "Vision Specialist", "message": "...", "status": "completed", "timestamp": "..." },
    ...
  ],
  "dtr": {
    "colors": { "primary": "#...", "secondary": "#...", "accent": "#...", "background": "#...", "surface": "#...", "ink": "#..." },
    "typography": { "displayFont": "...", "bodyFont": "...", "monoFont": "..." },
    "geometry": { "borderRadius": "...", "spacingUnit": "...", "containerWidth": "..." },
    "brandDna": { "voice": "...", "tone": "...", "audience": "..." }
  },
  "code": "...(Complete HTML/Tailwind code string populated using the template)..."
}
`;

    const maxRetries = 5;
    let attempt = 0;

    const executeWithRetry = async (): Promise<LandingPageResult> => {
      try {
        const contents: any[] = [{ role: 'user', parts: [{ text: prompt }] }];
        
        let adSourceInfo = adImage.url || "the provided user image data";
        if (adImage.base64) {
          contents[0].parts.push({
            inlineData: {
              data: adImage.base64.data,
              mimeType: adImage.base64.mimeType
            }
          });
        }

        const enhancedPrompt = prompt + `
\n## CRITICAL: IMAGE HANDLING
- You MUST use the string 'AD_IMAGE_URL_PLACEHOLDER' as the 'src' value for the primary <img> tag in your code that represents ${adSourceInfo}.
- DO NOT use any other external image URLs for the main creative.

## CRITICAL: DTR ACCURACY
- Analyze the vision data or brand identity to extract PRECISE hex codes.
- Ensure 'colors', 'typography', and 'geometry' objects are FULLY populated based on the input image and brand URL.
`;

        contents[0].parts[0].text = enhancedPrompt;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", 
          contents: contents,
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
                      id: { type: Type.STRING },
                      agentName: { type: Type.STRING },
                      agentRole: { type: Type.STRING },
                      message: { type: Type.STRING },
                      status: { type: Type.STRING },
                      timestamp: { type: Type.STRING }
                    },
                    required: ["id", "agentName", "message"]
                  }
                },
                dtr: {
                  type: Type.OBJECT,
                  properties: {
                    colors: { 
                      type: Type.OBJECT,
                      properties: {
                        primary: { type: Type.STRING },
                        secondary: { type: Type.STRING },
                        accent: { type: Type.STRING },
                        background: { type: Type.STRING },
                        surface: { type: Type.STRING },
                        ink: { type: Type.STRING }
                      },
                      required: ["primary", "background", "ink"]
                    },
                    typography: { 
                      type: Type.OBJECT, 
                      properties: {
                        displayFont: { type: Type.STRING },
                        bodyFont: { type: Type.STRING },
                        monoFont: { type: Type.STRING }
                      }
                    },
                    geometry: { 
                      type: Type.OBJECT,
                      properties: {
                        borderRadius: { type: Type.STRING },
                        spacingUnit: { type: Type.STRING },
                        containerWidth: { type: Type.STRING }
                      }
                    },
                    brandDna: {
                      type: Type.OBJECT,
                      properties: {
                        voice: { type: Type.STRING },
                        tone: { type: Type.STRING },
                        audience: { type: Type.STRING }
                      }
                    }
                  },
                  required: ["colors", "typography", "geometry"]
                },
                code: { type: Type.STRING }
              },
              required: ["logs", "dtr", "code"]
            }
          }
        });

        const result = JSON.parse(response.text || "{}") as LandingPageResult;
        return result;
      } catch (error: any) {
        const isRateLimit = error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429');
        if (attempt < maxRetries && isRateLimit) {
          attempt++;
          // Exponential backoff: 3s, 6s, 12s, 24s, 48s
          const delay = Math.pow(2, attempt) * 1500;
          console.warn(`Nexus Orchestration: 429 detected. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return executeWithRetry();
        }
        throw error;
      }
    };

    return executeWithRetry();
  }
}
