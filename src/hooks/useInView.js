"use client";

import { useRef, useState, useEffect } from "react";

/**
 * useInView — Intersection Observer hook.
 * Returns [ref, isInView]. Once the element enters the viewport it stays true (triggers once).
 */
export function useInView(
  options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(node);
      }
    }, options);

    observer.observe(node);
    return () => observer.unobserve(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isInView];
}
