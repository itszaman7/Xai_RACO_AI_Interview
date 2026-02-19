"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import dynamic from "next/dynamic";

const MorphingGeometry = dynamic(() => import("@/components/canvas/MorphingGeometry"), { ssr: false });
import { Canvas } from "@react-three/fiber";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------------------------------------------------------
   Data
   --------------------------------------------------------------- */
const features = [
  {
    id: "01",
    title: "Ingest Data",
    desc: "Discovering, preparing, and moving all sorts of data from diverse sources into AI systems for training, analysis, or real-time decision-making.",
    color: "#fbbf24",
    btnText: "Learn more",
  },
  {
    id: "02",
    title: "Analyze AI",
    desc: "Use of artificial intelligence — particularly machine learning, natural language processing (NLP), and large language models (LLMs) — to automate and enhance data analysis.",
    color: "#22d3ee",
    btnText: "Learn more",
  },
  {
    id: "03",
    title: "Generate Insight",
    desc: "Get actionable intelligence derived from analyzing massive datasets using artificial intelligence, machine learning, and natural language processing.",
    color: "#d946ef",
    btnText: "Learn more",
  },
];

/* ---------------------------------------------------------------
   MagneticWrap — subtle cursor pull
   --------------------------------------------------------------- */
function MagneticWrap({ children, strength = 0.15 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

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
   Card visuals (right-hand column)
   --------------------------------------------------------------- */
function CardVisual({ id, color }) {
  if (id === "01") {
    return (
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 1 }}
        className="p-6 bg-black border border-white/10 rounded-lg font-mono text-sm text-yellow-100 shadow-2xl max-w-sm w-full transition-colors duration-300"
      >
        <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <pre className="whitespace-pre-wrap text-xs md:text-sm">
          <span className="text-purple-400">def</span>{" "}
          <span className="text-yellow-400">ingest_stream</span>(source):
          {"\n"}
          &nbsp;&nbsp;
          <span className="text-zinc-500"># Connect to firehose</span>
          {"\n"}
          &nbsp;&nbsp;stream = source.connect(){"\n"}
          &nbsp;&nbsp;<span className="text-purple-400">while</span>{" "}
          stream.is_active:{"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;data = stream.read(){"\n"}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="text-blue-400">yield</span> normalize(data)
        </pre>
      </motion.div>
    );
  }

  if (id === "02") {
    return (
      <motion.div 
        whileHover={{ scale: 1.05, rotate: -1 }}
        className="p-6 bg-black border border-white/10 rounded-lg font-mono text-xs text-cyan-100 shadow-2xl max-w-sm w-full transition-colors duration-300"
      >
        <div className="mb-4 text-cyan-500 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          &gt; Initiating Neural Matrix...
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Vectorizing inputs</span>
            <span className="text-green-400">DONE</span>
          </div>
          <div className="flex justify-between">
            <span>Optimizing weights</span>
            <span className="text-green-400">98%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "98%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-cyan-500 h-full" 
            />
          </div>
          <div className="flex justify-between mt-2">
            <span>Pattern recognition</span>
            <span className="text-yellow-400">RUNNING</span>
          </div>
          <div className="text-zinc-500 mt-2 text-[10px] opacity-70">
            Output: Tensor[4096, 128] ready for context injection.
          </div>
        </div>
      </motion.div>
    );
  }

  // id === "03"
  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      className="relative w-64 h-64"
    >
      {[20, 32, 48, 40, 56].map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
          style={{ 
            height: `${h}%`, 
            left: `${i * 52}px`,
            backgroundColor: i === 4 ? color : `${color}40`,
            borderColor: `${color}80`
          }}
          className="absolute bottom-0 w-8 border-t border-x rounded-t origin-bottom shadow-lg"
        >
          {i === 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, repeat: Infinity, repeatType: "reverse", duration: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
            >
              +24.8%
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   Pipeline Card (individual)
   --------------------------------------------------------------- */
function PipelineCard({ feature }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-12">
      <div
        className="card-inner relative overflow-hidden rounded-[40px] border border-white/10 bg-black/80 backdrop-blur-3xl w-full max-w-6xl shadow-2xl group transition-colors duration-500"
        style={{
          height: "min(600px, 85vh)",
        }}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left — text */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <Reveal yOffset={10}>
              <div
                className="text-4xl font-mono font-bold mb-6 opacity-30"
                style={{ color: feature.color }}
              >
                {feature.id}
              </div>
            </Reveal>
            <Reveal delay={100} yOffset={20}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                {feature.title}
              </h2>
            </Reveal>
            <Reveal delay={200} yOffset={20}>
              <p className="text-zinc-300 text-lg leading-relaxed mb-10 max-w-md">
                {feature.desc}
              </p>
            </Reveal>
            
            <Reveal delay={300} yOffset={20}>
                <motion.button
                  whileHover="hovered"
                  whileTap={{ scale: 0.95 }}
                  initial="initial"
                  className="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-black cursor-pointer shadow-lg hover:shadow-xl flex items-center whitespace-nowrap overflow-hidden transition-all duration-300"
                  style={{ backgroundColor: feature.color }}
                >
                  <motion.span
                    variants={{
                      initial: { x: 0 },
                      hovered: { x: -4 }
                    }}
                  >
                    {feature.btnText}
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
            </Reveal>
          </div>

          {/* Right — visual */}
          <div className="relative h-full bg-zinc-900/10 border-l border-white/5 hidden lg:flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
            
            {/* Ambient glow in visual area */}
            <div 
              className="absolute w-64 h-64 blur-[100px] opacity-10"
              style={{ backgroundColor: feature.color }}
            />
            
            <CardVisual id={feature.id} color={feature.color} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Pipeline — GSAP ScrollTrigger stacking cards
   --------------------------------------------------------------- */
/* ---------------------------------------------------------------
   Pipeline — GSAP ScrollTrigger stacking cards
   --------------------------------------------------------------- */
export default function Pipeline() {
  const containerRef = useRef(null);
  const progressRef = useRef(0); // Mutable ref for 3D sync

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".pipeline-card");
      ScrollTrigger.refresh();

      // Track total scroll progress of the container
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        }
      });

      cards.forEach((card, index) => {
        // Animate previous card (Card Leave Animation)
        if (index === cards.length - 1) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // 1. Scale and Rotate as it leaves
        tl.to(card, {
          scale: 0.7, 
          borderRadius: "48px",
          ease: "none",
        }).to(
          card,
          {
            rotation: index % 2 === 0 ? 4 : -4, 
            ease: "sine.inOut",
          },
          0
        );

        // 2. Hide when next card arrives
        if (index < cards.length - 1) {
          gsap.to(card, {
            opacity: 0,
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top 50%", 
              end: "top top",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="bg-black relative z-10 py-24 min-h-[300vh]"
    >
      {/* Signature Interaction: Morphing 3D Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <div className="sticky top-0 h-screen w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
            <Canvas camera={{ position: [0, 0, 40], fov: 45 }} gl={{ alpha: true, antialias: true }}>
               <ambientLight intensity={0.5} />
               {/* Shift to the right to be visible beside the cards */}
               <group position={[14, 0, 0]}>
                 <MorphingGeometry scrollProgress={progressRef} />
               </group>
            </Canvas>
         </div>
      </div>

      <div className="relative z-10">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-6 mb-24 text-left">
        <Reveal>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-zinc-800" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Architecture</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Intelligence Pipeline</h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-zinc-500 max-w-sm">From raw chaos to structured form via automated spatial reasoning.</p>
        </Reveal>
      </div>

      {/* Stacking cards */}
      <div className="relative max-w-6xl mx-auto px-6 pb-24">
        {features.map((feature, i) => (
          <div
            key={feature.id}
            className="pipeline-card sticky top-0 h-screen w-full flex items-center justify-center"
            style={{ 
              zIndex: i + 1,
            }}
          >
            <PipelineCard feature={feature} />
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

