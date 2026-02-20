"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";

const UnifiedParticleSystem = dynamic(() => import("@/components/canvas/UnifiedParticleSystem"), {
  ssr: false,
});

export default function UnifiedCanvas() {
  const [domReady, setDomReady] = useState(false);
  
  useEffect(() => {
    setDomReady(true);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        eventSource={domReady ? document.body : undefined}
        eventPrefix="client"
        camera={{ position: [0, 0, 40], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <UnifiedParticleSystem />
      </Canvas>
    </div>
  );
}
