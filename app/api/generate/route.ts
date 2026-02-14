import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { product, targetAudience, tone, language } = await req.json();

    if (!product || !targetAudience) {
      return NextResponse.json({ error: "Заполни все поля" }, { status: 400 });
    }

    const prompt = `
You are an expert cold email marketer with 10 years of experience.

Product: ${product}
Target audience: ${targetAudience}
Tone: ${tone}
Language: ${language === "english" ? "English" : "Russian"}

Generate 3 unique cold email letters in ${language === "english" ? "English" : "Russian"} language.

Each letter must contain:
- A catchy subject line
- Body with personalization, problem description, solution and call-to-action

IMPORTANT: Reply ONLY with a valid JSON array. No markdown. No triple backticks. No word json. Just clean JSON.
Format:
[{"subject": "subject1", "body": "body1"}, {"subject": "subject2", "body": "body2"}, {"subject": "subject3", "body": "body3"}]
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || "[]";

    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const emails = JSON.parse(cleaned);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Ошибка:", error);
    return NextResponse.json(
      { error: "Что-то пошло не так. Попробуй ещё раз." },
      { status: 500 },
    );
  }
}
