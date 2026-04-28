import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileData, mimeType, userBlobToken } = req.body;
    const token = userBlobToken || process.env.BLOB_READ_WRITE_TOKEN || process.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      console.error("[Nexus] Error: Blob token is missing.");
      return res.status(400).json({ error: "Vercel Blob Token is missing." });
    }

    console.info(`[Nexus] Uploading to Blob: \${fileName}`);
    const buffer = Buffer.from(fileData, 'base64');
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: mimeType,
      token: token
    });
    
    console.log(`[Nexus] Upload Success: \${blob.url}`);
    res.status(200).json(blob);
  } catch (error: any) {
    console.error("[Nexus] Upload Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
