"use client";

import {
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export default function ScrollAnimation({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 60,
  once = true,
}: ScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ================================
      // Reduced Motion
      // ================================
      if (prefersReducedMotion) {
        gsap.set(container, {
          clearProps: "all",
          opacity: 1,
        });

        return;
      }

      // ================================
      // Initial Position
      // ================================
      let x = 0;
      let y = 0;
      let scale = 1;

      switch (direction) {
        case "up":
          y = distance;
          break;

        case "down":
          y = -distance;
          break;

        case "left":
          x = distance;
          break;

        case "right":
          x = -distance;
          break;

        case "scale":
          scale = 0.88;
          break;
      }

      // ================================
      // Scroll Reveal
      // ================================
      gsap.fromTo(
        container,
        {
          opacity: 0,
          x,
          y,
          scale,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration,
          delay,
          ease: "power3.out",

          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "bottom 20%",

            toggleActions: once
              ? "play none none none"
              : "play reverse play reverse",

            once,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [
    direction,
    delay,
    duration,
    distance,
    once,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      {children}
    </div>
  );
}