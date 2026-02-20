"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Button({ 
  children, 
  href, 
  variant = "primary", 
  className = "",
  icon: Icon = ArrowRight,
  onClick,
  style = {}
}) {
  const isLink = !!href;
  const Component = isLink ? motion.a : motion.button;
  const props = isLink ? { href } : { onClick };

  if (variant === "primary") {
    return (
      <Component
        {...props}
        className={`relative px-8 py-4 bg-white text-black text-sm font-bold rounded-full cursor-pointer overflow-hidden ring-4 ring-white/10 flex items-center justify-center whitespace-nowrap ${className}`}
        whileHover="hovered"
        whileTap={{ scale: 0.97 }}
        initial="initial"
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{ boxShadow: "0 0 20px rgba(255,255,255,0.3)", ...style }}
      >
        {/* Shimmer sweep on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"
          style={{ backgroundSize: "200% 100%" }}
        />
        <div className="relative z-10 flex items-center gap-3">
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
              hovered: { width: "auto", opacity: 1, marginLeft: 0 }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center"
          >
            <Icon size={18} strokeWidth={2.5} />
          </motion.div>
        </div>
      </Component>
    );
  }

  // Secondary / Ghost / Text variants
  return (
    <Component
      {...props}
      whileHover="hovered"
      initial="initial"
      className={`relative px-6 py-3 text-zinc-300 hover:text-white text-sm font-medium cursor-pointer group flex items-center justify-center whitespace-nowrap transition-colors duration-300 ${className}`}
      style={style}
    >
      <motion.div className="flex items-center gap-2">
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
            initial: { width: 0, opacity: 0, x: -5 },
            hovered: { width: "auto", opacity: 1, x: 0 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex items-center"
        >
          <Icon size={14} />
        </motion.div>
      </motion.div>
      <motion.span
        className="absolute bottom-2 left-1/2 -translate-x-1/2 h-px bg-white origin-center"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        style={{ width: "80%" }}
      />
    </Component>
  );
}
