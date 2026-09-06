
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { articles } from "@/lib/articles";

gsap.registerPlugin(ScrollTrigger);

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const pageRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);

  // Find current article
  const article = useMemo(() => {
    return articles.find((item) => item.id === slug);
  }, [slug]);

  // Current article index
  const currentIndex = articles.findIndex(
    (item) => item.id === slug
  );

  // Previous article
  const previousArticle =
    currentIndex > 0
      ? articles[currentIndex - 1]
      : null;

  // Next article
  const nextArticle =
    currentIndex >= 0 &&
    currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  // Related articles
  const relatedArticles = articles
    .filter(
      (item) =>
        item.id !== article?.id &&
        item.category === article?.category
    )
    .slice(0, 3);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const percentage =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;

      setProgress(
        Math.min(100, Math.max(0, percentage))
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!article) return;

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    const root = pageRef.current;

    if (!root) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      gsap
        .timeline({
          defaults: {
            ease: "power4.out",
          },
        })
        .from(".article-kicker", {
          opacity: 0,
          y: 20,
          duration: 0.5,
        })
        .from(
          ".article-title",
          {
            opacity: 0,
            y: 60,
            duration: 1,
          },
          "-=0.2"
        )
        .from(
          ".article-excerpt",
          {
            opacity: 0,
            y: 30,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".article-meta",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.35"
        )
        .from(
          ".article-cover",
          {
            opacity: 0,
            y: 50,
            duration: 0.9,
          },
          "-=0.3"
        );

      gsap.from(".content-block", {
        opacity: 0,
        y: 35,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".article-content",
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(".related-card", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".related-section",
          start: "top 85%",
          once: true,
        },
      });

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
    };
  }, [article]);

  // Article not found
  if (!article) {
    return (
      <main className="min-h-screen bg-[#08080a] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <p className="text-sm tracking-[0.3em] text-zinc-500 uppercase mb-6">
            404 / Article Not Found
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            This story doesn&apos;t exist.
          </h1>

          <p className="text-zinc-500 leading-7 mb-8">
            The article you are looking for may have been
            moved, deleted, or the URL may be incorrect.
          </p>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-3 border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            ← Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={pageRef}
      className="relative isolate min-h-screen overflow-hidden bg-[#08080a] text-white"
    >
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-white/5">
        <div
          className="h-full bg-white origin-left"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />

        {/* Glow */}
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[160px]" />

        <div className="absolute top-[700px] -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[150px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero */}
        <section className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">
          <div className="mx-auto max-w-7xl">
            {/* Back */}
            <div className="mb-16">
              <Link
                href="/blogs"
                className="group inline-flex items-center gap-3 text-sm text-zinc-500 hover:text-white transition-colors"
              >
                <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>

                Back to insights
              </Link>
            </div>

            {/* Kicker */}
            <div className="article-kicker flex flex-wrap items-center gap-4 mb-8">
              <span className="text-xs font-medium tracking-[0.3em] text-zinc-500">
                {article.number}
              </span>

              <span className="h-px w-10 bg-white/20" />

              <span className="text-xs font-medium tracking-[0.25em] text-zinc-400">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="article-title max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[88px]">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="article-excerpt mt-8 max-w-3xl text-lg leading-8 text-zinc-400 md:text-xl md:leading-9">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="article-meta mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs tracking-[0.18em] text-zinc-500">
              <span>{article.date}</span>

              <span className="h-1 w-1 rounded-full bg-zinc-700" />

              <span>{article.read}</span>

              <span className="h-1 w-1 rounded-full bg-zinc-700" />

              <span>{article.author}</span>
            </div>

            {/* Cover */}
            <div className="article-cover relative mt-16 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-zinc-900/50 md:mt-20">
              <div className="relative aspect-[16/8] overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-purple-500/[0.08]" />

                {/* Large number */}
                <div className="absolute -right-8 -top-16 select-none text-[280px] font-bold leading-none tracking-[-0.08em] text-white/[0.025] md:text-[420px]">
                  {article.number}
                </div>

                {/* Center typography */}
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <div className="text-center">
                    <p className="mb-4 text-[10px] tracking-[0.5em] text-zinc-600 md:text-xs">
                      NEXT LEVEL SCHOOL
                    </p>

                    <div className="mx-auto h-px w-20 bg-white/20 mb-6" />

                    <p className="max-w-2xl text-2xl font-medium leading-tight tracking-tight text-white/80 md:text-4xl">
                      {article.category}
                    </p>
                  </div>
                </div>

                {/* Corner labels */}
                <div className="absolute left-6 top-6 text-[10px] tracking-[0.25em] text-zinc-600 md:left-10 md:top-10">
                  INSIGHT / {article.number}
                </div>

                <div className="absolute bottom-6 right-6 text-[10px] tracking-[0.25em] text-zinc-600 md:bottom-10 md:right-10">
                  2026
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Body */}
        <section className="px-6 pb-24 md:px-10 md:pb-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-24">
            {/* Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="mb-6 text-[10px] font-medium tracking-[0.3em] text-zinc-600">
                  ON THIS PAGE
                </p>

                <div className="space-y-4 border-l border-white/[0.08] pl-5">
                  <a
                    href="#introduction"
                    className="block text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    Introduction
                  </a>

                  {article.content.sections.map(
                    (section, index) => (
                      <a
                        key={section.heading}
                        href={`#section-${index}`}
                        className="block text-sm leading-5 text-zinc-500 hover:text-white transition-colors"
                      >
                        {section.heading}
                      </a>
                    )
                  )}
                </div>
              </div>
            </aside>

            {/* Content */}
            <article
              id="introduction"
              className="article-content min-w-0"
            >
              {/* Intro */}
              <div className="content-block border-b border-white/[0.08] pb-14">
                <p className="text-xl font-medium leading-9 text-zinc-200 md:text-2xl md:leading-10">
                  {article.content.intro}
                </p>
              </div>

              {/* Sections */}
              <div className="mt-14 space-y-16">
                {article.content.sections.map(
                  (section, index) => (
                    <section
                      key={section.heading}
                      id={`section-${index}`}
                      className="content-block scroll-mt-28"
                    >
                      <div className="mb-7 flex items-start gap-5">
                        <span className="pt-1 text-xs tracking-[0.2em] text-zinc-600">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                          {section.heading}
                        </h2>
                      </div>

                      <div className="space-y-6 pl-0 md:pl-10">
                        {section.paragraphs.map(
                          (paragraph, paragraphIndex) => (
                            <p
                              key={paragraphIndex}
                              className="text-base leading-8 text-zinc-400 md:text-lg md:leading-9"
                            >
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    </section>
                  )
                )}
              </div>

              {/* Author */}
              <div className="mt-20 border-y border-white/[0.08] py-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="mb-2 text-[10px] tracking-[0.25em] text-zinc-600">
                      WRITTEN BY
                    </p>

                    <h3 className="text-lg font-medium">
                      {article.author}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {article.authorRole}
                    </p>
                  </div>

                  <Link
                    href="/blogs"
                    className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-zinc-300 transition-all duration-300 hover:border-white/20 hover:bg-white hover:text-black"
                  >
                    More insights
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Previous / Next */}
        <section className="border-y border-white/[0.08]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
            {/* Previous */}
            {previousArticle ? (
              <Link
                href={`/blogs/${previousArticle.id}`}
                className="group border-b border-white/[0.08] p-8 transition-colors hover:bg-white/[0.025] md:border-b-0 md:border-r md:p-12 lg:p-16"
              >
                <div className="mb-8 flex items-center gap-3 text-[10px] tracking-[0.25em] text-zinc-600">
                  <span>←</span>
                  PREVIOUS STORY
                </div>

                <p className="mb-4 text-xs tracking-[0.2em] text-zinc-600">
                  {previousArticle.number}
                </p>

                <h3 className="max-w-xl text-2xl font-medium leading-tight tracking-tight text-zinc-300 transition-colors group-hover:text-white md:text-3xl">
                  {previousArticle.title}
                </h3>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {/* Next */}
            {nextArticle ? (
              <Link
                href={`/blogs/${nextArticle.id}`}
                className="group p-8 text-left transition-colors hover:bg-white/[0.025] md:p-12 lg:p-16 md:text-right"
              >
                <div className="mb-8 flex items-center justify-start gap-3 text-[10px] tracking-[0.25em] text-zinc-600 md:justify-end">
                  NEXT STORY
                  <span>→</span>
                </div>

                <p className="mb-4 text-xs tracking-[0.2em] text-zinc-600">
                  {nextArticle.number}
                </p>

                <h3 className="ml-auto max-w-xl text-2xl font-medium leading-tight tracking-tight text-zinc-300 transition-colors group-hover:text-white md:text-3xl">
                  {nextArticle.title}
                </h3>
              </Link>
            ) : null}
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-section px-6 py-24 md:px-10 md:py-32">
            <div className="mx-auto max-w-7xl">
              <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-4 text-[10px] tracking-[0.3em] text-zinc-600">
                    KEEP READING
                  </p>

                  <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
                    More from this topic.
                  </h2>
                </div>

                <Link
                  href="/blogs"
                  className="text-sm text-zinc-500 transition-colors hover:text-white"
                >
                  View all articles →
                </Link>
              </div>

              <div className="grid grid-cols-1 divide-y divide-white/[0.08] border-y border-white/[0.08] md:grid-cols-3 md:divide-x md:divide-y-0">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blogs/${related.id}`}
                    className="related-card group p-7 transition-colors hover:bg-white/[0.025] md:p-9"
                  >
                    <div className="mb-10 flex items-center justify-between">
                      <span className="text-xs tracking-[0.2em] text-zinc-600">
                        {related.number}
                      </span>

                      <span className="text-[10px] tracking-[0.2em] text-zinc-600">
                        {related.read}
                      </span>
                    </div>

                    <p className="mb-4 text-[10px] tracking-[0.25em] text-zinc-600">
                      {related.category}
                    </p>

                    <h3 className="text-xl font-medium leading-snug tracking-tight text-zinc-300 transition-colors group-hover:text-white">
                      {related.title}
                    </h3>

                    <div className="mt-8 flex items-center gap-2 text-xs text-zinc-600 transition-all duration-300 group-hover:gap-4 group-hover:text-zinc-300">
                      Read article
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="border-t border-white/[0.08] px-6 py-28 md:px-10 md:py-40">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-6 text-[10px] tracking-[0.35em] text-zinc-600">
              NEXT LEVEL SCHOOL
            </p>

            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-6xl lg:text-7xl">
              Don&apos;t just read.
              <br />
              <span className="text-zinc-500">
                Build something.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-zinc-500">
              Turn what you learn into practical skills,
              real projects and a career-ready portfolio.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.02]"
              >
                Explore courses
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/blogs"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm text-zinc-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                Back to blogs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

