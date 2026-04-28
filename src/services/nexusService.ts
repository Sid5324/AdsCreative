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

    return await response.json();
  }
}
