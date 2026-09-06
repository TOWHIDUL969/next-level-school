
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { articles } from "@/lib/articles";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  "All",
  "Web Development",
  "Design",
  "Career",
  "Technology",
  "AI",
];



export default function BlogsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const featured = articles[0];

  const filteredArticles = articles.filter((article) => {
    const categoryMatch =
      category === "All" || article.category === category.toUpperCase();

    const query = search.toLowerCase().trim();

    const searchMatch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  const regularArticles = filteredArticles.filter(
    (article) => article.id !== featured.id
  );

  useEffect(() => {
    const root = pageRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      /* HERO */

      gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .from(".hero-kicker", {
          y: 20,
          opacity: 0,
          duration: 0.6,
        })
        .from(
          ".hero-heading",
          {
            y: 70,
            opacity: 0,
            duration: 1,
          },
          "-=0.3"
        )
        .from(
          ".hero-copy",
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".hero-tools",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.35"
        );

      /* FEATURED */

      gsap.from(".featured-story", {
        scrollTrigger: {
          trigger: ".featured-story",
          start: "top 82%",
          once: true,
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      /* ARTICLE ROWS */

      gsap.utils
        .toArray<HTMLElement>(".article-row")
        .forEach((row, index) => {
          gsap.fromTo(
            row,
            {
              opacity: 0,
              y: 35,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: index * 0.04,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                once: true,
              },
            }
          );
        });

      /* CTA */

      gsap.from(".editorial-cta", {
        scrollTrigger: {
          trigger: ".editorial-cta",
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: "power3.out",
      });

      /* BACKGROUND ORBS */

      gsap.to(".glow-purple", {
        x: 80,
        y: 50,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".glow-cyan", {
        x: -70,
        y: 70,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <main
      ref={pageRef}
      className="relative isolate min-h-screen overflow-hidden bg-[#08080a] text-white"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,1) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,1) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* Purple glow */}
        <div className="glow-purple absolute -left-48 top-[5%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />

        {/* Cyan glow */}
        <div className="glow-cyan absolute -right-48 top-[45%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,#08080a_75%)]" />
      </div>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative z-10 border-b border-white/[0.08]">
        <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 lg:px-10 lg:pb-32 lg:pt-40">
          <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="hero-kicker flex items-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-purple-400 to-cyan-400" />

                <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-zinc-500">
                  Next Level Editorial
                </span>
              </div>

              <h1 className="hero-heading mt-8 max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-black leading-[0.88] tracking-[-0.06em]">
                Ideas
                <br />

                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  worth knowing.
                </span>
              </h1>

              <p className="hero-copy mt-10 max-w-2xl text-base leading-8 text-zinc-500 sm:text-lg">
                Technology, design, career and AI — carefully written ideas
                for people who want to learn, build and move forward.
              </p>
            </div>

            {/* Hero side */}
            <div className="hero-tools lg:pb-2">
              <div className="border-l border-white/10 pl-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                  Our Perspective
                </p>

                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  We believe education should not stop at information.
                  Knowledge becomes valuable when you can turn it into
                  something real.
                </p>

                <div className="mt-7 flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-black">08</p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-zinc-600">
                      Articles
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-black">05</p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-zinc-600">
                      Topics
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-black">∞</p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-zinc-600">
                      Ideas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="hero-tools mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = category === item;

                return (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                      active
                        ? "text-white"
                        : "text-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    <span
                      className={`mr-2 inline-block h-1.5 w-1.5 rounded-full transition ${
                        active
                          ? "bg-cyan-400"
                          : "bg-transparent"
                      }`}
                    />

                    {item}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-[280px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories..."
                className="w-full border-b border-white/10 bg-transparent px-0 py-3 pr-8 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/30"
              />

              <svg
                className="absolute right-0 top-3 text-zinc-600"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED STORY
      ====================================================== */}

      <section className="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400">
              Featured
            </span>

            <span className="h-px w-16 bg-white/10" />
          </div>

          <span className="text-[10px] tracking-widest text-zinc-700">
            01 / 01
          </span>
        </div>

        <Link
          href={`/blogs/${featured.id}`}
          className="featured-story group block"
        >
          <div className="grid overflow-hidden border border-white/[0.08] bg-white/[0.015] lg:grid-cols-[1.1fr_0.9fr]">
            {/* Story content */}
            <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16">
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-purple-400">
                    {featured.category}
                  </span>

                  <span className="h-px w-8 bg-white/10" />

                  <span className="text-[10px] text-zinc-700">
                    {featured.read}
                  </span>
                </div>

                <h2 className="mt-8 max-w-3xl text-3xl font-black leading-[1.05] tracking-tight transition-colors duration-500 group-hover:text-zinc-300 sm:text-4xl lg:text-6xl">
                  {featured.title}
                </h2>

                <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                  {featured.excerpt}
                </p>
              </div>

              <div className="mt-14 flex items-end justify-between border-t border-white/[0.08] pt-6">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-zinc-400">
                    {featured.author}
                  </p>

                  <p className="mt-2 text-[10px] tracking-widest text-zinc-700">
                    {featured.date}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-all duration-300 group-hover:gap-5 group-hover:text-white">
                  Read Story
                  <span className="text-lg">↗</span>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative min-h-[400px] overflow-hidden border-t border-white/[0.08] bg-[#0d0d10] lg:border-l lg:border-t-0">
              {/* Large number */}
              <div className="absolute -right-6 -top-16 select-none text-[220px] font-black leading-none tracking-[-0.1em] text-white/[0.025]">
                01
              </div>

              {/* Center graphic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-64 w-64">
                  <div className="absolute inset-0 rounded-full border border-white/[0.06]" />

                  <div className="absolute inset-8 rounded-full border border-purple-400/20" />

                  <div className="absolute inset-16 rounded-full border border-cyan-400/20" />

                  <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                    <span className="font-mono text-2xl text-white">
                      &lt;/&gt;
                    </span>
                  </div>

                  <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom -translate-x-1/2 rotate-[35deg] bg-gradient-to-t from-purple-400 to-transparent" />

                  <div className="absolute bottom-0 right-0 h-px w-1/2 bg-gradient-to-l from-cyan-400 to-transparent" />
                </div>
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-700">
                  Knowledge / 2026
                </span>

                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)]" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* =====================================================
          ARTICLE LIST
      ====================================================== */}

      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pb-28 lg:px-10">
        <div className="mb-10 flex items-end justify-between border-b border-white/[0.08] pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
              Latest Thinking
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              More to explore.
            </h2>
          </div>

          <span className="hidden text-[10px] tracking-widest text-zinc-700 sm:block">
            {regularArticles.length.toString().padStart(2, "0")} STORIES
          </span>
        </div>

        {regularArticles.length > 0 ? (
          <div>
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blogs/${article.id}`}
                className="article-row group relative grid border-b border-white/[0.08] py-8 transition-all duration-500 hover:px-4 hover:bg-white/[0.02] lg:grid-cols-[80px_180px_1fr_110px]"
              >
                {/* Number */}
                <div className="mb-4 lg:mb-0">
                  <span className="text-xs font-black tracking-widest text-zinc-700 transition-colors group-hover:text-purple-400">
                    {article.number}
                  </span>
                </div>

                {/* Category */}
                <div className="mb-4 lg:mb-0">
                  <span className="text-[9px] font-bold tracking-[0.22em] text-zinc-600">
                    {article.category}
                  </span>
                </div>

                {/* Main */}
                <div className="pr-6">
                  <h3 className="max-w-3xl text-xl font-bold leading-snug text-zinc-200 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                    {article.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 transition-colors group-hover:text-zinc-500">
                    {article.excerpt}
                  </p>

                  <div className="mt-5 flex items-center gap-4">
                    <span className="text-[9px] font-bold tracking-widest text-zinc-700">
                      {article.author}
                    </span>

                    <span className="h-px w-5 bg-white/10" />

                    <span className="text-[9px] tracking-widest text-zinc-700">
                      {article.date}
                    </span>
                  </div>
                </div>

                {/* Read */}
                <div className="mt-6 flex items-center justify-start gap-2 lg:mt-0 lg:justify-end">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-700">
                    {article.read}
                  </span>

                  <span className="text-sm text-zinc-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-400">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 py-24 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
              No stories found
            </p>

            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
              className="mt-6 text-xs font-bold uppercase tracking-widest text-white underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          EDITORIAL CTA
      ====================================================== */}

      <section className="relative z-10 border-t border-white/[0.08]">
        <div className="editorial-cta relative mx-auto max-w-[1400px] px-6 py-28 lg:px-10 lg:py-36">
          <div className="absolute right-10 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border border-white/[0.04] lg:block" />

          <div className="absolute right-24 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border border-cyan-400/10 lg:block" />

          <div className="relative max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-purple-400">
              The next chapter
            </p>

            <h2 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Don't just consume
              <br />

              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                knowledge.
              </span>
            </h2>

            <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
              Learn the skill. Build the project. Create something that
              matters.
            </p>

            <Link
              href="/courses"
              className="group mt-10 inline-flex items-center gap-4 border border-white/10 bg-white/[0.03] px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:border-white/20 hover:bg-white hover:text-black"
            >
              Explore Courses

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

