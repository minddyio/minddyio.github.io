import { motion } from "framer-motion";
import { BOT_LINK } from "../lib/links";
import { getTranslations, type Locale } from "../i18n";

interface HeroProps {
  locale: Locale;
}

export default function Hero({ locale }: HeroProps) {
  const t = getTranslations(locale);
  const words = t.hero.headline.split(" ");

  const highlightWords = locale === "en"
    ? ["Intelligent,", "Private,", "Available"]
    : locale === "ru"
    ? ["умное,", "приватное", "доступное"]
    : ["розумне,", "приватне", "доступне"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="floating-blob w-[600px] h-[600px] bg-primary/50 -top-48 -right-48"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="floating-blob w-[500px] h-[500px] bg-accent/20 -bottom-32 -left-32"
        />
        <motion.div
          animate={{
            x: [0, 15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="floating-blob w-[300px] h-[300px] bg-[#ff6b9d]/20 top-1/3 left-1/4"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-primary/30 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-sm font-medium text-text-light">
            {t.hero.presaleStatus}
          </span>
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
              }}
              className="inline-block mr-[0.25em]"
            >
              {highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase().replace(",", ""))) ? (
                <span className="gradient-text">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg sm:text-xl text-text-light max-w-3xl mx-auto mb-10"
        >
          {locale === "en"
            ? "AI-powered platform connecting you with the right psychologist. Try their digital twin before committing. Get support between sessions. All secured by blockchain."
            : locale === "ru"
            ? "AI-платформа, которая соединяет вас с подходящим психологом. Попробуйте цифрового двойника перед записью. Получайте поддержку между сессиями. Всё защищено блокчейном."
            : "AI-платформа, яка з'єднує вас з відповідним психологом. Спробуйте цифрового двійника перед записом. Отримуйте підтримку між сесіями. Все захищено блокчейном."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.a
            href={BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t.hero.joinWaitlist}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
