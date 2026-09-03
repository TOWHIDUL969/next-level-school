
"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface HeroContentAnimationProps {
  children: ReactNode;
}

export default function HeroContentAnimation({
  children,
}: HeroContentAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      // ==========================================
      // Reduced Motion Support
      // ==========================================

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".hero-badge",
            ".hero-title",
            ".hero-description",
            ".hero-buttons",
            ".hero-stats",
            ".hero-card",
            ".float-card-1",
            ".float-card-2",
          ],
          {
            clearProps: "all",
          }
        );

        return;
      }

      // ==========================================
      // Main Hero Entrance Animation
      // ==========================================

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Badge
      timeline.from(".hero-badge", {
        opacity: 0,
        y: 25,
        filter: "blur(8px)",
        duration: 0.7,
      });

      // Title
      timeline.from(
        ".hero-title",
        {
          opacity: 0,
          y: 55,
          filter: "blur(12px)",
          duration: 1,
        },
        "-=0.35"
      );

      // Description
      timeline.from(
        ".hero-description",
        {
          opacity: 0,
          y: 25,
          filter: "blur(8px)",
          duration: 0.7,
        },
        "-=0.5"
      );

      // Buttons
      timeline.from(
        ".hero-buttons",
        {
          opacity: 0,
          y: 25,
          scale: 0.96,
          duration: 0.65,
        },
        "-=0.35"
      );

      // Stats
      timeline.from(
        ".hero-stats",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        "-=0.35"
      );

      // Main Card
      timeline.from(
        ".hero-card",
        {
          opacity: 0,
          x: 70,
          scale: 0.88,
          rotationY: -8,
          filter: "blur(10px)",
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.75"
      );

      // ==========================================
      // Floating Card 1
      // ==========================================

      gsap.to(".float-card-1", {
        y: -16,
        rotation: 1.5,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ==========================================
      // Floating Card 2
      // ==========================================

      gsap.to(".float-card-2", {
        y: 16,
        rotation: -1.5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ==========================================
      // Subtle Card Hover / Breathing Effect
      // ==========================================

      gsap.to(".hero-card", {
        y: -5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      });
    }, container);

    // ==========================================
    // Cleanup
    // ==========================================

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

