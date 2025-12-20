import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SITE_CONFIG } from "../lib/constants";

const TOKENOMICS_DARK = [
  { label: "Presale", percentage: 25, color: "#9d4edd" },
  { label: "Development", percentage: 25, color: "#7fffd4" },
  { label: "Marketing", percentage: 25, color: "#ff6b9d" },
  { label: "Operations", percentage: 10, color: "#b86ee6" },
  { label: "Reserve", percentage: 15, color: "#4a3a6a" },
];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(eased * value));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [isInView, value]);

  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
}

export default function Tokenomics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-surface text-white relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #9d4edd 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-accent text-sm font-medium mb-4">
            Tokenomics
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Token Distribution
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Total Supply: <span className="text-accent font-semibold">{SITE_CONFIG.totalSupply} {SITE_CONFIG.tokenSymbol}</span>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <svg viewBox="0 0 200 200" className="w-full max-w-md mx-auto drop-shadow-2xl">
              {TOKENOMICS_DARK.reduce((acc, item, index) => {
                const total = TOKENOMICS_DARK.slice(0, index).reduce((sum, i) => sum + i.percentage, 0);
                const startAngle = (total / 100) * 360 - 90;
                const endAngle = ((total + item.percentage) / 100) * 360 - 90;

                const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                const largeArc = item.percentage > 50 ? 1 : 0;

                acc.push(
                  <motion.path
                    key={index}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    stroke="rgba(13, 0, 21, 0.5)"
                    strokeWidth="2"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                );
                return acc;
              }, [] as JSX.Element[])}
              <circle cx="100" cy="100" r="40" fill="#0d0015" />
              <text x="100" y="95" textAnchor="middle" fill="#7fffd4" fontSize="12" fontWeight="bold">
                {SITE_CONFIG.tokenSymbol}
              </text>
              <text x="100" y="110" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">
                1B Total
              </text>
            </svg>
          </motion.div>

          {/* Legend & Stats */}
          <div className="space-y-6">
            {/* Distribution Legend */}
            <div className="space-y-3">
              {TOKENOMICS_DARK.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-accent font-semibold">
                    <AnimatedNumber value={item.percentage} suffix="%" />
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Presale Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/10 border border-primary/40 shadow-lg shadow-primary/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔥</span>
                <h3 className="text-xl font-bold">Presale 1 - Coming Soon</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Price</p>
                  <p className="text-2xl font-bold text-accent">...</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Available</p>
                  <p className="text-2xl font-bold">{SITE_CONFIG.presaleAmount} $MIND</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
