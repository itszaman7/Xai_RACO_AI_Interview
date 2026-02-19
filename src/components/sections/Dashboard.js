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

/* ---------------------------------------------------------------
   Chart data points
   --------------------------------------------------------------- */
const purplePoints = [
  { x: 0, y: 85, val: "91 Actions" },
  { x: 16.66, y: 78, val: "95 Actions" },
  { x: 33.33, y: 75, val: "98 Actions" },
  { x: 50, y: 45, val: "119 Actions" },
  { x: 66.66, y: 38, val: "123 Actions" },
  { x: 83.33, y: 20, val: "136 Actions" },
  { x: 100, y: 12, val: "142 Actions" },
];

const bluePoints = [
  { x: 0, y: 90, val: "87 Flows" },
  { x: 16.66, y: 85, val: "91 Flows" },
  { x: 33.33, y: 80, val: "94 Flows" },
  { x: 50, y: 55, val: "112 Flows" },
  { x: 66.66, y: 50, val: "115 Flows" },
  { x: 83.33, y: 30, val: "129 Flows" },
  { x: 100, y: 18, val: "137 Flows" },
];

const SIDEBAR_ITEMS = [
  { label: "Overview", icon: Layers },
  { label: "AI Analysis", icon: Cpu },
  { label: "History", icon: Activity },
  { label: "Settings", icon: Zap },
];

const STATS = [
  {
    title: "Active Automations",
    value: "18",
    sub: "+2 from yesterday",
    subColor: "text-emerald-400",
    accentColor: "#10b981",
    Icon: Layers,
  },
  {
    title: "Agent Actions",
    value: "125",
    sub: "+12.5%",
    subColor: "text-violet-400",
    accentColor: "#8b5cf6",
    Icon: Zap,
  },
  {
    title: "Time Saved",
    value: "350",
    unit: "min",
    sub: "↑ 24% this week",
    subColor: "text-sky-400",
    accentColor: "#0ea5e9",
    Icon: Activity,
  },
];



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
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
              Precision Control
            </h2>
            <p className="text-zinc-400 text-sm">
              Real-time visibility into your tensor operations.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200} yOffset={40}>
          <div className="w-full" style={{ perspective: "2000px" }}>
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
              <div className="border border-t-0 border-white/10 bg-[#050505] rounded-b-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[800px]">
                {/* ---- Sidebar ---- */}
                <div className="w-64 border-r border-white/5 bg-zinc-900/20 p-6 flex-col hidden md:flex">
                  <div className="flex items-center gap-2 mb-10 text-white font-bold tracking-tight">
                    <div className="w-4 h-4 bg-white rounded-full" />
                    XaiAnalytics
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

                  <div className="mt-auto">
                    <div className="px-3 py-3 bg-black/40 rounded-lg border border-white/5">
                      <div className="text-[10px] text-zinc-400 mb-1">
                        System Status
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                        Operational
                      </div>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
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
                          <defs>
                            <linearGradient
                              id="purple-grad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#a855f7"
                                stopOpacity="0.35"
                              />
                              <stop
                                offset="100%"
                                stopColor="#a855f7"
                                stopOpacity="0"
                              />
                            </linearGradient>
                            <linearGradient
                              id="blue-grad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3b82f6"
                                stopOpacity="0.35"
                              />
                              <stop
                                offset="100%"
                                stopColor="#3b82f6"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          {/* Area fills */}
                          <path
                            d="M0,170 C58,170 58,156 117,156 C175,156 175,150 233,150 C292,150 292,90 350,90 C408,90 408,76 467,76 C525,76 525,40 583,40 C642,40 642,24 700,24 L700,200 L0,200 Z"
                            fill="url(#purple-grad)"
                          />
                          <path
                            d="M0,180 C58,180 58,170 117,170 C175,170 175,160 233,160 C292,160 292,110 350,110 C408,110 408,100 467,100 C525,100 525,60 583,60 C642,60 642,36 700,36 L700,200 L0,200 Z"
                            fill="url(#blue-grad)"
                          />

                          {/* Lines */}
                          <path
                            d="M0,170 C58,170 58,156 117,156 C175,156 175,150 233,150 C292,150 292,90 350,90 C408,90 408,76 467,76 C525,76 525,40 583,40 C642,40 642,24 700,24"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 6px #a855f780)" }}
                          />
                          <path
                            d="M0,180 C58,180 58,170 117,170 C175,170 175,160 233,160 C292,160 292,110 350,110 C408,110 408,100 467,100 C525,100 525,60 583,60 C642,60 642,36 700,36"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 6px #3b82f680)" }}
                          />

                          {/* Data points — purple line */}
                          {[
                            { cx: 0, cy: 170 },
                            { cx: 117, cy: 156 },
                            { cx: 233, cy: 150 },
                            { cx: 350, cy: 90 },
                            { cx: 467, cy: 76 },
                            { cx: 583, cy: 40 },
                            { cx: 700, cy: 24 },
                          ].map((pt, i) => (
                            <g key={`p-${i}`}>
                              <circle
                                cx={pt.cx}
                                cy={pt.cy}
                                r="5"
                                fill="#050505"
                                stroke="#fff"
                                strokeWidth="2.5"
                                className="cursor-pointer"
                                style={{
                                  filter:
                                    "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
                                }}
                                onMouseEnter={() =>
                                  setHoveredPoint(purplePoints[i])
                                }
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                              {hoveredPoint === purplePoints[i] && (
                                <foreignObject
                                  x={pt.cx - 50}
                                  y={pt.cy - 40}
                                  width="100"
                                  height="30"
                                  className="overflow-visible pointer-events-none"
                                >
                                  <div className="flex justify-center">
                                    <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                                      {purplePoints[i].val}
                                    </span>
                                  </div>
                                </foreignObject>
                              )}
                            </g>
                          ))}

                          {/* Data points — blue line */}
                          {[
                            { cx: 0, cy: 180 },
                            { cx: 117, cy: 170 },
                            { cx: 233, cy: 160 },
                            { cx: 350, cy: 110 },
                            { cx: 467, cy: 100 },
                            { cx: 583, cy: 60 },
                            { cx: 700, cy: 36 },
                          ].map((pt, i) => (
                            <g key={`b-${i}`}>
                              <circle
                                cx={pt.cx}
                                cy={pt.cy}
                                r="5"
                                fill="#050505"
                                stroke="#fff"
                                strokeWidth="2.5"
                                className="cursor-pointer"
                                style={{
                                  filter:
                                    "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
                                }}
                                onMouseEnter={() =>
                                  setHoveredPoint(bluePoints[i])
                                }
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                              {hoveredPoint === bluePoints[i] && (
                                <foreignObject
                                  x={pt.cx - 50}
                                  y={pt.cy - 40}
                                  width="100"
                                  height="30"
                                  className="overflow-visible pointer-events-none"
                                >
                                  <div className="flex justify-center">
                                    <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap">
                                      {bluePoints[i].val}
                                    </span>
                                  </div>
                                </foreignObject>
                              )}
                            </g>
                          ))}
                        </svg>
                      </div>

                      {/* X-Axis labels */}
                      <div className="absolute bottom-0 left-0 right-12 flex justify-between text-[10px] text-zinc-600 font-mono uppercase font-semibold">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
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
