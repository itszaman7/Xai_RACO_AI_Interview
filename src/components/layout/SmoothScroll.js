"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScroll — Wraps the page with Lenis smooth scrolling
 * and syncs it with GSAP ScrollTrigger so scroll-driven
 * animations stay in lock-step with the interpolated scroll position.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis → ScrollTrigger on every scroll event
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker for frame-perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // GSAP ticker gives seconds, Lenis wants ms
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
