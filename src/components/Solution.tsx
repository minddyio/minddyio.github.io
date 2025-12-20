import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getTranslations, type Locale } from "../i18n";
import Carousel from "./ui/Carousel";

interface SolutionProps {
  locale: Locale;
}

export default function Solution({ locale }: SolutionProps) {
  const t = getTranslations(locale);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="solution" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-accent text-sm font-medium mb-4">
            {t.solutions.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t.solutions.title}{" "}
            <span className="gradient-text">{t.solutions.titleHighlight}</span>
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            {locale === "en"
              ? "We combine innovations with human expertise to transform mental healthcare"
              : locale === "ru"
              ? "Мы объединяем инновации с человеческой экспертизой для трансформации ментального здоровья"
              : "Ми поєднуємо інновації з людською експертизою для трансформації ментального здоров'я"}
          </p>
        </motion.div>

        {/* Solution Cards */}
        <Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}>
          {t.solutions.items.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="card group relative overflow-hidden h-full"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{solution.icon}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {solution.title}
                </h3>

                <p className="text-text-light leading-relaxed">
                  {solution.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors" />
            </motion.div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
