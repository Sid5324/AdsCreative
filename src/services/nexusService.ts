import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageResult } from "../types";

export class NexusService {
  static async orchestrate(
    brandUrl: string, 
    adImage: { url?: string; base64?: { data: string; mimeType: string } }, 
    templateObj?: any, 
    userApiKey?: string
  ): Promise<LandingPageResult> {
    const response = await fetch("/api/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandUrl, adImage, templateObj, userApiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to orchestrate landing page");
    }

    const data = await response.json() as LandingPageResult;
    
    // Log Agent logic to client console for debug visibility
    if (data.logs && data.logs.length > 0) {
      console.group('%c[AGENT_TRACE] Operational Manifest', 'color: #3b82f6; font-weight: bold;');
      data.logs.forEach(log => {
        console.log(`%c[${log.agentName}] %c(${log.agentRole || 'Agent'}): %c${log.message}`, 'color: #3b82f6; font-weight: bold;', 'color: #94a3b8;', 'color: #e2e8f0;');
      });
      console.groupEnd();
    }

    return data;
  }
}
