"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------------------------------------------------------
   Visual Components (Custom Right Sides)
   --------------------------------------------------------------- */
function CodeVisual({ color }) {
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

function NeuralVisual({ color }) {
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

function GraphVisual({ color }) {
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
   Data
   --------------------------------------------------------------- */
const features = [
  {
    id: "01",
    title: "Ingest Data",
    desc: "Discovering, preparing, and moving all sorts of data from diverse sources into AI systems for training, analysis, or real-time decision-making.",
    color: "#fbbf24",
    btnText: "Learn more",
    Visual: CodeVisual
  },
  {
    id: "02",
    title: "Analyze AI",
    desc: "Use of artificial intelligence — particularly machine learning, natural language processing (NLP), and large language models (LLMs) — to automate and enhance data analysis.",
    color: "#22d3ee",
    btnText: "Learn more",
    Visual: NeuralVisual
  },
  {
    id: "03",
    title: "Generate Insight",
    desc: "Get actionable intelligence derived from analyzing massive datasets using artificial intelligence, machine learning, and natural language processing.",
    color: "#d946ef",
    btnText: "Learn more",
    Visual: GraphVisual
  },
];

/* ---------------------------------------------------------------
   Pipeline Card (Reusable Component)
   --------------------------------------------------------------- */
function PipelineCard({ feature }) {
  const { Visual, color, id, title, desc, btnText } = feature;
  
  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
      <div
        className="card-inner relative overflow-hidden rounded-[32px] md:rounded-[40px] border border-white/10 bg-black/80 backdrop-blur-3xl w-full max-w-6xl shadow-2xl group transition-colors duration-500"
        style={{
          height: "auto",
          minHeight: "min(500px, 70vh)",
        }}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left — text */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <Reveal yOffset={10}>
              <div
                className="text-3xl md:text-4xl font-mono font-bold mb-4 md:mb-6 opacity-30"
                style={{ color: color }}
              >
                {id}
              </div>
            </Reveal>
            <Reveal delay={100} yOffset={20}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight">
                {title}
              </h2>
            </Reveal>
            <Reveal delay={200} yOffset={20}>
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md">
                {desc}
              </p>
            </Reveal>
            
            <Reveal delay={300} yOffset={20}>
                <Button 
                  variant="primary" 
                  style={{ backgroundColor: color }}
                  className="bg-transparent text-black" 
                >
                  {btnText}
                </Button>
            </Reveal>
          </div>

          {/* Right — visual (DYNAMIC INJECTION) */}
          <div className="relative h-full bg-zinc-900/10 border-l border-white/5 hidden lg:flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
            
            {/* Ambient glow in visual area */}
            <div 
              className="absolute w-64 h-64 blur-[100px] opacity-10"
              style={{ backgroundColor: color }}
            />
            
            {/* Render the specific visual component */}
            <Visual color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Pipeline — GSAP ScrollTrigger stacking cards
   --------------------------------------------------------------- */
export default function Pipeline() {
  const containerRef = useRef(null);
  const progressRef = useRef(0); 

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".pipeline-card");
      ScrollTrigger.refresh();

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
        if (index === cards.length - 1) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

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
      id="pipeline-section"
      ref={containerRef}
      className="relative z-10 py-24 bg-transparent" 
    >
      
      <div className="relative z-10">
      {/* Heading */}
      <div className="max-w-4xl mx-auto px-6 mb-32 text-center flex flex-col items-center justify-center">
        <div ref={(el) => {
             if (!el) return;
             const tl = gsap.timeline({
               scrollTrigger: {
                 trigger: el,
                 start: "top 75%",
                 end: "center 45%",
                 scrub: 1,
               }
             });
             tl.fromTo(el, { scale: 0.8, opacity: 0, y: 100 }, { scale: 1, opacity: 1, y: 0 });
        }}>
          <Badge className="mb-6">Architecture</Badge>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            The Intelligence Pipeline
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-xl leading-relaxed">
            From raw chaos to structured form via automated spatial reasoning.
          </p>
        </div>
      </div>

      {/* Stacking cards track */}
      <div id="pipeline-track" className="relative max-w-6xl mx-auto px-6 pb-24 min-h-[300vh]">
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

