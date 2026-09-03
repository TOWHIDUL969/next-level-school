"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      const glow1 = container.querySelector(".hero-glow-1");
      const glow2 = container.querySelector(".hero-glow-2");
      const centerGlow = container.querySelector(".hero-center-glow");
      const grid = container.querySelector(".hero-grid");

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Reduced motion support
      if (prefersReducedMotion) {
        gsap.set(
          [glow1, glow2, centerGlow, grid].filter(Boolean),
          {
            clearProps: "all",
          }
        );

        return;
      }

      // ================================
      // Glow 1 Animation
      // ================================
      if (glow1) {
        gsap.to(glow1, {
          x: 80,
          y: 50,
          scale: 1.15,
          opacity: 0.65,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ================================
      // Glow 2 Animation
      // ================================
      if (glow2) {
        gsap.to(glow2, {
          x: -70,
          y: -40,
          scale: 1.2,
          opacity: 0.55,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });
      }

      // ================================
      // Center Glow
      // ================================
      if (centerGlow) {
        gsap.to(centerGlow, {
          scale: 1.25,
          opacity: 0.7,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ================================
      // Grid Movement
      // ================================
      if (grid) {
        gsap.to(grid, {
          backgroundPosition: "60px 60px",
          duration: 8,
          repeat: -1,
          ease: "none",
        });
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Background Base */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Grid */}
      <div
        className="
          hero-grid
          absolute inset-0
          opacity-[0.18]
          [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />

      {/* Top Left Glow */}
      <div
        className="
          hero-glow-1
          absolute
          -left-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-cyan-500/20
          blur-[120px]
        "
      />

      {/* Bottom Right Glow */}
      <div
        className="
          hero-glow-2
          absolute
          -bottom-40
          -right-40
          h-[550px]
          w-[550px]
          rounded-full
          bg-blue-600/20
          blur-[130px]
        "
      />

      {/* Center Glow */}
      <div
        className="
          hero-center-glow
          absolute
          left-1/2
          top-1/2
          h-[350px]
          w-[350px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/10
          blur-[100px]
        "
      />

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* Side Fade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.45)_100%)]" />
    </div>
  );
}