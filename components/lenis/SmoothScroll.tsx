// components/SmoothScroll.tsx
"use client";

import { ReactLenis, LenisRef } from "lenis/react";
import { useEffect, useRef } from "react";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    let rafId: number;

    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time);
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1, // Adjust for smoother/slower scrolling (0-1)
        duration: 1.2, // Animation duration
        smoothWheel: true, // Enable smooth scrolling for wheel events
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
