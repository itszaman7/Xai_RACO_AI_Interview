"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const BlockGlobe = dynamic(() => import("@/components/canvas/BlockGlobe"), {
  ssr: false,
});

/* ---------------------------------------------------------------
   MagneticButton — Awwwards-style cursor-aware hover + fill
   --------------------------------------------------------------- */
function MagneticButton({ children, className = "", href, variant = "primary" }) {
  if (variant === "primary") {
    return (
      <motion.button
        className={`relative px-8 py-4 bg-white text-black text-sm font-bold rounded-full cursor-pointer overflow-hidden ring-4 ring-white/10 flex items-center whitespace-nowrap ${className}`}
        whileHover="hovered"
        whileTap={{ scale: 0.97 }}
        initial="initial"
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
      >
        {/* Shimmer sweep on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"
          style={{ backgroundSize: "200% 100%" }}
        />
        <div className="relative z-10 flex items-center justify-center w-full">
          <motion.span 
            variants={{
              initial: { x: 0 },
              hovered: { x: -4 }
            }}
          >
            {children}
          </motion.span>
          <motion.div
            variants={{
              initial: { width: 0, opacity: 0, marginLeft: 0 },
              hovered: { width: "auto", opacity: 1, marginLeft: 12 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center"
          >
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href || "#"}
      whileHover="hovered"
      initial="initial"
      className={`relative px-6 py-3 text-zinc-300 hover:text-white text-sm font-medium cursor-pointer group flex items-center whitespace-nowrap pointer-auto transition-colors duration-300 ${className}`}
    >
      <motion.div className="flex items-center justify-center w-full">
        <motion.span
          variants={{
            initial: { x: 0 },
            hovered: { x: -2 }
          }}
        >
          {children}
        </motion.span>
        <motion.div
          variants={{
            initial: { width: 0, opacity: 0, marginLeft: 0 },
            hovered: { width: "auto", opacity: 1, marginLeft: 8 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center"
        >
          <ArrowRight size={14} />
        </motion.div>
      </motion.div>
      <motion.span
        className="absolute bottom-2 left-1/2 -translate-x-1/2 h-px bg-white origin-center"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        style={{ width: "80%" }}
      />
    </motion.a>
  );
}

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

  // Globe parallax: sinks slightly, scales up, and fades out
  // const globeY = useTransform(scrollYProgress, [0, 0.8], [0, 150]); // Disabled per user request
  // const globeScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.5]); // Disabled
  const globeOpacity = useTransform(scrollYProgress, [0, 0.6], [0.6, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid z-0 opacity-20 pointer-events-none" />

      {/* 3D Globe */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ 
          // Removed y and scale to prevent awkward scrolling jumps
          opacity: globeOpacity,
          perspective: "1000px" 
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <BlockGlobe />
        </div>
      </motion.div>

      {/* Hero Copy — parallax on scroll */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto space-y-8 pass-through"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md pointer-auto">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300">
              System v2.4 Available
            </span>
          </div>
        </motion.div>

        {/* Headline — clipped text reveal */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.95]"
          >
            {["Turn Raw Data into", "Actionable Intelligence"].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={lineVariants}
                >
                  {line}
                </motion.span>
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
            <MagneticButton variant="primary" className="min-w-[180px] justify-center">
              Get Started
            </MagneticButton>

            <MagneticButton variant="secondary" className="min-w-[180px] justify-center">
              Read Documentation
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
