"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

/* ---------------------------------------------------------------
   Text line reveal — clip-path mask animation
   --------------------------------------------------------------- */
const lineVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.08,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

/* ---------------------------------------------------------------
   Hero — Data → Intelligence
   --------------------------------------------------------------- */
export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: text lifts away as user scrolls
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 overflow-visible bg-transparent md:bg-transparent" // Transparent so canvas shows through
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none" />

      {/* Hero Copy — parallax on scroll */}
      <motion.div
        className="relative z-20 w-full max-w-7xl mx-auto space-y-8 pass-through px-6"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <Badge 
            icon={
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            }
          >
            Xai Intelligence Workspace
          </Badge>
        </motion.div>

        {/* Headline — clipped text reveal + Hover Shine */}
        <div className="overflow-visible cursor-default pointer-events-auto">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]"
          >
            {["Turn Raw Data into", "Actionable Intelligence"].map((line, i) => (
              <span key={i} className="block overflow-hidden py-4 -my-4">
                <motion.div
                  className="flex flex-wrap md:flex-nowrap justify-center gap-x-[0.25em]" // md:flex-nowrap forces single line on desktop
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={lineVariants}
                >
                  {line.split(" ").map((word, wI) => (
                    <motion.span
                      key={wI}
                      className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-white to-zinc-500 bg-[length:200%_auto]"
                      initial={{ backgroundPosition: "0% 0%" }}
                      whileHover={{ 
                        backgroundPosition: "-100% 0%",
                        transition: { duration: 0.6, ease: "linear" }
                      }}
                      style={{ backgroundPosition: "0% 0%" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="max-w-xl mx-auto"
        >
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light pointer-auto">
            Xai unifies your data streams, processes them with agentic AI, and
            delivers clear decision metrics in real-time.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="pt-4 pointer-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button variant="primary" className="min-w-[180px]">
              Get Started
            </Button>

            <Button variant="secondary" className="min-w-[180px]">
              Read Documentation
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
