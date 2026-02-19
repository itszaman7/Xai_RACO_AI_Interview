"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ---------------------------------------------------------------
   Constants
   --------------------------------------------------------------- */
const GLOBE_RADIUS = 15;
const NEON_COLORS = [0x00ff99, 0xff00ff, 0x00ffff, 0xffff00, 0xff3366];
const CITY_COUNT = 14;
const ROWS = 120;
const COLS = 240;
const MAX_ACTIVE_FLOWS = 15; // hard cap

/* ---------------------------------------------------------------
   Helper — Parse earth texture and return land-pixel positions
   --------------------------------------------------------------- */
function parseLandPoints(imageData, width, height) {
  const data = imageData.data;
  const points = [];

  for (let lat = 0; lat < ROWS; lat++) {
    for (let lon = 0; lon < COLS; lon++) {
      const phi = (Math.PI * lat) / ROWS;
      const theta = (2 * Math.PI * lon) / COLS;

      const u = Math.floor((lon / COLS) * width);
      const v = Math.floor((lat / ROWS) * height);
      const index = (v * width + u) * 4;
      const red = data[index];

      if (red < 50 && phi > 0.2 && phi < Math.PI - 0.2) {
        const r = GLOBE_RADIUS;
        points.push({
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.cos(phi),
          z: r * Math.sin(phi) * Math.sin(theta),
          lat: phi,
          lon: theta,
        });
      }
    }
  }
  return points;
}

/* ---------------------------------------------------------------
   Sub-component — Instanced land blocks
   --------------------------------------------------------------- */
function LandBlocks({ points }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const chaosRef = useRef(1.0); // Starts at 1.0 (fully chaotic)
  const randomOffsets = useMemo(() => {
    return points.map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [points]);

  const boxGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.18, 0.18, 0.5);
    geo.translate(0, 0, 0.25);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || points.length === 0) return;

    // Smoothly reduce chaos to 0 over ~3 seconds
    chaosRef.current = THREE.MathUtils.lerp(chaosRef.current, 0, 0.02);
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const off = randomOffsets[i];
      
      // Calculate position: [structured pos] + [chaotic offset * chaos factor]
      // Add subtle "vibration" noise to represent active data
      const vibration = Math.sin(time * 2 + off.phase) * 0.02 * chaosRef.current;
      
      dummy.position.set(
        p.x + off.x * chaosRef.current + vibration,
        p.y + off.y * chaosRef.current + vibration,
        p.z + off.z * chaosRef.current + vibration
      );

      dummy.lookAt(0, 0, 0);
      
      // Scale up as they become structured
      const s = 1.0 - chaosRef.current * 0.5;
      dummy.scale.set(s, s, s);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (points.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[boxGeo, undefined, points.length]}>
      <meshBasicMaterial color={0xffffff} transparent opacity={0.8} />
    </instancedMesh>
  );
}

/* ---------------------------------------------------------------
   Sub-component — City dots with glow (shared positions)
   --------------------------------------------------------------- */
function CityDots({ cityPositions }) {
  return (
    <>
      {cityPositions.map((pos, i) => (
        <group key={i} position={[pos.x, pos.y, pos.z]}>
          <mesh>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshBasicMaterial color={0xffffff} transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------
   Sub-component — Data-flow arcs (properly managed)
   --------------------------------------------------------------- */
function DataFlows({ cityPositions }) {
  const groupRef = useRef();
  const flowsRef = useRef([]);
  const clockRef = useRef(0);

  const cityVectors = useMemo(() => {
    return cityPositions.map(
      (c) => new THREE.Vector3(c.x, c.y, c.z)
    );
  }, [cityPositions]);

  useFrame((_, delta) => {
    if (!groupRef.current || cityVectors.length < 2) return;

    clockRef.current += delta;

    // Spawn new arc every ~0.6 seconds, capped at MAX_ACTIVE_FLOWS
    if (clockRef.current > 0.6 && flowsRef.current.length < MAX_ACTIVE_FLOWS) {
      clockRef.current = 0;

      const idx1 = Math.floor(Math.random() * cityVectors.length);
      let idx2 = Math.floor(Math.random() * cityVectors.length);
      while (idx1 === idx2)
        idx2 = Math.floor(Math.random() * cityVectors.length);

      const v1 = cityVectors[idx1];
      const v2 = cityVectors[idx2];
      const dist = v1.distanceTo(v2);

      const mid = v1
        .clone()
        .add(v2)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(GLOBE_RADIUS + dist * 0.4);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const color =
        NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];

      // Line
      const linePoints = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      groupRef.current.add(line);

      // Packet
      const packetGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      groupRef.current.add(packet);

      flowsRef.current.push({
        line,
        packet,
        curve,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012, // much faster ≈ 1-3 seconds to traverse
        alive: true,
        packetRemoved: false,
        lineRemoved: false,
        completedAt: null,
      });
    }

    // Update existing flows
    for (let i = flowsRef.current.length - 1; i >= 0; i--) {
      const f = flowsRef.current[i];

      // Move packet along curve
      if (!f.packetRemoved) {
        f.progress += f.speed;
        if (f.progress >= 1) {
          // Packet reached destination — remove it
          groupRef.current.remove(f.packet);
          f.packet.geometry.dispose();
          f.packet.material.dispose();
          f.packetRemoved = true;
          f.completedAt = performance.now();
        } else {
          const pos = f.curve.getPoint(f.progress);
          f.packet.position.copy(pos);
        }
      }

      // Remove line 1.5s after packet finishes
      if (f.packetRemoved && !f.lineRemoved) {
        if (performance.now() - f.completedAt > 1500) {
          groupRef.current.remove(f.line);
          f.line.geometry.dispose();
          f.line.material.dispose();
          f.lineRemoved = true;
        }
      }

      // Splice from array once everything is cleaned up
      if (f.packetRemoved && f.lineRemoved) {
        flowsRef.current.splice(i, 1);
      }
    }
  });

  return <group ref={groupRef} />;
}

/* ---------------------------------------------------------------
   Sub-component – Scene (inside Canvas)
   --------------------------------------------------------------- */
function GlobeScene() {
  const [points, setPoints] = useState([]);
  const groupRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Shared city positions derived once from land points
  const cityPositions = useMemo(() => {
    if (points.length === 0) return [];
    const result = [];
    for (let i = 0; i < CITY_COUNT; i++) {
      const rp = points[Math.floor(Math.random() * points.length)];
      if (!rp) continue;
      const r = GLOBE_RADIUS + 0.6;
      result.push({
        x: r * Math.sin(rp.lat) * Math.cos(rp.lon),
        y: r * Math.cos(rp.lat),
        z: r * Math.sin(rp.lat) * Math.sin(rp.lon),
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src =
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setPoints(parseLandPoints(imageData, canvas.width, canvas.height));
    };
  }, []);

  // Motion response to cursor
  useFrame((state) => {
    if (!groupRef.current) return;

    // Map mouse position (-1 to 1) to subtle rotation angles
    // Reduced sensitivity from 0.4/0.3 to 0.15/0.1 for a calmer feel
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    // Smoothly interpolate towards mouse target
    targetRotation.current.y = THREE.MathUtils.lerp(
      targetRotation.current.y,
      mouseX * 0.15,
      0.03 // Slower lerp for more weight
    );
    targetRotation.current.x = THREE.MathUtils.lerp(
      targetRotation.current.x,
      -mouseY * 0.1,
      0.03
    );

    // Apply smooth mouse rotation + constant very slow spin
    groupRef.current.rotation.y += 0.0012; // Slowed down from 0.002
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.03} // Even smoother damping
        rotateSpeed={0.3}     // Less aggressive user rotation
        // Removed autoRotate because we're handling specialized cursor-aware motion manually
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />

      <fogExp2 attach="fog" args={[0x000000, 0.02]} />

      <group ref={groupRef}>
        {/* Base sphere (dark water) */}
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS - 0.2, 64, 64]} />
          <meshBasicMaterial color={0x050505} />
        </mesh>

        {/* Land blocks */}
        <LandBlocks points={points} />

        {/* City dots — shared positions with DataFlows */}
        <CityDots cityPositions={cityPositions} />

        {/* Animated data flows — uses same city positions */}
        <DataFlows cityPositions={cityPositions} />
      </group>
    </>
  );
}

/* ---------------------------------------------------------------
   Main Export — BlockGlobe
   --------------------------------------------------------------- */
export default function BlockGlobe() {
  return (
    <div className="absolute inset-0 z-0 top-[10vh]">
      <Canvas
        camera={{ position: [0, 20, 45], fov: 45, near: 0.1, far: 1000 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
        className="cursor-grab active:cursor-grabbing"
      >
        <GlobeScene />
      </Canvas>

      {/* Status badge */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 px-4 py-2 rounded-full flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400">
            Live Global Traffic
          </span>
        </div>
      </div>
    </div>
  );
}
