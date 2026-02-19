"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

/* ---------------------------------------------------------------
   Data
   --------------------------------------------------------------- */
const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Integration", "Pricing", "Change log"],
  },
  {
    title: "Resources",
    links: ["Documentation", "API Reference", "Community", "Blog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Privacy Policy", "Terms of Service"],
  },
];

/* ---------------------------------------------------------------
   MagneticWrap — subtle cursor pull
   --------------------------------------------------------------- */
function MagneticWrap({ children, strength = 0.25 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   FooterLink — animated underline reveal + arrow slide
   --------------------------------------------------------------- */
function FooterLink({ text }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="#"
      className="relative inline-flex items-center gap-1 text-sm text-zinc-500 cursor-pointer group py-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ x: 6, color: "#ffffff" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <span>{text}</span>
      <motion.span
        initial={{ opacity: 0, x: -4 }}
        animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRight size={12} />
      </motion.span>

      {/* Underline */}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-white/40 origin-left"
        initial={{ scaleX: 0 }}
        animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        style={{ width: "100%" }}
      />
    </motion.a>
  );
}

/* ---------------------------------------------------------------
   Footer
   --------------------------------------------------------------- */
export default function Footer() {
  return (
    <footer className="pt-24 pb-12 border-t border-white/5 bg-[#050505] text-left relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <Reveal delay={100} yOffset={20}>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-6 cursor-pointer">
                    Xai
                  </h2>
              </Reveal>
              <Reveal delay={200} yOffset={20}>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px] mb-12">
                  Turning raw data into
                  <br /> actionable intelligence.
                </p>
              </Reveal>
            </div>
            <Reveal delay={300} yOffset={20}>
              <div className="text-sm text-zinc-600">© 2026 RacoAI, Inc.</div>
            </Reveal>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col, ci) => (
            <div key={col.title} className="lg:col-span-2">
              <Reveal delay={200 + ci * 100} yOffset={20}>
                <h3 className="text-white font-medium mb-6">{col.title}</h3>
              </Reveal>
              <ul className="space-y-3">
                {col.links.map((link, li) => (
                  <li key={link}>
                    <Reveal delay={300 + ci * 100 + li * 80} yOffset={10}>
                      <FooterLink text={link} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <Reveal delay={500} yOffset={20}>
              <h3 className="text-white font-medium mb-6">Newsletter</h3>
            </Reveal>
            <Reveal delay={600} yOffset={20}>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Subscribe to our newsletter to get all latest updates about our
                products.
              </p>
            </Reveal>
            <Reveal delay={700} yOffset={20}>
              <div className="relative flex items-center group mt-2">
                <input
                  type="email"
                  placeholder="@ Enter your email..."
                  className="w-full bg-transparent border border-zinc-800 rounded-full py-3.5 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                />
                  <motion.button
                    className="absolute right-1.5 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(255,255,255,0.35)",
                    }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{ boxShadow: "0 0 10px rgba(255,255,255,0.15)" }}
                  >
                    <ArrowRight size={16} strokeWidth={2.5} className="relative z-10" />
                  </motion.button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </footer>
  );
}
