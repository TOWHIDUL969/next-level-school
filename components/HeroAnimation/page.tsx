"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroAnimation() {
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main content animation
      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .from(".hero-badge", {
          opacity: 0,
          y: 25,
          duration: 0.7,
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 45,
            duration: 0.9,
          },
          "-=0.35"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
          },
          "-=0.45"
        )
        .from(
          ".hero-buttons",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.35"
        )
        .from(
          ".hero-stats",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.35"
        )
        .from(
          ".hero-card",
          {
            opacity: 0,
            scale: 0.85,
            x: 40,
            duration: 1,
          },
          "-=0.7"
        );

      // Floating cards
      gsap.to(".float-card-1", {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".float-card-2", {
        y: 15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".float-card-3", {
        y: -10,
        x: 8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Background glow
      gsap.to(".hero-glow-1", {
        x: 80,
        y: 40,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-glow-2", {
        x: -60,
        y: -30,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, animationRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={animationRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Background glows */}
      <div className="hero-glow-1 absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />

      <div className="hero-glow-2 absolute right-0 top-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}