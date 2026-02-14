"use client";
import { useState } from "react";

const texts = {
  russian: {
    title: "AI Генератор Cold Email",
    subtitle: "Опиши свой продукт — получи готовые письма для продаж",
    productLabel: "Опиши свой продукт:",
    productPlaceholder:
      "CRM система для стоматологий которая автоматизирует запись пациентов",
    audienceLabel: "Целевая аудитория:",
    audiencePlaceholder: "Владельцы стоматологий, 30-50 лет",
    toneLabel: "Тон письма:",
    tones: {
      professional: "Профессиональный",
      casual: "Дружелюбный",
      urgent: "Срочный",
      funny: "С юмором",
    },
    langLabel: "Язык:",
    generateBtn: "Сгенерировать письма",
    loadingBtn: "Генерирую письма...",
    resultsTitle: "Готовые письма",
    letter: "Письмо",
    copy: "Копировать",
    copied: "Скопировано!",
    error: "Заполни все поля!",
    serverError: "Ошибка сервера. Попробуй ещё раз.",
  },
  english: {
    title: "AI Cold Email Generator",
    subtitle: "Describe your product — get ready-to-send sales emails",
    productLabel: "Describe your product:",
    productPlaceholder:
      "CRM system for dental clinics that automates patient scheduling",
    audienceLabel: "Target audience:",
    audiencePlaceholder: "Dental clinic owners, 30-50 years old",
    toneLabel: "Email tone:",
    tones: {
      professional: "Professional",
      casual: "Casual",
      urgent: "Urgent",
      funny: "Funny",
    },
    langLabel: "Language:",
    generateBtn: "Generate emails",
    loadingBtn: "Generating emails...",
    resultsTitle: "Generated emails",
    letter: "Email",
    copy: "Copy",
    copied: "Copied!",
    error: "Fill in all fields!",
    serverError: "Server error. Try again.",
  },
};

export default function Home() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("russian");
  const [emails, setEmails] = useState<{ subject: string; body: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const t = texts[language as keyof typeof texts];

  const generateEmails = async () => {
    if (!product || !audience) {
      setError(t.error);
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
          language,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setEmails(data.emails);
      }
    } catch {
      setError(t.serverError);
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
        {/* Переключатель языка сверху */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setLanguage("russian")}
            className={`px-3 py-1 rounded-l-lg text-sm cursor-pointer ${
              language === "russian"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            🇷🇺 RU
          </button>
          <button
            onClick={() => setLanguage("english")}
            className={`px-3 py-1 rounded-r-lg text-sm cursor-pointer ${
              language === "english"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            🇺🇸 EN
          </button>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3">{t.title}</h1>
          <p className="text-gray-400 text-lg">{t.subtitle}</p>
        </div>

        {/* Форма */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {t.productLabel}
            </label>
            <textarea
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder={t.productPlaceholder}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {t.audienceLabel}
            </label>
            <input
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder={t.audiencePlaceholder}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              {t.toneLabel}
            </label>
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">{t.tones.professional}</option>
              <option value="casual">{t.tones.casual}</option>
              <option value="urgent">{t.tones.urgent}</option>
              <option value="funny">{t.tones.funny}</option>
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
            {loading ? t.loadingBtn : t.generateBtn}
          </button>
        </div>

        {/* Результаты */}
        {emails.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold">
              {t.resultsTitle} ({emails.length})
            </h2>

            {emails.map((email, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">
                      {t.letter} {i + 1}
                    </span>
                    <h3 className="font-bold text-blue-400 text-lg">
                      {email.subject}
                    </h3>
                  </div>
                  <button
                    onClick={() => copyEmail(i, email)}
                    className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied === i ? t.copied : t.copy}
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
