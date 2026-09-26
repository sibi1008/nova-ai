import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const result = await client.images.generate({
      model: "gpt-image-2",
      prompt: prompt
    });

    const image = result.data?.[0]?.b64_json;

    if (!image) {
      return res.status(500).json({
        error: "No image returned"
      });
    }

    res.status(200).json({
      image: `data:image/png;base64,${image}`
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message || "Image generation failed"
    });
  }
}
