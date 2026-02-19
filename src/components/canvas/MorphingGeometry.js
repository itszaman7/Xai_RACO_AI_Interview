"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------
   Shaders
   --------------------------------------------------------------- */
const vertexShader = `
  uniform float uTime;
  uniform float uPhase; // 0 = chaos, 1 = grid, 2 = sphere
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  
  attribute vec3 aChaosPos;
  attribute vec3 aGridPos;
  attribute vec3 aSpherePos;
  attribute float aSize;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float tPhase = 0.0;
    vec3 color = uColorA;
    
    vec3 pos = aChaosPos;
    float currentSize = aSize;
    
    // Phase 0 -> 1 (Chaos -> Grid) (Yellow -> Cyan)
    if (uPhase <= 1.0) {
      float t = smoothstep(0.0, 1.0, uPhase);
      pos = mix(aChaosPos, aGridPos, t);
      color = mix(uColorA, uColorB, t);
    } 
    // Phase 1 -> 2 (Grid -> Sphere/Crystal) (Cyan -> Purple)
    else {
      float t = smoothstep(1.0, 2.0, uPhase);
      pos = mix(aGridPos, aSpherePos, t);
      color = mix(uColorB, uColorC, t);
    }
    
    vColor = color;

    // Add some noise movement
    pos.x += sin(uTime * 0.5 + pos.y) * 0.05;
    pos.y += cos(uTime * 0.3 + pos.x) * 0.05;
    pos.z += sin(uTime * 0.4 + pos.z) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size attenuation
    // Drastically reduced size factor for fine, sharp points
    gl_PointSize = currentSize * (200.0 / -mvPosition.z) * 0.4; 
    gl_Position = projectionMatrix * mvPosition;
    
    // Distance fog (More aggressive cut off to remove far away noise)
    float dist = length(mvPosition.xyz);
    vAlpha = smoothstep(50.0, 10.0, dist); 
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Square particle for sharper look (or very hard circle)
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Hard edge circle (no glow)
    float alpha = 1.0;
    if (dist > 0.4) alpha = 1.0 - smoothstep(0.4, 0.5, dist);

    gl_FragColor = vec4(vColor, vAlpha * alpha * 0.9);
  }
`;

/* ---------------------------------------------------------------
   Geometry Generation
   --------------------------------------------------------------- */
const COUNT = 12000; // Increased significantly for density
const RADIUS = 15;

export default function MorphingGeometry({ scrollProgress }) {
  const meshRef = useRef();

  const { positions, chaos, grid, sphere, sizes } = useMemo(() => {
    const chaos = new Float32Array(COUNT * 3);
    const grid = new Float32Array(COUNT * 3);
    const sphere = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    // Removed colors array

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // 1. Phase 0: DNA Helix (Ingest - Raw Data Stream)
      // Two intertwining strands
      const strand = i % 2 === 0 ? 1 : -1;
      const t = (i / COUNT) * Math.PI * 10; // 5 full turns
      const helixRadius = 10;
      const helixHeight = 40;
      
      // x, z are circle, y is height
      chaos[i3] = Math.cos(t) * helixRadius * strand + (Math.random() - 0.5) * 2;
      chaos[i3 + 1] = (i / COUNT - 0.5) * helixHeight; // Spread along Y
      chaos[i3 + 2] = Math.sin(t) * helixRadius * strand + (Math.random() - 0.5) * 2;

      // 2. Phase 1: Torus / Donut (Analyze - Neural Loop)
      const torusRadius = 12;
      const tubeRadius = 4;
      const u = (i / COUNT) * Math.PI * 2 * 20; // Dense wrapping
      const v = (i / COUNT) * Math.PI * 2; 

      // Random scattering on surface
      const p = (Math.random() * Math.PI * 2);
      const q = (Math.random() * Math.PI * 2);
      
      // Torus parametric equation
      // x = (R + r cos v) cos u
      // y = (R + r cos v) sin u
      // z = r sin v
      // But let's map particles randomly to volume or surface
      
      const angleTube = Math.random() * Math.PI * 2;
      const angleRing = Math.random() * Math.PI * 2;
      
      grid[i3] = (torusRadius + tubeRadius * Math.cos(angleTube)) * Math.cos(angleRing);
      grid[i3 + 1] = (torusRadius + tubeRadius * Math.cos(angleTube)) * Math.sin(angleRing);
      grid[i3 + 2] = tubeRadius * Math.sin(angleTube);

      // 3. Sphere: Perfect crystal ball (Insight)
      const phi = Math.acos(-1 + (2 * i) / COUNT);
      const theta = Math.sqrt(COUNT * Math.PI) * phi;
      
      sphere[i3] = RADIUS * Math.cos(theta) * Math.sin(phi);
      sphere[i3 + 1] = RADIUS * Math.sin(theta) * Math.sin(phi);
      sphere[i3 + 2] = RADIUS * Math.cos(phi);

      // Sizes
      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    return { chaos, grid, sphere, sizes };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uColorA: { value: new THREE.Color("#fbbf24") }, // Amber
      uColorB: { value: new THREE.Color("#22d3ee") }, // Cyan
      uColorC: { value: new THREE.Color("#d946ef") }, // Fuchsia
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Calculate target phase based on scroll progress (0 -> 1)
      // We want:
      // 0.0 - 0.2: Phase 0 (Chaos)
      // 0.2 - 0.5: Morph to Phase 1 (Grid)
      // 0.5 - 0.8: Morph to Phase 2 (Sphere)
      // 0.8 - 1.0: Phase 2 (Sphere)
      
      let targetPhase = 0;
      const progress = scrollProgress?.current || 0;

      if (progress < 0.5) {
        // First half: 0 -> 1
        targetPhase = progress * 2.0; // scale 0-0.5 to 0-1
      } else {
        // Second half: 1 -> 2
        targetPhase = 1.0 + (progress - 0.5) * 2.0; // scale 0.5-1.0 to 0-1, add 1
      }
      
      // Smooth lerp for phase to avoid jumps
      meshRef.current.material.uniforms.uPhase.value = THREE.MathUtils.lerp(
        meshRef.current.material.uniforms.uPhase.value,
        targetPhase,
        0.1 // Faster response
      );
      
      // Slight rotation
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" // Required for threejs, even if unused in shader
          count={COUNT}
          array={chaos} // Initialize with chaos
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aChaosPos"
          count={COUNT}
          array={chaos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aGridPos"
          count={COUNT}
          array={grid}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSpherePos"
          count={COUNT}
          array={sphere}
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
        blending={THREE.NormalBlending} // Changed from Additive to Normal for cleaner look
      />
    </points>
  );
}
