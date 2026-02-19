"use client";

import { useState, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* ---------------------------------------------------------------
   MagneticWrap — Cursor-aware pull effect (Awwwards staple)
   --------------------------------------------------------------- */
function MagneticWrap({ children, strength = 0.15 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   Navbar — Floating island with scroll-aware hide/show
   --------------------------------------------------------------- */
const NAV_LINKS = ["Product", "Methodology", "Customers", "Pricing"];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious();
    setHidden(latest > prev && latest > 150);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] md:w-auto max-w-4xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex items-center justify-between gap-4 md:gap-8 shadow-2xl relative"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 pr-4 md:border-r border-white/10 cursor-pointer shrink-0 z-50">
          <motion.div
            className="w-5 h-5 bg-white rounded-full"
            whileHover={{ scale: 1.15, boxShadow: "0 0 15px rgba(255,255,255,0.7)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ boxShadow: "0 0 10px rgba(255,255,255,0.8)" }}
          />
          <span className="font-sans font-bold text-sm tracking-tight text-white">
            Xai
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <motion.a
              key={item}
              href="#"
              className="relative text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-full"
              onMouseEnter={() => setHoveredLink(item)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <AnimatePresence>
                {hoveredLink === item && (
                  <motion.span
                    className="absolute inset-0 bg-white/10 rounded-full"
                    layoutId="navHighlight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{item}</span>
            </motion.a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/10 shrink-0">
          <motion.a
            href="#"
            className="text-xs font-medium text-white/70 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.a>

          <motion.button
            className="group bg-white text-black px-5 py-2 text-xs font-bold rounded-full cursor-pointer shadow-lg flex items-center whitespace-nowrap overflow-hidden"
            whileHover="hovered"
            whileTap={{ scale: 0.96 }}
            initial="initial"
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.span 
              variants={{
                initial: { x: 0 },
                hovered: { x: -2 }
              }}
            >
              Get Started
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
          </motion.button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="md:hidden text-white z-50 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-4 bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((item) => (
                  <a key={item} href="#" className="text-zinc-400 hover:text-white text-sm py-2 px-2 rounded-lg hover:bg-white/5 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex flex-col gap-4">
                <a href="#" className="text-center text-sm font-medium text-white/70 hover:text-white">Login</a>
                <button className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
}
