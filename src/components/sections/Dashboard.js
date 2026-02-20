"use client";

import { useRef, useState } from "react";
import {
  Layers,
  Zap,
  Activity,
  Cpu,
  Search,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------
   Chart data points
   --------------------------------------------------------------- */
// Initial data for charts
const initialPurple = [85, 78, 75, 45, 38, 20, 12];
const initialBlue = [90, 85, 80, 55, 50, 30, 18];

// Helper to generate smooth SVG path
function getSmoothPath(values, width = 700, height = 200) {
  const points = values.map((v, i) => [
    (i / (values.length - 1)) * width,
    v
  ]);

  return points.reduce((acc, [x, y], i, arr) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = arr[i - 1];
    const cp1x = px + (x - px) / 2; // Control point 1
    const cp2x = px + (x - px) / 2; // Control point 2
    return `${acc} C ${cp1x},${py} ${cp2x},${y} ${x},${y}`;
  }, "");
}

function LiveAreaChart({ initialData, color, id }) {
  const [data, setData] = useState(initialData);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1)];
        // Generate new value based on last value with some random variance
        const last = prev[prev.length - 1];
        let newValue = last + (Math.random() - 0.5) * 40;
        newValue = Math.max(10, Math.min(190, newValue)); // Clamp to chart height
        next.push(newValue);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pathD = getSmoothPath(data);
  const areaD = `${pathD} L 700,200 L 0,200 Z`;

  return (
    <>
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area */}
      <motion.path
        d={areaD}
        fill={`url(#${id}-grad)`}
        animate={{ d: areaD }}
        transition={{ duration: 1, ease: "linear" }}
      />
      
      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        animate={{ d: pathD }}
        transition={{ duration: 1, ease: "linear" }}
      />

      {/* Points */}
      {data.map((val, i) => (
        <motion.circle
          key={i}
          cx={(i / (data.length - 1)) * 700}
          cy={val}
          r="4"
          fill="#050505"
          stroke="#fff"
          strokeWidth="2"
          animate={{ cy: val }}
          transition={{ duration: 1, ease: "linear" }}
        />
      ))}
    </>
  );
}

const SIDEBAR_ITEMS = [
  { label: "Overview", icon: Layers },
  { label: "AI Analysis", icon: Cpu },
  { label: "History", icon: Activity },
  { label: "Settings", icon: Zap },
];

const STATS = [
  {
    title: "Live Workflows",
    value: "24",
    sub: "+4 active now",
    subColor: "text-emerald-400",
    accentColor: "#10b981",
    Icon: Layers,
  },
  {
    title: "Decisions Executed",
    value: "8,942",
    sub: "+12.5% vs 1h ago",
    subColor: "text-violet-400",
    accentColor: "#8b5cf6",
    Icon: Zap,
  },
  {
    title: "Optimization Rate",
    value: "99.8%",
    sub: "↑ 0.4% efficiency",
    subColor: "text-sky-400",
    accentColor: "#0ea5e9",
    Icon: Activity,
  },
];

/* ---------------------------------------------------------------
   Terminal Log Component
   --------------------------------------------------------------- */
function TerminalLog() {
  const [logs, setLogs] = useState([
    { id: 1, text: "Initializing neural weights...", type: "info" },
    { id: 2, text: "Connected to data stream: port 8080", type: "success" },
    { id: 3, text: "Optimizing tensor graph...", type: "warning" },
  ]);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        { text: "Pattern detected: anomalous vector", type: "warning" },
        { text: "Re-calibrating confidence score", type: "info" },
        { text: "Decision node executed: routed to agent_04", type: "success" },
        { text: "Ingesting batch #4920...", type: "info" },
        { text: "Latency optimization: -12ms", type: "success" },
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLogs(prev => [...prev.slice(-4), { id: Date.now(), ...randomAction }]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-auto border-t border-white/5 pt-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-bold px-1">
        Live Logs
      </div>
      <div className="bg-black/40 rounded-lg border border-white/5 p-3 text-[10px] font-mono h-32 overflow-hidden flex flex-col justify-end">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mb-1 last:mb-0"
            >
              <span className={
                log.type === "success" ? "text-emerald-400" :
                log.type === "warning" ? "text-yellow-400" : "text-zinc-400"
              }>
                {">"} {log.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}



/* ---------------------------------------------------------------
   Dashboard
   --------------------------------------------------------------- */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeWindow, setActiveWindow] = useState("Ingestion");
  const [timeRange, setTimeRange] = useState("7D");
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({
      x: ((y - centerY) / centerY) * -1.5,
      y: ((x - centerX) / centerX) * 1.5,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setHoveredPoint(null);
  };

  return (
    <section className="py-32 bg-black relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-20 text-center relative">
          <div ref={(el) => {
            if (!el) return;
            gsap.fromTo(el, 
              { scale: 0.8, opacity: 0.2, y: 50 },
              { 
                scale: 1, opacity: 1, y: 0,
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  end: "bottom 50%",
                  scrub: 1,
                }
              }
            );
          }}>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Precision Control
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
              Real-time visibility into your tensor operations.
            </p>
          </div>
        </div>

        <Reveal delay={200} yOffset={40}>
          {/* Mobile: Container is scaled down to fit */}
          <div className="relative w-full overflow-hidden h-[300px] md:h-auto flex justify-center md:block">
            <div
              className="w-[1000px] md:w-full origin-top transform scale-[0.38] md:scale-100 md:transform-none"
              style={{ perspective: "2000px" }}
            >
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="rounded-xl overflow-hidden transition-transform duration-100 ease-out"
                style={{
                  transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* ========== Mac Window Chrome ========== */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-t-xl backdrop-blur-sm">
                  <div className="flex items-center gap-4 px-5 py-3">
                    {/* Traffic lights */}
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] shadow-[0_0_6px_#ff5f5780]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_#ffbd2e80]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-[#28c840] shadow-[0_0_6px_#28c84080]" />
                    </div>

                   
                  </div>
                </div>

                {/* ========== Dashboard Content ========== */}
                <div className="border border-t-0 border-white/10 bg-[#050505] rounded-b-xl shadow-2xl overflow-hidden flex flex-row h-[800px]">
                  {/* ---- Sidebar ---- */}
                  <div className="w-64 border-r border-white/5 bg-zinc-900/20 p-6 flex flex-col shrink-0">
                    <div className="flex items-center gap-2 mb-10 text-white font-bold tracking-tight">
                      <div className="w-4 h-4 bg-white rounded-full" />
                      Xai Workspace
                    </div>

                    <div className="space-y-1">
                      {SIDEBAR_ITEMS.map(({ label, icon: ItemIcon }) => (
                        <motion.button
                          key={label}
                          onClick={() => setActiveTab(label)}
                          className={`relative w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 cursor-pointer transition-colors duration-200 ${
                            activeTab === label
                              ? "text-white"
                              : "text-zinc-400 hover:text-white"
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          {activeTab === label && (
                            <motion.span
                              className="absolute inset-0 bg-white/10 rounded-md shadow-sm"
                              layoutId="sidebarHighlight"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-3">
                            <ItemIcon size={16} />
                            {label}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <TerminalLog />
                  </div>

                  {/* ---- Main Content ---- */}
                  <div className="flex-1 bg-black p-8 flex flex-col relative overflow-hidden">
                    {/* Grid bg */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    {/* Top bar */}
                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <input
                          type="text"
                          placeholder="Search deployments..."
                          className="bg-zinc-900/50 border border-white/10 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-white/20 w-64 transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <motion.button
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <Bell size={18} />
                        </motion.button>
                        <motion.div
                          className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs cursor-pointer"
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          style={{ boxShadow: "0 0 15px rgba(255,255,255,0.3)" }}
                        >
                          R
                        </motion.div>
                      </div>
                    </div>

                    {/* Stats — now with color accents */}
                    <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
                      {STATS.map((stat, i) => (
                        <motion.div
                          key={i}
                          className="relative bg-zinc-900/30 border border-white/10 rounded-xl p-6 group overflow-hidden cursor-default"
                          style={{ borderColor: `${stat.accentColor}20` }}
                          whileHover={{
                            y: -3,
                            boxShadow: `0 12px 30px -10px ${stat.accentColor}20`,
                            borderColor: `${stat.accentColor}30`,
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          {/* Subtle colored glow at top */}
                          <motion.div
                            className="absolute top-0 left-0 right-0 h-[1px]"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${stat.accentColor}, transparent)`,
                            }}
                            initial={{ opacity: 0.4 }}
                            whileHover={{ opacity: 1 }}
                          />
                          {/* Background radial glow */}
                          <div
                            className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500"
                            style={{ backgroundColor: stat.accentColor }}
                          />

                          <div className="flex justify-between items-start mb-4 relative">
                            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                              {stat.title}
                            </span>
                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <stat.Icon
                                size={14}
                                style={{ color: stat.accentColor }}
                              />
                            </motion.div>
                          </div>
                          <div className="flex items-baseline gap-1 relative">
                            <span className="text-4xl font-light text-white">
                              {stat.value}
                            </span>
                            {stat.unit && (
                              <span className="text-sm text-zinc-400">
                                {stat.unit}
                              </span>
                            )}
                          </div>
                          {stat.sub && (
                            <div className={`text-xs mt-2 ${stat.subColor} font-medium`}>
                              {stat.sub}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-6 relative z-10 flex flex-col shadow-inner">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            Automation Performance
                          </h3>
                          <p className="text-xs text-zinc-500 mt-1">
                            Comparing workflows vs executions
                          </p>
                        </div>
                        <div className="flex bg-zinc-900 border border-white/10 rounded-lg p-1 shadow-inner">
                          {["1D", "7D", "30D"].map((t) => (
                            <button
                              key={t}
                              onClick={() => setTimeRange(t)}
                              className={`relative px-3 py-1 text-xs rounded-md font-medium cursor-pointer transition-colors duration-200 ${
                                timeRange === t
                                  ? "text-black"
                                  : "text-zinc-400 hover:text-white"
                              }`}
                            >
                              {timeRange === t && (
                                <motion.span
                                  className="absolute inset-0 bg-white rounded-md shadow-md"
                                  layoutId="timeRangeIndicator"
                                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                              )}
                              <span className="relative z-10">{t}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chart body */}
                      <div className="flex-1 w-full relative">
                        {/* Y-Axis */}
                        <div className="absolute inset-0 right-10 top-4 bottom-8 pointer-events-none">
                          {[
                            { val: 150, top: "0%" },
                            { val: 130, top: "28.57%" },
                            { val: 110, top: "57.14%" },
                            { val: 90, top: "85.71%" },
                            { val: 80, top: "100%" },
                          ].map((tick, i) => (
                            <div
                              key={i}
                              className="absolute w-full border-t border-dashed border-white/10 flex items-center"
                              style={{ top: tick.top }}
                            >
                              <span className="absolute left-full ml-4 text-[10px] text-zinc-600 font-mono -translate-y-1/2">
                                {tick.val}
                              </span>
                            </div>
                          ))}
                        </div>

                      {/* SVG Area */}
                      <div className="absolute inset-0 right-12 top-4 bottom-8">
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 700 200"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <LiveAreaChart 
                            initialData={initialPurple} 
                            color="#a855f7" 
                            id="purple" 
                          />
                          <LiveAreaChart 
                            initialData={initialBlue} 
                            color="#3b82f6" 
                            id="blue" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

