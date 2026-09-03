
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const grid = gridRef.current;
    const beam = beamRef.current;
    const mouseGlow = mouseGlowRef.current;
    const points = pointsRef.current;
    const content = contentRef.current;

    if (!footer || !grid || !beam || !mouseGlow || !points || !content) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    /* =========================================
       GSAP CONTEXT
    ========================================= */

    const ctx = gsap.context(() => {
      /* =========================================
         GRID MOVEMENT
      ========================================= */

      gsap.to(grid, {
        backgroundPosition: "0px 45px",
        duration: 5,
        repeat: -1,
        ease: "none",
      });

      /* =========================================
         SCAN BEAM
      ========================================= */

      gsap.fromTo(
        beam,
        {
          y: "-120%",
          opacity: 0,
        },
        {
          y: "650%",
          opacity: 1,
          duration: 5,
          repeat: -1,
          ease: "none",
        }
      );

      /* =========================================
         GLOWING GRID POINTS
      ========================================= */

      const pointElements = points.children;

      gsap.to(pointElements, {
        opacity: 1,
        scale: 1.5,
        duration: 1.2,
        stagger: {
          each: 0.15,
          repeat: -1,
          yoyo: true,
        },
        ease: "power2.inOut",
      });

      /* =========================================
         FOOTER CONTENT REVEAL
      ========================================= */

      gsap.fromTo(
        content.children,
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      /* =========================================
         MOUSE FOLLOW GLOW
      ========================================= */

      const handleMouseMove = (event: MouseEvent) => {
        const rect = footer.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        gsap.to(mouseGlow, {
          x,
          y,
          duration: 0.8,
          ease: "power3.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(mouseGlow, {
          opacity: 0,
          duration: 0.5,
        });
      };

      const handleMouseEnter = () => {
        gsap.to(mouseGlow, {
          opacity: 1,
          duration: 0.5,
        });
      };

      footer.addEventListener("mousemove", handleMouseMove);
      footer.addEventListener("mouseleave", handleMouseLeave);
      footer.addEventListener("mouseenter", handleMouseEnter);

      return () => {
        footer.removeEventListener("mousemove", handleMouseMove);
        footer.removeEventListener("mouseleave", handleMouseLeave);
        footer.removeEventListener("mouseenter", handleMouseEnter);
      };
    }, footer);

    return () => ctx.revert();
  }, []);

  /* =========================================
     GRID POINT POSITIONS
  ========================================= */

  const gridPoints = [
    { left: "8%", top: "18%" },
    { left: "23%", top: "32%" },
    { left: "41%", top: "15%" },
    { left: "58%", top: "28%" },
    { left: "76%", top: "18%" },
    { left: "91%", top: "38%" },

    { left: "14%", top: "55%" },
    { left: "34%", top: "68%" },
    { left: "52%", top: "52%" },
    { left: "69%", top: "72%" },
    { left: "87%", top: "60%" },

    { left: "7%", top: "84%" },
    { left: "28%", top: "88%" },
    { left: "47%", top: "82%" },
    { left: "65%", top: "92%" },
    { left: "82%", top: "85%" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-black text-white"
    >
      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* -----------------------------------------
            VISIBLE GRID
        ----------------------------------------- */}

        <div
          ref={gridRef}
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.10) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.10) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "45px 45px",
          }}
        />

        {/* -----------------------------------------
            GLOWING GRID POINTS
        ----------------------------------------- */}

        <div
          ref={pointsRef}
          className="absolute inset-0"
        >
          {gridPoints.map((point, index) => (
            <span
              key={index}
              className="absolute h-1.5 w-1.5 rounded-full bg-white opacity-40 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                left: point.left,
                top: point.top,
              }}
            />
          ))}
        </div>

        {/* -----------------------------------------
            HORIZONTAL SCAN BEAM
        ----------------------------------------- */}

        <div
          ref={beamRef}
          className="absolute left-0 top-0 h-32 w-full"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.02) 80%, transparent 100%)",
            filter: "blur(8px)",
          }}
        />

        {/* -----------------------------------------
            MOUSE GLOW
        ----------------------------------------- */}

        <div
          ref={mouseGlowRef}
          className="absolute left-0 top-0 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 25%, transparent 68%)",
          }}
        />

        {/* -----------------------------------------
            TOP FADE
        ----------------------------------------- */}

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent" />

        {/* -----------------------------------------
            BOTTOM FADE
        ----------------------------------------- */}

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* -----------------------------------------
            SIDE VIGNETTE
        ----------------------------------------- */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* =====================================================
          MAIN FOOTER CONTENT
      ===================================================== */}

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              BRAND
          ================================================= */}

          <div>
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl transition duration-500 group-hover:bg-white/20" />

                <Image
                  src="/logo.png"
                  alt="Next Level School"
                  width={50}
                  height={50}
                  className="relative h-12 w-12 object-contain transition duration-500 group-hover:scale-110"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Next Level School
                </h2>

                <p className="text-xs text-gray-400">
                  IT Institute
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Learn modern technology and digital skills with
              practical-based professional training.
            </p>

            {/* Social Icons */}

            <div className="mt-7 flex gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white hover:text-black"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  f
                </span>
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white hover:text-black"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  ▶
                </span>
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white hover:text-black"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  in
                </span>
              </a>

            </div>
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div>
            <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.2em]">
              Quick Links

              <span className="absolute -bottom-2 left-0 h-px w-8 bg-white/70" />
            </h3>

            <ul className="mt-8 space-y-4">

              {[
                ["Home", "/"],
                ["About Us", "/about"],
                ["Courses", "/courses"],
                ["Contact", "/contact"],
                ["Registration", "/register"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100">
                      →
                    </span>

                    {label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* =================================================
              COURSES
          ================================================= */}

          <div>
            <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.2em]">
              Courses

              <span className="absolute -bottom-2 left-0 h-px w-8 bg-white/70" />
            </h3>

            <ul className="mt-8 space-y-4">

              {[
                ["Web Development", "/courses/web-development"],
                ["UI/UX Design", "/courses/ui-ux"],
                ["Graphic Design", "/courses/graphic-design"],
                ["Digital Marketing", "/courses/digital-marketing"],
                ["Video Editing", "/courses/video-editing"],
                [
                  "AI Driven Basic Computer",
                  "/courses/ai-driven-basic-computer",
                ],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center text-sm text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    <span className="mr-2 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100">
                      →
                    </span>

                    {label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>
            <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.2em]">
              Contact Us

              <span className="absolute -bottom-2 left-0 h-px w-8 bg-white/70" />
            </h3>

            <div className="mt-8 space-y-6">

              {/* Address */}

              <div className="group">
                <p className="text-sm font-medium">
                  📍 Address
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-400 transition-colors group-hover:text-gray-300">
                  Your Institute Address
                </p>
              </div>

              {/* Phone */}

              <div className="group">
                <p className="text-sm font-medium">
                  ☎ Phone
                </p>

                <a
                  href="tel:+8801XXXXXXXXX"
                  className="mt-1 block text-sm text-gray-400 transition-colors hover:text-white"
                >
                  +880 1XXX-XXXXXX
                </a>
              </div>

              {/* Email */}

              <div className="group">
                <p className="text-sm font-medium">
                  ✉ Email
                </p>

                <a
                  href="mailto:info@nextlevelschool.com"
                  className="mt-1 block text-sm text-gray-400 transition-colors hover:text-white"
                >
                  info@nextlevelschool.com
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM FOOTER
      ===================================================== */}

      <div className="relative z-10 border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Next Level School.
            All rights reserved.
          </p>

          <div className="flex justify-center gap-6 sm:justify-end">

            <Link
              href="/privacy-policy"
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>
      </div>
    </footer>
  );
}

