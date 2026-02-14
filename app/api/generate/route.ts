import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { product, targetAudience, tone } = await req.json();

    if (!product || !targetAudience) {
      return NextResponse.json({ error: "Заполни все поля" }, { status: 400 });
    }

    const prompt = `
Ты — эксперт по cold email маркетингу с 10-летним опытом.

Продукт: ${product}
Целевая аудитория: ${targetAudience}
Тон: ${tone}

Сгенерируй 3 уникальных cold email письма.

Каждое письмо должно содержать:
- Цепляющую тему письма (subject line)
- Тело письма (body) с персонализацией, описанием проблемы, решением и call-to-action

ВАЖНО: Ответь ТОЛЬКО валидным JSON массивом. Без markdown. Без тройных кавычек. Без слова json. Просто чистый JSON.
Формат:
[{"subject": "тема1", "body": "текст1"}, {"subject": "тема2", "body": "текст2"}, {"subject": "тема3", "body": "текст3"}]
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
