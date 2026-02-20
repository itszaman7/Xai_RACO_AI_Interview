"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

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
      className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 overflow-visible bg-transparent md:bg-transparent pointer-events-none" 
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none" />

      {/* Hero Copy — parallax on scroll */}
      <motion.div
        className="relative z-20 w-full max-w-7xl mx-auto space-y-8 pass-through px-6 pointer-events-none"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center mix-blend-difference pointer-events-none">
            <Reveal yOffset={40}>
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-zinc-500/30 bg-zinc-500/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300">01. Vision & Global Presence</span>
                </div>
                <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white mb-6">
                  Turn Raw Data into<br /> <span className="text-zinc-500">Actionable Intelligence.</span>
                </h2>
                <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed pointer-events-auto">
                  Xai unifies your data streams, processes them with agentic AI, and delivers clear decision metrics in real-time.
                </p>
                {/* CTAs */}
                <div className="pt-8 pointer-events-auto">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="primary" className="min-w-[180px] justify-center">
                    Start Deployment
                    </Button>

                    <Button variant="secondary" className="min-w-[180px] justify-center">
                    Read Documentation
                    </Button>
                </div>
                </div>
            </Reveal>
        </div>
      </motion.div>
    </section>
  );
}
