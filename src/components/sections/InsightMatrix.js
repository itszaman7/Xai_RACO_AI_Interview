"use client";

import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- Main Component ---
const InsightMatrix = () => {
    const mountRef = useRef(null);
    const scrollProgress = useRef(0);

    useLayoutEffect(() => {
        if (!mountRef.current) return;
        
        let animationFrameId;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.025);

        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        camera.position.set(20, 15, 30);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Lighting - Made brighter
        const ambient = new THREE.AmbientLight(0xffffff, 1.5); // was 0.4
        scene.add(ambient);
        const dirLight = new THREE.DirectionalLight(0xffffff, 3); // was 2
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        // Matrix Configuration
        const gridSize = 16; // 16x16x16 = 4096 nodes
        const particleCount = gridSize ** 3;
        const spacing = 1.2;
        const offset = (gridSize * spacing) / 2 - (spacing / 2);
        
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        // Premium sleek material
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.8
        });

        const mesh = new THREE.InstancedMesh(geometry, material, particleCount);
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(mesh);

        const dummy = new THREE.Object3D();
        const colorObj = new THREE.Color();
        
        // Colors for each phase based on Contextual Meanings
        const colors = {
            base: new THREE.Color(0xa1a1aa), // zinc-400 (Brighter Tensor core base)
            active: new THREE.Color(0x3b82f6), // blue-500 (Tensor core active)
            core: new THREE.Color(0xffffff), // white (Tensor core nearest)
            phase1: new THREE.Color(0xfbbf24), // Amber (Ingest Data - Cloud/Explosion)
            phase2: new THREE.Color(0x22d3ee), // Cyan (Analyze AI - DNA)
            phase3: new THREE.Color(0xd946ef)  // Fuchsia (Generate Insight - Sphere)
        };

        // --- Calculate Geometries ---
        const positions = {
            tensor: new Float32Array(particleCount * 3),
            cloud: new Float32Array(particleCount * 3), // Replaced vortex with a diffuse cloud
            dna:   new Float32Array(particleCount * 3),
            sphere: new Float32Array(particleCount * 3)
        };

        let idx = 0;
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    const i3 = idx * 3;
                    
                    // 0. Tensor Core (Hero - 3D Grid)
                    positions.tensor[i3] = x * spacing - offset;
                    positions.tensor[i3 + 1] = y * spacing - offset;
                    positions.tensor[i3 + 2] = z * spacing - offset;
                    
                    // 1. Data Cloud / Nebula (Ingest Data: Unstructured raw data floating in)
                    // Creates a chaotic, diffuse, pillowy shape
                    const u = Math.random();
                    const v = Math.random();
                    const thetaCloud = u * 2.0 * Math.PI;
                    const phiCloud = Math.acos(2.0 * v - 1.0);
                    // Use a Gaussian-like distribution to make it dense in the middle and fuzzy outside
                    const rCloud = 25 * Math.pow(Math.random(), 0.5); 
                    
                    positions.cloud[i3] = rCloud * Math.sin(phiCloud) * Math.cos(thetaCloud);
                    positions.cloud[i3 + 1] = rCloud * Math.sin(phiCloud) * Math.sin(thetaCloud);
                    positions.cloud[i3 + 2] = rCloud * Math.cos(phiCloud) * 0.5; // flatten it a bit on Z 

                    // 2. DNA Helix (Analyze AI: Structural Processing)
                    // Keep this structured and tight
                    const strand = idx % 2 === 0 ? 1 : -1;
                    const tDNA = (idx / particleCount) * Math.PI * 10; 
                    const helixRadius = 10;
                    const helixHeight = 40;
                    positions.dna[i3] = Math.cos(tDNA) * helixRadius * strand + (Math.random() - 0.5) * 2;
                    positions.dna[i3 + 1] = (idx / particleCount - 0.5) * helixHeight;
                    positions.dna[i3 + 2] = Math.sin(tDNA) * helixRadius * strand + (Math.random() - 0.5) * 2;

                    // 3. Sphere (Generate Insight: Solid, glowing globe of intelligence)
                    const RADIUS = 15;
                    const phi = Math.acos(-1 + (2 * idx) / particleCount);
                    const theta = Math.sqrt(particleCount * Math.PI) * phi;
                    positions.sphere[i3] = RADIUS * Math.cos(theta) * Math.sin(phi);
                    positions.sphere[i3 + 1] = RADIUS * Math.sin(theta) * Math.sin(phi);
                    positions.sphere[i3 + 2] = RADIUS * Math.cos(phi);
                    
                    idx++;
                }
            }
        }

        // The "Probe" (Mouse visualizer)
        const probeGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const probeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const probe = new THREE.Mesh(probeGeo, probeMat);
        
        const probeGlowGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const probeGlowMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false });
        const probeGlow = new THREE.Mesh(probeGlowGeo, probeGlowMat);
        probe.add(probeGlow);
        scene.add(probe);

        // Invisible bounding box for raycasting (Big enough to catch mouse events for the whole screen essentially)
        const hitBoxGeo = new THREE.BoxGeometry(100, 100, 10);
        const hitBox = new THREE.Mesh(hitBoxGeo, new THREE.MeshBasicMaterial({visible: false}));
        scene.add(hitBox);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-100, -100);
        const targetProbePos = new THREE.Vector3(0, 0, 0);

        let isMouseActive = false;

        const onMouseMove = (e) => {
            isMouseActive = true;
            
            // If the mouse hits the very edge of the browser window (e.g. over a scrollbar), hide the orb.
            // This prevents the ghost core from sticking when moving off-screen to the right.
            if (e.clientX <= 5 || e.clientY <= 5 || e.clientX >= window.innerWidth - 5 || e.clientY >= window.innerHeight - 5) {
                isMouseActive = false;
                targetProbePos.set(0,0,0);
            }
            
            // We'll calculate mouse relative to window since canvas covers window
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            // Always raycast so mouse interaction feels natural everywhere
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(hitBox);
            if (intersects.length > 0 && isMouseActive) {
                targetProbePos.copy(intersects[0].point);
            } else if (isMouseActive) {
                targetProbePos.set(0,0,0);
            }
        };

        const onMouseLeave = (e) => {
            // e.relatedTarget is null when leaving the document window entirely
            if (!e.relatedTarget) {
                isMouseActive = false;
                mouse.set(-100, -100);
                targetProbePos.set(0, 0, 0);
            }
        };

        // Attach to window so it catches everything
        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseout', onMouseLeave); // use mouseout for reliable relatedTarget check

        // --- GSAP ScrollTrigger ---
        gsap.registerPlugin(ScrollTrigger);
        let ctx = gsap.context(() => {
            const pipelineTrack = document.getElementById("pipeline-track");
            if (pipelineTrack) {
                // Ensure the morphing spans the entire pipeline area
                ScrollTrigger.create({
                    trigger: pipelineTrack,
                    start: "top center", // Start morphing when pipeline hits middle of screen
                    end: "bottom bottom",
                    scrub: true,
                    onUpdate: (self) => {
                        // Progress 0 -> 1 mapped to 0 -> 3 phases
                        scrollProgress.current = self.progress * 3.0;
                    }
                });
            }
        });

        let time = 0;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.01;
            
            const phase = scrollProgress.current;

            // Move the shapes a bit to the right as we scroll down to make room for the cards
            // Use smoothly interpolated phase progress
            const offsetX = Math.min(1.0, phase) * 12.0; // Moves right up to 12 units
            let targetMeshX = offsetX;
            
            // In the Hero phase (phase < 0), let's keep it centered
            if (phase <= 0) targetMeshX = 0;
            
            // Smoothly move the container
            mesh.position.x += (targetMeshX - mesh.position.x) * 0.05;
            hitBox.position.x = mesh.position.x; // Keep hit box aligned with shapes
            
            // Probe and hover interactions are always active for coolness
            if (isMouseActive) {
                probe.visible = true;
                probeGlow.visible = true;
                probe.position.lerp(targetProbePos, 0.08);
                probe.material.opacity = 0.8;
                probeGlow.material.opacity = 0.15;
            } else {
                // Fade out and snap back if mouse left the window
                probe.material.opacity = THREE.MathUtils.lerp(probe.material.opacity, 0.0, 0.1);
                probeGlow.material.opacity = THREE.MathUtils.lerp(probeGlow.material.opacity, 0.0, 0.1);
                probe.position.set(0,0,0);
                
                // Once fully faded, hide to prevent ghost core
                if (probe.material.opacity < 0.01) {
                    probe.visible = false;
                    probeGlow.visible = false;
                }
            }

            // Slowly drift the entire matrix
            mesh.rotation.y = Math.sin(time * 0.5) * 0.15;
            mesh.rotation.x = Math.cos(time * 0.3) * 0.1;
            hitBox.rotation.copy(mesh.rotation);

            // Localize probe position to mesh coordinate space
            const probePosLocal = probe.position.clone().applyMatrix4(mesh.matrixWorld.clone().invert());
            const radius = 6.0;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // --- Position Interpolation based on Phase ---
                let ix, iy, iz;
                const cPhase = new THREE.Color();
                
                if (phase <= 1.0) {
                    const t = Math.max(0, phase);
                    ix = THREE.MathUtils.lerp(positions.tensor[i3], positions.cloud[i3], t);
                    iy = THREE.MathUtils.lerp(positions.tensor[i3+1], positions.cloud[i3+1], t);
                    iz = THREE.MathUtils.lerp(positions.tensor[i3+2], positions.cloud[i3+2], t);
                    cPhase.lerpColors(colors.base, colors.phase1, t);
                } else if (phase <= 2.0) {
                    const t = phase - 1.0;
                    ix = THREE.MathUtils.lerp(positions.cloud[i3], positions.dna[i3], t);
                    iy = THREE.MathUtils.lerp(positions.cloud[i3+1], positions.dna[i3+1], t);
                    iz = THREE.MathUtils.lerp(positions.cloud[i3+2], positions.dna[i3+2], t);
                    cPhase.lerpColors(colors.phase1, colors.phase2, t);
                } else {
                    const t = Math.min(1.0, phase - 2.0);
                    ix = THREE.MathUtils.lerp(positions.dna[i3], positions.sphere[i3], t);
                    iy = THREE.MathUtils.lerp(positions.dna[i3+1], positions.sphere[i3+1], t);
                    iz = THREE.MathUtils.lerp(positions.dna[i3+2], positions.sphere[i3+2], t);
                    cPhase.lerpColors(colors.phase2, colors.phase3, t);
                }

                // Interactive push
                let scale = 1;
                let push = 0;
                
                const dx = ix - probePosLocal.x;
                const dy = iy - probePosLocal.y;
                const dz = iz - probePosLocal.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (dist < radius) {
                    const force = 1 - (dist / radius);
                    const ease = Math.pow(force, 2);
                    push = ease * 1.8;
                    scale = 1 + (ease * 2.5);

                    if (force > 0.8) {
                        colorObj.lerpColors(colors.active, colors.core, (force-0.8)*5);
                    } else {
                        colorObj.lerpColors(cPhase, colors.active, force*1.25);
                    }
                } else {
                    colorObj.copy(cPhase);
                }
                
                const dir = new THREE.Vector3(dx, dy, dz).normalize();
                ix += dir.x * push;
                iy += dir.y * push;
                iz += dir.z * push;

                // Apply a gentle ambient floating effect to all cubes
                const noise = Math.sin(ix*0.5 + time) * Math.cos(iz*0.5 + time) * 0.15;

                dummy.position.set(ix, iy + noise, iz);
                
                // Add some local rotation for the boxes as they float
                dummy.rotation.set(time * 0.2 + ix, time * 0.3 + iy, time * 0.1 + iz);
                dummy.scale.setScalar(scale);
                dummy.updateMatrix();

                mesh.setMatrixAt(i, dummy.matrix);
                mesh.setColorAt(i, colorObj);
            }

            mesh.instanceMatrix.needsUpdate = true;
            mesh.instanceColor.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if(!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            ctx.revert();
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if(mountRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                mountRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* The cursor-crosshair class is removed from the absolute background 
                so it doesn't block the rest of the page. It'll just receive pointer events via JS 
                if we apply pointer-events-auto locally or attach events to document/container if needed. 
                For simple scroll hero interactions, it's best to attach mousemove to window/document instead of canvas. 
            */}
            <div ref={mountRef} className="w-full h-full mix-blend-screen opacity-100 transition-opacity duration-1000" />
        </div>
    );
};

export default InsightMatrix;
