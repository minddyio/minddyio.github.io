import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getTranslations, type Locale } from "../i18n";
import Carousel from "./ui/Carousel";

interface RoadmapProps {
  locale: Locale;
}

export default function Roadmap({ locale }: RoadmapProps) {
  const t = getTranslations(locale);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="roadmap" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-accent text-sm font-medium mb-4">
            {t.roadmap.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {t.roadmap.title}{" "}
            <span className="gradient-text">{t.roadmap.titleHighlight}</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-[#ff6b9d] rounded-full" />

          <Carousel
            mobileOnly
            loop={false}
            itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
            desktopClassName="grid lg:grid-cols-4 gap-6"
          >
            {t.roadmap.phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative h-full"
              >
                {/* Card */}
                <div className="card h-full">
                  {/* Phase badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-primary/20 text-accent">
                    {phase.phase}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4">
                    {phase.title}
                  </h3>

                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-text-light">
                        <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
