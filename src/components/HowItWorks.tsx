import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getTranslations, type Locale } from "../i18n";

interface HowItWorksProps {
  locale: Locale;
}

export default function HowItWorks({ locale }: HowItWorksProps) {
  const t = getTranslations(locale);
  const [activeTab, setActiveTab] = useState<"clients" | "specialists">("clients");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = activeTab === "clients" ? t.howItWorks.clientSteps : t.howItWorks.specialistSteps;

  return (
    <section id="how-it-works" className="section-padding bg-background-alt" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-accent text-sm font-medium mb-4">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {locale === "en" ? "Simple steps to better" : locale === "ru" ? "Простые шаги к лучшему" : "Прості кроки до кращого"}{" "}
            <span className="gradient-text">{locale === "en" ? "mental health" : locale === "ru" ? "ментальному здоровью" : "ментального здоров'я"}</span>
          </h2>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1.5 rounded-full bg-surface border border-primary/20">
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === "clients"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30"
                  : "text-text-light hover:text-accent"
              }`}
            >
              {t.howItWorks.clientTab}
            </button>
            <button
              onClick={() => setActiveTab("specialists")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === "specialists"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30"
                  : "text-text-light hover:text-accent"
              }`}
            >
              {t.howItWorks.specialistTab}
            </button>
          </div>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-[#ff6b9d]" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`relative flex items-center gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Step Number */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-bold text-sm z-10 shadow-lg shadow-primary/30">
                  {step.step}
                </div>

                {/* Content Card */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-light">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
