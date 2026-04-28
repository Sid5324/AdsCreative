import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageResult } from "../types";

export class NexusService {
  static async orchestrate(brandUrl: string, adImage: { url?: string; base64?: { data: string; mimeType: string } }, templateObj?: any, userApiKey?: string): Promise<LandingPageResult> {
    const response = await fetch("/api/orchestrate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brandUrl, adImage, templateObj, userApiKey }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to orchestrate landing page");
    }

    const data = await response.json() as LandingPageResult;
    
    // Log Agent logic to client console for debug visibility
    if (data.logs && data.logs.length > 0) {
      console.group('[Nexus] Agent Protocol Trace');
      data.logs.forEach(log => {
        console.log(`[${log.agentName}] (${log.agentRole}): ${log.message}`);
      });
      console.groupEnd();
    }

    return data;
  }
}
