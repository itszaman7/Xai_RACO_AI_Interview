"use client";

import { motion } from "framer-motion";

/**
 * Reveal — Scroll-triggered reveal wrapper using Framer Motion.
 * Fades in and slides up with a spring physics when entering viewport.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  yOffset = 20,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay: delay / 1000,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
