"use client";
import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [emails, setEmails] = useState<{ subject: string; body: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const generateEmails = async () => {
    if (!product || !audience) {
      setError("Заполни все поля!");
      return;
    }

    setError("");
    setLoading(true);
    setEmails([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          targetAudience: audience,
          tone,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setEmails(data.emails);
      }
    } catch {
      setError("Ошибка сервера. Попробуй ещё раз.");
    }

    setLoading(false);
  };

  const copyEmail = (
    index: number,
    email: { subject: string; body: string },
  ) => {
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3">AI Cold Email Generator</h1>
          <p className="text-gray-400 text-lg">
            Опиши свой продукт — получи готовые письма для продаж
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Опиши свой продукт:
            </label>
            <textarea
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="CRM система для стоматологий которая автоматизирует запись пациентов"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Целевая аудитория:
            </label>
            <input
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Владельцы стоматологий, 30-50 лет"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Тон письма:
            </label>
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Профессиональный</option>
              <option value="casual">Дружелюбный</option>
              <option value="urgent">Срочный</option>
              <option value="funny">С юмором</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-xl text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={generateEmails}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-xl font-bold text-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Генерирую письма..." : "Сгенерировать письма"}
          </button>
        </div>

        {emails.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold">
              Готовые письма ({emails.length})
            </h2>

            {emails.map((email, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">
                      Письмо {i + 1}
                    </span>
                    <h3 className="font-bold text-blue-400 text-lg">
                      {email.subject}
                    </h3>
                  </div>
                  <button
                    onClick={() => copyEmail(i, email)}
                    className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied === i ? "Скопировано!" : "Копировать"}
                  </button>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {email.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
