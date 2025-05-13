// lib/gemini.ts
import axios from "axios";

const GEMINI_API_URL = process.env.GEMINI_API_URL;

export async function generateGeminiContent(prompt: string) {
  try {
    // Security Measure 4: HTTPS Use
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a responsive HTML + Tailwind website based on this prompt, give code only. No tips and improvement text at the end:\n${prompt}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data as {
      candidates?: { content?: { parts?: { text: string }[] } }[];
    };
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "No response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong.";
  }
}
