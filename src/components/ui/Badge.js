"use client";

import { motion } from "framer-motion";

export default function Badge({ 
  children, 
  icon, 
  className = "",
  variant = "default" // default, outline, glow
}) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md ${className}`}>
      {icon && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300">
        {children}
      </span>
    </div>
  );
}
