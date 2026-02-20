import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";

import Pipeline from "@/components/sections/Pipeline";
import Dashboard from "@/components/sections/Dashboard";
import Footer from "@/components/layout/Footer";
import UnifiedCanvas from "@/components/canvas/UnifiedCanvas";
import InsightMatrix from "@/components/sections/InsightMatrix";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-700 selection:text-white">
      {/* Unified Background Canvas replaced by InsightMatrix */}
      <InsightMatrix />
      
      <Navbar />
      
      {/* 01. Vision & Global Presence */}
      <Hero />
 

      {/* 02. Processing & Architecture */}
      <Pipeline />


      {/* 03. Control & Analytics */}
      <Dashboard />
 
      
      <Footer />
    </div>
  );
}
