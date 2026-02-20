"use client";

import { useMemo, useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------
   Shaders
   --------------------------------------------------------------- */
const vertexShader = `
  uniform float uTime;
  uniform float uPhase; 
  
  uniform vec3 uColorBase; 
  uniform vec3 uColorA; 
  uniform vec3 uColorB; 
  uniform vec3 uColorC; 
  uniform vec3 uMouse; 
  uniform vec3 uClickPos; // Position of last click
  uniform float uClickTime; // Time of last click
  uniform float uInteraction; 
  
  attribute vec3 aChaosPos;
  attribute vec3 aStreamPos;
  attribute vec3 aGridPos;
  attribute vec3 aCorePos;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = aChaosPos;
    vec3 color = uColorBase;
    
    // --- DATA FLOW MOVEMENT (Hero Phase) ---
    // Horizontal (Left -> Right) flow with "lines" feel
    if (uPhase < 1.0) {
       float speed = 18.0 + fract(aSize * 99.0) * 10.0; // Slightly reduced speed
       float xOffset = uTime * speed;
       
       // Wrap X within -50 to 50
       vec3 chaosMoved = aChaosPos;
       chaosMoved.x = mod(aChaosPos.x + xOffset + 50.0, 100.0) - 50.0;
       
       // Apply
       float t = smoothstep(0.0, 1.0, uPhase);
       
       // --- Stream Animation ---
       vec3 streamMoved = aStreamPos;
       // Gentle spiral flow
       float streamT = uTime * 2.0;
       streamMoved.z += sin(streamT + aStreamPos.x * 0.5) * 1.0;
       streamMoved.y += cos(streamT + aStreamPos.x * 0.5) * 1.0;
       
       pos = mix(chaosMoved, streamMoved, t);
       color = mix(uColorBase, uColorA, t);
       
       // Blue Pulse (Synchronized Wave)
       float pulseWave = sin(uTime * 3.0 - pos.x * 0.08);
       float pulse = smoothstep(0.8, 1.0, pulseWave); 

       if (pulse > 0.0 && uInteraction > 0.5) {
           color = mix(color, vec3(0.0, 0.8, 1.0), pulse * 0.8);
       }
    } 
    // Phase 1 -> 2: Stream -> Grid
    else if (uPhase <= 2.0) {
      float t = smoothstep(1.0, 2.0, uPhase);
      
      // Moving Stream
      vec3 streamMoved = aStreamPos;
      float streamT = uTime * 2.0;
      streamMoved.z += sin(streamT + aStreamPos.x * 0.5) * 1.0;
      streamMoved.y += cos(streamT + aStreamPos.x * 0.5) * 1.0;
      
      // Moving Grid
      vec3 gridMoved = aGridPos;
      float gridT = uTime * 1.5;
      // Floating wave effect
      gridMoved.y += sin(gridT + gridMoved.x * 0.2 + gridMoved.z * 0.2) * 2.0;
      
      pos = mix(streamMoved, gridMoved, t);
      color = mix(uColorA, uColorB, t);
    }
    // Phase 2 -> 3: Grid -> Core
    else {
      float t = smoothstep(2.0, 3.0, uPhase);
      
      // Moving Grid
      vec3 gridMoved = aGridPos;
      float gridT = uTime * 1.5;
      gridMoved.y += sin(gridT + gridMoved.x * 0.2 + gridMoved.z * 0.2) * 2.0;
      
      // Pulsing Core
      vec3 coreMoved = aCorePos;
      float breath = 1.0 + sin(uTime * 2.0) * 0.05 + sin(uTime * 5.0) * 0.02; // Complex breath
      coreMoved *= breath;
      // Rotate core slowly
      float rot = uTime * 0.5;
      float c = cos(rot);
      float s = sin(rot);
      /* Simple Y rotation manually */
      float x = coreMoved.x * c - coreMoved.z * s;
      float z = coreMoved.x * s + coreMoved.z * c;
      coreMoved.x = x;
      coreMoved.z = z;

      pos = mix(gridMoved, coreMoved, t);
      color = mix(uColorB, uColorC, t);
    }

    // --- INTERACTION (Hero Phase Only) ---
    if (uPhase < 0.5) {
       // Mouse Repulsion & Flow Trail
       float dist = distance(pos, uMouse);
       float radius = 12.0; 
       if (dist < radius) {
         float force = (radius - dist) / radius;
         vec3 dir = normalize(pos - uMouse);
         pos += dir * force * 5.0 * uInteraction; 
       }

       // Click Ripple / Shockwave
       float timeSinceClick = uTime - uClickTime;
       if (timeSinceClick > 0.0 && timeSinceClick < 1.5) {
          float waveRadius = timeSinceClick * 40.0; // Expand quickly
          float distClick = distance(pos, uClickPos);
          float waveWidth = 5.0;
          
          if (abs(distClick - waveRadius) < waveWidth) {
             float waveForce = 1.0 - (abs(distClick - waveRadius) / waveWidth);
             // Push outwards from click
             vec3 clickDir = normalize(pos - uClickPos);
             pos += clickDir * waveForce * 4.0 * (1.0 - timeSinceClick/1.5); // Fade out
             
             // Flash color
             color = mix(color, vec3(1.0), waveForce * 0.5);
          }
       }
    }

    // --- NOISE / JITTER ---
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (70.0 / -mvPosition.z); // Slightly smaller
    gl_Position = projectionMatrix * mvPosition;
    
    // Distance fog
    float dist = length(mvPosition.xyz);
    vAlpha = smoothstep(60.0, 20.0, dist);
    vColor = color;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Hard square pixel (Data)
    gl_FragColor = vec4(vColor, vAlpha * 0.6); // Reduced opacity
  }
`;

/* ---------------------------------------------------------------
   Geometry Generation
   --------------------------------------------------------------- */
const COUNT = 16000; 

export default function UnifiedParticleSystem() {
  const meshRef = useRef();
  const groupRef = useRef();
  const { viewport } = useThree();

  // Generate geometries
  const { chaos, stream, grid, core, sizes } = useMemo(() => {
    const chaos = new Float32Array(COUNT * 3);
    const stream = new Float32Array(COUNT * 3);
    const grid = new Float32Array(COUNT * 3);
    const core = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // 1. Chaos (Hero): Horizontal Data Flow
      // Used for: Raw Data
      // Horizontal Rows (Quantized Y)
      const rows = 50; // Number of horizontal lines
      const yStep = 60 / rows; // Spread over height 60 (-30 to 30)
      
      const rowY = Math.floor(Math.random() * rows) * yStep - 30;
      const rowZ = (Math.random() - 0.5) * 20; // Some depth
      
      chaos[i3] = (Math.random() - 0.5) * 100; // X is full width (random start)
      chaos[i3 + 1] = rowY + (Math.random() - 0.5) * 0.2; // Quantized Y with tiny jitter
      chaos[i3 + 2] = rowZ;

      // 2. Stream (Ingest): Directed flow / Tube
      // Used for: Ingest Data
      const streamLen = 60;
      const streamRadius = 3;
      const t = (i / COUNT) * Math.PI * 4; // twist
      const x = (i / COUNT - 0.5) * streamLen; // spread along X
      // Spiral tube
      stream[i3] = x; 
      stream[i3 + 1] = Math.sin(t + x * 0.5) * streamRadius + (Math.random() - 0.5) * 2;
      stream[i3 + 2] = Math.cos(t + x * 0.5) * streamRadius + (Math.random() - 0.5) * 2;

      // 3. Grid (Analyze): Tiled planes / Neural Matrix
      // Used for: Analysis
      // Create a 3D grid of points
      const gridSize = 30;
      const pointsPerDim = Math.cbrt(COUNT);
      const idx = i;
      const gx = (idx % pointsPerDim) / pointsPerDim;
      const gy = (Math.floor(idx / pointsPerDim) % pointsPerDim) / pointsPerDim;
      const gz = (Math.floor(idx / (pointsPerDim * pointsPerDim))) / pointsPerDim;
      
      grid[i3] = (gx - 0.5) * gridSize;
      grid[i3 + 1] = (gy - 0.5) * gridSize;
      grid[i3 + 2] = (gz - 0.5) * gridSize;

      // 4. Core (Insight): Pulsing Neural Sphere
      // Used for: Insight
      const coreRadius = 6; // Slightly smaller
      // Fibonacci sphere for even distribution
      const cPhi = Math.acos(1 - 2 * (i + 0.5) / COUNT);
      const cTheta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      // Add "wrinkles" or brain-like waves
      const rMod = 1 + 0.2 * Math.sin(cPhi * 10) * Math.cos(cTheta * 10);
      
      core[i3] = coreRadius * rMod * Math.sin(cPhi) * Math.cos(cTheta);
      core[i3 + 1] = coreRadius * rMod * Math.sin(cPhi) * Math.sin(cTheta);
      core[i3 + 2] = coreRadius * rMod * Math.cos(cPhi);

      // Sizes - slightly smaller variation
      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    return { chaos, stream, grid, core, sizes };
  }, []);

  // Click Sync
  const clickTrigger = useRef(false);
  
  // Uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uColorBase: { value: new THREE.Color("#ffffff") }, // Pure White for data
      uColorA: { value: new THREE.Color("#fbbf24") }, // Amber
      uColorB: { value: new THREE.Color("#22d3ee") }, // Cyan
      uColorC: { value: new THREE.Color("#d946ef") }, // Fuchsia
      uMouse: { value: new THREE.Vector3(9999, 9999, 0) }, // Offscreen init
      uClickPos: { value: new THREE.Vector3(0, 0, 0) }, 
      uClickTime: { value: -1000 }, // Past time
      uInteraction: { value: 1.0 },
    }),
    []
  );

  // GSAP ScrollTrigger Integration
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    
    // Add a small delay to ensure DOM is ready (Canvas hydrates early)
    const timer = setTimeout(() => {
        const ctx = gsap.context(() => {
          
          ScrollTrigger.refresh(); // Force refresh to find new elements

          // 1. Position Transition: Center -> Right
          const heroSection = document.getElementById("hero-section");
          // 2. Morphing Phases
          // Target the track specifically for 1:1 sync
          const pipelineTrack = document.getElementById("pipeline-track");

          if (heroSection) {
            ScrollTrigger.create({
              trigger: heroSection,
              start: "bottom bottom", 
              end: "bottom top", 
              scrub: 1, 
              onUpdate: (self) => {
                 if (groupRef.current) {
                    groupRef.current.position.x = gsap.utils.interpolate(0, 14, self.progress);
                 }
              }
            });
          }

          if (pipelineTrack) {
             ScrollTrigger.create({
                trigger: pipelineTrack,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                  // Map pipeline scroll to phases 1, 2, 3
                  // Range: 0 -> 3
                  if (meshRef.current) {
                    const val = self.progress * 3.0; 
                    meshRef.current.material.uniforms.uPhase.value = val;
                  }
                }
             });
          }
        });
        return () => ctx.revert();
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Handle Click Sync
      if (clickTrigger.current) {
         meshRef.current.material.uniforms.uClickTime.value = state.clock.getElapsedTime();
         clickTrigger.current = false;
      }
      
      // Handle Mouse Integration
      const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
      vec.unproject(state.camera);
      const dir = vec.sub(state.camera.position).normalize();
      const distance = -state.camera.position.z / dir.z;
      const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
      
      // Lerp for smooth movement
      meshRef.current.material.uniforms.uMouse.value.lerp(pos, 0.1);
    }
  });

  // Add click listener
  useLayoutEffect(() => {
     const handleClick = (e) => {
        if (!meshRef.current) return;
        // Use current mouse position as click target
        const clickPos = meshRef.current.material.uniforms.uMouse.value.clone();
        meshRef.current.material.uniforms.uClickPos.value.copy(clickPos);
        
        // Trigger time sync in next frame
        clickTrigger.current = true; 
     };
     window.addEventListener("click", handleClick);
     return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <group ref={groupRef}>
      <points ref={meshRef}>
        <bufferGeometry>
          {/* ... attributes ... */}
          <bufferAttribute
            attach="attributes-position"
            count={COUNT}
            array={chaos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aChaosPos"
            count={COUNT}
            array={chaos}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aStreamPos"
            count={COUNT}
            array={stream}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aGridPos"
            count={COUNT}
            array={grid}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aCorePos"
            count={COUNT}
            array={core}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={COUNT}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
