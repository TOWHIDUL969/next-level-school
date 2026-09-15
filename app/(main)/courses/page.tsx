
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Bot,
  Briefcase,
  Calculator,
  Camera,
  Check,
  Code2,
  Database,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  Megaphone,
  Monitor,
  Music,
  Palette,
  PenTool,
  Server,
  Settings,
  ShoppingCart,
  Smartphone,
  Terminal,
  Video,
} from "lucide-react";

type Instructor = {
  name?: string;
  email?: string;
};

type Course = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  category?: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | string;
  duration?: number;
  price?: number;
  instructor?: Instructor;
  totalLessons?: number;
  status?: "draft" | "published" | string;

  // New database fields
  skills?: string[];
  icon?: string;
  featured?: boolean;
};

const learningSteps = [
  {
    number: "01",
    title: "Choose",
    description: "Choose the right course based on your goals.",
  },
  {
    number: "02",
    title: "Learn",
    description: "Learn practical skills from structured lessons.",
  },
  {
    number: "03",
    title: "Practice",
    description: "Practice your skills through real-world tasks.",
  },
  {
    number: "04",
    title: "Grow",
    description: "Build confidence and move towards your career.",
  },
];

const benefits = [
  {
    number: "01",
    title: "Practical First",
    description:
      "Learn through practical lessons and skills that you can actually use.",
  },
  {
    number: "02",
    title: "Career Focused",
    description:
      "Our courses are designed around real-world career and workplace needs.",
  },
  {
    number: "03",
    title: "Modern Tools",
    description:
      "Learn the latest tools and technologies used in today's digital world.",
  },
  {
    number: "04",
    title: "Project Based",
    description:
      "Turn your knowledge into practical experience through hands-on projects.",
  },
];

/* =========================================================
   COURSE ICON MAP
   ========================================================= */

const iconMap = {
  code: Code2,
  monitor: Monitor,
  palette: Palette,
  "pen-tool": PenTool,
  megaphone: Megaphone,
  video: Video,
  bot: Bot,
  database: Database,
  globe: Globe,
  smartphone: Smartphone,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "file-text": FileText,
  settings: Settings,
  "book-open": BookOpen,
  camera: Camera,
  music: Music,
  "shopping-cart": ShoppingCart,
  calculator: Calculator,
  terminal: Terminal,
  server: Server,
  layers: Layers,
} as const;

/* =========================================================
   HELPERS
   ========================================================= */

function getCourseIcon(icon?: string) {
  if (!icon) {
    return BookOpen;
  }

  const normalizedIcon = icon.trim().toLowerCase();

  return (
    iconMap[normalizedIcon as keyof typeof iconMap] || BookOpen
  );
}

function formatDuration(duration?: number) {
  if (!duration || duration <= 0) {
    return "Flexible";
  }

  return `${duration} Hours`;
}

function formatPrice(price?: number) {
  if (typeof price !== "number" || price <= 0) {
    return "Free";
  }

  return `৳${price.toLocaleString("en-BD")}`;
}

function getShortDescription(course: Course) {
  const text =
    course.shortDescription?.trim() || course.description?.trim();

  if (!text) {
    return "Build practical skills and prepare yourself for the modern digital world.";
  }

  return text.replace(/\s+/g, " ").trim();
}

/*
 * Database-এর নতুন skills field ব্যবহার করবে।
 * পুরোনো course/document-এ skills না থাকলে fallback দেখাবে।
 */
function getCourseSkills(course: Course) {
  if (Array.isArray(course.skills) && course.skills.length > 0) {
    return course.skills
      .filter((skill) => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [
    "Practical Skills",
    "Modern Tools",
    "Hands-on Practice",
    "Career Skills",
  ];
}

/* =========================================================
   PAGE
   ========================================================= */

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     FETCH COURSES
     ======================================================= */

  useEffect(() => {
    let isMounted = true;

    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/courses?status=published", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load courses."
          );
        }

        if (isMounted) {
          setCourses(
            Array.isArray(data.courses) ? data.courses : []
          );
        }
      } catch (err) {
        console.error("Public Courses Fetch Error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load courses right now."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     PUBLISHED COURSES
     ======================================================= */

  const publishedCourses = useMemo(() => {
    return courses.filter(
      (course) => course.status === "published"
    );
  }, [courses]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* =========================================================
          HERO
      ========================================================= */}


      <section className="relative isolate overflow-hidden">
        {/* =========================================================
      COLORFUL BACKGROUND
  ========================================================= */}

        <div className="absolute inset-0 -z-20">
          {/* Main purple glow */}
          <div className="absolute left-[10%] top-[-220px] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px] sm:h-[550px] sm:w-[550px]" />

          {/* Blue glow */}
          <div className="absolute right-[-180px] top-[15%] h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[130px] sm:h-[520px] sm:w-[520px]" />

          {/* Pink glow */}
          <div className="absolute bottom-[-220px] left-[30%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[140px] sm:h-[520px] sm:w-[520px]" />

          {/* Cyan glow */}
          <div className="absolute bottom-[-180px] right-[10%] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />

          {/* Radial light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06),transparent_45%)]" />

          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

          {/* Center vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/20 to-[#050507]" />
        </div>

        {/* =========================================================
      DECORATIVE ORBS
  ========================================================= */}

        <div className="pointer-events-none absolute left-[8%] top-[28%] -z-10 hidden h-2 w-2 animate-pulse rounded-full bg-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.9)] sm:block" />

        <div className="pointer-events-none absolute right-[12%] top-[22%] -z-10 hidden h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)] sm:block" />

        <div className="pointer-events-none absolute bottom-[25%] left-[45%] -z-10 hidden h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.9)] sm:block" />

        {/* =========================================================
      CONTAINER
  ========================================================= */}

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-28 lg:pt-36">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">

            {/* =====================================================
          LEFT CONTENT
      ===================================================== */}

            <div className="relative">
              {/* Small glow behind content */}
              <div className="pointer-events-none absolute -left-20 top-10 h-60 w-60 rounded-full bg-purple-600/10 blur-[100px]" />

              {/* Badge */}

              <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-blue-500/10 px-4 py-2 text-xs font-medium text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.08)] backdrop-blur-md sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" />
                </span>

                Professional Courses

                <span className="ml-1 hidden text-purple-400/60 sm:inline">
                  •
                </span>

                <span className="hidden text-zinc-500 sm:inline">
                  Learn. Practice. Grow.
                </span>
              </div>

              {/* Heading */}

              <h1 className="relative max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
                Learn Skills.
                <br />

                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  Build Your Future.
                </span>
              </h1>

              {/* Gradient line */}

              <div className="mt-6 h-px w-24 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-transparent sm:mt-7 sm:w-32" />

              {/* Description */}

              <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:mt-7 sm:text-base sm:leading-8 lg:text-lg">
                Build practical, career-ready skills with structured
                courses designed to help you learn faster, practice
                better, and grow with confidence.
              </p>

              {/* =====================================================
            BUTTONS
        ===================================================== */}

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link
                  href="#courses"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_40px_rgba(168,85,247,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(168,85,247,0.3)] sm:text-base"
                >
                  {/* Button shine */}

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">
                    Start Learning
                  </span>

                  <span className="relative text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-purple-500/10 sm:text-base"
                >
                  Talk to Us

                  <span className="text-zinc-500 transition-colors group-hover:text-purple-300">
                    ↗
                  </span>
                </Link>
              </div>

              {/* =====================================================
            DYNAMIC STATS
        ===================================================== */}

              <div className="mt-10 grid grid-cols-3 gap-3 sm:mt-12 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-6">
                {/* Active Courses */}

                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm transition hover:border-purple-500/20 hover:bg-purple-500/[0.04] sm:border-0 sm:bg-transparent sm:p-0">
                  <div className="text-2xl font-black text-white sm:text-3xl">
                    {loading
                      ? "--"
                      : publishedCourses.length
                        .toString()
                        .padStart(2, "0")}
                  </div>

                  <div className="mt-1 text-[10px] leading-4 text-zinc-500 sm:text-sm">
                    Active Courses
                  </div>
                </div>

                {/* Practical Learning */}

                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm transition hover:border-fuchsia-500/20 hover:bg-fuchsia-500/[0.04] sm:border-0 sm:bg-transparent sm:p-0">
                  <div className="text-2xl font-black text-white sm:text-3xl">
                    100%
                  </div>

                  <div className="mt-1 text-[10px] leading-4 text-zinc-500 sm:text-sm">
                    Practical Learning
                  </div>
                </div>

                {/* Growth */}

                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm transition hover:border-blue-500/20 hover:bg-blue-500/[0.04] sm:border-0 sm:bg-transparent sm:p-0">
                  <div className="text-2xl font-black text-white sm:text-3xl">
                    ∞
                  </div>

                  <div className="mt-1 text-[10px] leading-4 text-zinc-500 sm:text-sm">
                    Growth Potential
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
          RIGHT — AVAILABLE COURSES
      ===================================================== */}

            <div className="relative">
              {/* Large glow */}

              <div className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-r from-purple-600/10 via-fuchsia-600/10 to-blue-600/10 blur-[100px]" />

              {/* Outer glass card */}

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-purple-500/[0.03] p-3 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl sm:rounded-3xl sm:p-5">

                {/* Top colorful line */}

                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

                {/* Header */}

                <div className="mb-4 flex items-center justify-between gap-4 px-2 pt-1 sm:mb-5 sm:px-1 sm:pt-0">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-purple-300/70 sm:text-xs sm:tracking-[0.25em]">
                      Available Now
                    </p>

                    <h3 className="mt-1.5 truncate text-lg font-bold text-white sm:mt-2 sm:text-xl">
                      Explore Our Courses
                    </h3>
                  </div>

                  {/* Count */}

                  <div className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/15 to-blue-500/10 px-3 text-sm font-bold text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.08)] sm:h-11">
                    {loading ? "..." : publishedCourses.length}
                  </div>
                </div>

                {/* =================================================
              COURSE LIST
          ================================================= */}

                {loading ? (
                  <div className="max-h-[320px] space-y-2.5 overflow-y-auto pr-1 sm:max-h-[390px] sm:space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="h-[62px] animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.04]"
                      />
                    ))}
                  </div>
                ) : publishedCourses.length > 0 ? (
                  <div className="relative">
                    <div
                      className="
                  max-h-[320px]
                  space-y-2.5
                  overflow-y-auto
                  overscroll-contain
                  pr-1
                  sm:max-h-[390px]
                  sm:space-y-3
                  sm:pr-2

                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  [&::-webkit-scrollbar-thumb]:bg-purple-500/30
                  hover:[&::-webkit-scrollbar-thumb]:bg-purple-400/50
                "
                    >
                      {publishedCourses.map((course, index) => {
                        const CourseIcon = getCourseIcon(course.icon);

                        const isFeatured = Boolean(course.featured);

                        return (
                          <Link
                            key={course._id}
                            href={`/courses/${course.slug}`}
                            className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 transition-all duration-300 sm:gap-4 ${isFeatured
                                ? "border-purple-500/20 bg-gradient-to-r from-purple-500/[0.09] via-fuchsia-500/[0.04] to-blue-500/[0.04] hover:border-purple-400/40 hover:from-purple-500/[0.14]"
                                : "border-white/[0.06] bg-white/[0.025] hover:border-purple-500/20 hover:bg-white/[0.06]"
                              }`}
                          >
                            {/* Hover glow */}

                            <div className="pointer-events-none absolute -left-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-purple-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                            {/* Icon */}

                            <div
                              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 ${isFeatured
                                  ? "border-purple-400/20 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-blue-500/15 text-purple-200"
                                  : "border-white/[0.06] bg-gradient-to-br from-purple-500/15 to-blue-500/10 text-purple-300"
                                }`}
                            >
                              <CourseIcon
                                size={19}
                                strokeWidth={1.8}
                              />

                              {/* Icon glow */}

                              <span className="pointer-events-none absolute inset-0 rounded-xl bg-purple-400/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                            </div>

                            {/* Content */}

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-zinc-200 transition group-hover:text-white sm:text-sm">
                                {course.title}
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <p className="truncate text-[10px] text-zinc-500 sm:text-xs">
                                  {course.category ||
                                    "Professional Course"}
                                </p>

                                {isFeatured && (
                                  <>
                                    <span className="h-1 w-1 shrink-0 rounded-full bg-purple-500/60" />

                                    <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-purple-300 sm:text-[10px]">
                                      Featured
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Number */}

                            <span className="shrink-0 text-[10px] font-medium text-zinc-700 transition group-hover:text-purple-400 sm:text-xs">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Arrow */}

                            <span className="hidden shrink-0 text-zinc-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-purple-300 sm:block">
                              →
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Bottom scroll indicator */}

                    {publishedCourses.length > 5 && (
                      <div className="pointer-events-none absolute bottom-0 left-0 right-1 h-12 rounded-b-2xl bg-gradient-to-t from-[#09090d] via-[#09090d]/70 to-transparent" />
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                      <BookOpen size={21} />
                    </div>

                    <p className="mt-4 text-sm text-zinc-500">
                      No published courses available yet.
                    </p>
                  </div>
                )}

                {/* Bottom status */}

                {!loading && publishedCourses.length > 0 && (
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] px-1 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                      <span className="text-[10px] text-zinc-600">
                        {publishedCourses.length} courses available
                      </span>
                    </div>

                    <Link
                      href="#courses"
                      className="text-[10px] font-medium text-purple-400 transition hover:text-purple-300"
                    >
                      View All →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
      BOTTOM FADE
  ========================================================= */}

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050507] to-transparent" />
      </section>
   


      {/* =========================================================
          COURSES
      ========================================================= */}

      <section
        id="courses"
        className="relative border-t border-white/[0.06] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Explore Courses
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Choose Your Learning Path
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-500 sm:text-lg">
              Choose from our practical, career-focused courses and
              start building skills that matter.
            </p>
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {error && (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-center">
              <p className="text-sm text-red-300">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
              >
                Try Again
              </button>
            </div>
          )}

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (
            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.025]"
                >
                  <div className="aspect-[16/9] animate-pulse bg-white/[0.05]" />

                  <div className="space-y-4 p-6">
                    <div className="h-5 w-24 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-7 w-4/5 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-12 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-5 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =====================================================
              EMPTY
          ===================================================== */}

          {!loading &&
            !error &&
            publishedCourses.length === 0 && (
              <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                  <BookOpen size={28} />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Courses Coming Soon
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-500">
                  We are preparing practical courses for your
                  learning journey. Please check back soon.
                </p>
              </div>
            )}

          {/* =====================================================
              COURSE CARDS
          ===================================================== */}

          {!loading &&
            !error &&
            publishedCourses.length > 0 && (
              <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {publishedCourses.map((course, index) => {
                  const skills = getCourseSkills(course);
                  const CourseIcon = getCourseIcon(course.icon);
                  const isFeatured = Boolean(course.featured);

                  return (
                    <article
                      key={course._id}
                      className={`group relative overflow-hidden rounded-3xl border transition duration-300 hover:-translate-y-1 ${isFeatured
                          ? "border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] to-white/[0.025]"
                          : "border-white/[0.07] bg-white/[0.025]"
                        }`}
                    >
                      {/* Glow */}

                      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-500/10 blur-[70px] transition group-hover:bg-purple-500/20" />

                      {/* =================================================
                          THUMBNAIL
                      ================================================= */}

                      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-950/70 to-blue-950/50">
                            <CourseIcon
                              size={48}
                              strokeWidth={1.5}
                              className="text-purple-300"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Category */}

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-md">
                            {course.category || "Professional"}
                          </span>
                        </div>

                        {/* Featured Badge */}

                        {isFeatured && (
                          <div className="absolute right-4 top-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-200 backdrop-blur-md">
                              <Check size={12} />
                              Featured
                            </span>
                          </div>
                        )}

                        {/* Course number */}

                        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-xs font-bold text-white backdrop-blur-md">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>

                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <div className="relative p-6">
                        {/* Meta */}

                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                          <span>
                            {formatDuration(course.duration)}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-zinc-700" />

                          <span>
                            {course.level || "All Levels"}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-zinc-700" />

                          <span>
                            {course.totalLessons || 0}{" "}
                            {course.totalLessons === 1
                              ? "Lesson"
                              : "Lessons"}
                          </span>
                        </div>

                        {/* Title */}

                        <h3 className="mt-4 line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-white">
                          {course.title}
                        </h3>

                        {/* Description */}

                        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-zinc-500">
                          {getShortDescription(course)}
                        </p>

                        {/* =================================================
                            SKILLS — DATABASE DRIVEN
                        ================================================= */}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.035] px-2.5 py-1.5 text-[11px] text-zinc-400"
                            >
                              {skill}
                            </span>
                          ))}

                          {skills.length > 4 && (
                            <span className="rounded-lg border border-white/[0.06] bg-white/[0.035] px-2.5 py-1.5 text-[11px] text-zinc-600">
                              +{skills.length - 4}
                            </span>
                          )}
                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
                          <div>
                            <p className="text-xs text-zinc-600">
                              Course Fee
                            </p>

                            <p className="mt-1 text-lg font-bold text-white">
                              {formatPrice(course.price)}
                            </p>
                          </div>

                          <Link
                            href={`/courses/${course.slug}`}
                            className="group/button inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                          >
                            View Course

                            <span className="transition-transform group-hover/button:translate-x-1">
                              →
                            </span>
                          </Link>
                        </div>

                        {/* =================================================
                            INSTRUCTOR
                        ================================================= */}

                        {course.instructor?.name && (
                          <div className="mt-5 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-xs font-bold text-purple-200">
                              {course.instructor.name
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                                Instructor
                              </p>

                              <p className="text-xs font-medium text-zinc-400">
                                {course.instructor.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE NLS
      ========================================================= */}

      <section className="relative border-t border-white/[0.06] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                Why Choose NLS
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Learn More.
                <br />

                <span className="text-zinc-500">
                  Do More.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-zinc-500">
                We focus on practical learning so you can turn
                knowledge into real skills and real opportunities.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit.number}
                  className="group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:border-purple-500/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-400">
                      {benefit.number}
                    </span>

                    <span className="text-zinc-700 transition group-hover:text-purple-400">
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LEARNING JOURNEY
      ========================================================= */}

      <section className="relative border-t border-white/[0.06] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Learning Journey
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              From Learning to Doing
            </h2>

            <p className="mt-5 text-base leading-8 text-zinc-500 sm:text-lg">
              A simple and practical learning journey designed to
              help you move forward with confidence.
            </p>
          </div>

          <div className="relative mt-16 grid gap-5 md:grid-cols-4">
            {/* Desktop connecting line */}

            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent md:block" />

            {learningSteps.map((step) => (
              <div
                key={step.number}
                className="relative text-center"
              >
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-[#0a0a0f] text-sm font-bold text-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-zinc-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[140px]" />

        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-xl text-purple-300">
            <BookOpen size={22} />
          </div>

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Ready to Build Your Future?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-500 sm:text-lg">
            Choose a course, start learning, and take the next
            step toward your personal and professional goals.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="#courses"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-zinc-200"
            >
              Explore Courses
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

