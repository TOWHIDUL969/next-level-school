"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".scroll-item", {
        opacity: 0,
        y: 80,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".scroll-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-zinc-950 text-white">
      <section className="scroll-section py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="scroll-item text-4xl font-bold">
            Learn. Practice. Grow.
          </h2>

          <p className="scroll-item mt-4 max-w-2xl text-lg">
            Build practical skills with modern technology and
            industry-focused training.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="scroll-item rounded-2xl border p-6 shadow-lg">
              <h3 className="text-xl font-bold">Practical Learning</h3>
              <p className="mt-2">
                Learn by doing real-world projects.
              </p>
            </div>

            <div className="scroll-item rounded-2xl border p-6 shadow-lg">
              <h3 className="text-xl font-bold">Expert Mentors</h3>
              <p className="mt-2">
                Learn from experienced instructors.
              </p>
            </div>

            <div className="scroll-item rounded-2xl border p-6 shadow-lg">
              <h3 className="text-xl font-bold">Career Focused</h3>
              <p className="mt-2">
                Develop skills for your future career.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}