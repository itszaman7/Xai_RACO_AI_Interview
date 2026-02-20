"use client";

import { motion } from "framer-motion";

export default function Card({ 
  children, 
  className = "",
  hoverEffect = false,
  ...props 
}) {
  return (
    <motion.div
      className={`relative bg-zinc-900/30 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm ${className}`}
      {...(hoverEffect ? {
        whileHover: { y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" },
        transition: { type: "spring", stiffness: 300, damping: 20 }
      } : {})}
      {...props}
    >
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}
