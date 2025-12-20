import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getTranslations, type Locale } from "../i18n";
import Carousel from "./ui/Carousel";

interface TokenUtilityProps {
  locale: Locale;
}

export default function TokenUtility({ locale }: TokenUtilityProps) {
  const t = getTranslations(locale);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="token" className="section-padding relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-surface/50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
            {t.tokenUtility.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">{t.siteConfig.tokenSymbol}</span>: {t.tokenUtility.title}
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            {t.tokenUtility.subtitle}
          </p>
        </motion.div>

        {/* Utility Grid */}
        <Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }} gap={16}>
          {t.tokenUtility.items.map((utility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="group h-full"
            >
              <div className="card h-full text-center hover:border-accent/40">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-accent/30 transition-all">
                  <span className="text-2xl">{utility.icon}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {utility.title}
                </h3>
                <p className="text-sm text-text-light">
                  {utility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </Carousel>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-text-muted/60 text-center mt-12 max-w-2xl mx-auto"
        >
          {t.siteConfig.tokenSymbol} {t.tokenUtility.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}
