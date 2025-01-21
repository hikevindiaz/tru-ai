import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { apiKey } = req.body;

  if (!apiKey || !apiKey.startsWith("sk-")) {
    return res.status(400).json({ success: false, message: "Invalid API key format." });
  }

  try {
    // Test API key by fetching available models
    const response = await axios.get("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.status === 200) {
      return res.status(200).json({ success: true, message: "API key is valid." });
    }

    return res.status(400).json({ success: false, message: "Invalid API key." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to validate API key." });
  }
}
