import Link from "next/link";

import HeroAnimation from "@/components/HeroAnimation/page";
import HeroContentAnimation from "@/components/HeroContentAnimation/page";
import ScrollAnimation from "@/components/ScrollAnimation/page";

const courses = [
  {
    number: "01",
    title: "MERN Web Development",
    description:
      "Learn modern full-stack web development using MongoDB, Express.js, React.js and Node.js.",
    level: "Advanced",
    duration: "6 Months",
    icon: "⌘",
  },
  {
    number: "02",
    title: "Basic Computer & IT",
    description:
      "Build a strong foundation in computer operation, Microsoft Office, internet and essential IT skills.",
    level: "Beginner",
    duration: "3 Months",
    icon: "▣",
  },
  {
    number: "03",
    title: "Graphics Design",
    description:
      "Master professional graphic design concepts and create stunning digital designs for real projects.",
    level: "Intermediate",
    duration: "4 Months",
    icon: "◈",
  },
  {
    number: "04",
    title: "UI/UX Design",
    description:
      "Learn user-centered design, wireframing, prototyping and modern interface design principles.",
    level: "Intermediate",
    duration: "4 Months",
    icon: "✦",
  },
];

const team = [
  {
    name: "Lead Instructor",
    role: "Full Stack Development",
    initials: "LI",
  },
  {
    name: "Senior Designer",
    role: "Graphics & UI/UX",
    initials: "SD",
  },
  {
    name: "ICT Instructor",
    role: "Computer & IT",
    initials: "II",
  },
];

const testimonials = [
  {
    quote:
      "The learning environment is excellent. The practical classes helped me understand web development much faster.",
    name: "Student Feedback",
    role: "MERN Web Development",
  },
  {
    quote:
      "The instructors are very supportive and explain difficult topics in a simple way. Highly recommended.",
    name: "Student Feedback",
    role: "Graphics Design",
  },
  {
    quote:
      "I started with very little computer knowledge and now I feel confident using essential IT applications.",
    name: "Student Feedback",
    role: "Basic Computer & IT",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-slate-950 text-white">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <HeroAnimation />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <HeroContentAnimation>
            <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
              {/* LEFT */}
              <div>
                <div className="hero-badge mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                  </span>
                  Learn. Build. Grow.
                </div>

                <h1 className="hero-title max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  Build Your
                  <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Digital Future.
                  </span>
                </h1>

                <p className="hero-description mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                  Learn practical technology skills from industry-focused
                  instructors and turn your ideas into real digital products.
                  Start your journey with Next Level School.
                </p>

                <div className="hero-buttons mt-9 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/courses"
                    className="group inline-flex items-center justify-center gap-3 rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-[0_15px_45px_rgba(34,211,238,0.25)]"
                  >
                    Explore Courses
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.08]"
                  >
                    Discover Our Story
                  </Link>
                </div>

                <div className="hero-stats mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-7">
                  <div>
                    <div className="text-2xl font-black sm:text-3xl">
                      500+
                    </div>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Students
                    </p>
                  </div>

                  <div>
                    <div className="text-2xl font-black sm:text-3xl">
                      10+
                    </div>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Expert Mentors
                    </p>
                  </div>

                  <div>
                    <div className="text-2xl font-black sm:text-3xl">
                      95%
                    </div>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Satisfaction
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="relative hidden lg:block">
                <div className="hero-card relative mx-auto aspect-square max-w-[500px]">
                  {/* Main card */}
                  <div className="absolute inset-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                          Learning Dashboard
                        </p>
                        <h3 className="mt-2 text-xl font-bold">
                          Your Journey
                        </h3>
                      </div>

                      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                        LIVE
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-8">
                      <div className="mb-3 flex justify-between text-sm">
                        <span className="text-slate-400">
                          Full Stack Development
                        </span>
                        <span className="font-bold text-cyan-300">
                          78%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                      </div>
                    </div>

                    {/* Modules */}
                    <div className="mt-8 space-y-3">
                      {[
                        ["HTML & CSS", "Completed"],
                        ["JavaScript", "Completed"],
                        ["React.js", "In Progress"],
                        ["Node.js", "Upcoming"],
                      ].map(([title, status], index) => (
                        <div
                          key={title}
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.035] p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                                index < 2
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-cyan-400/10 text-cyan-300"
                              }`}
                            >
                              {index < 2 ? "✓" : index + 1}
                            </span>

                            <span className="text-sm font-medium">
                              {title}
                            </span>
                          </div>

                          <span className="text-xs text-slate-500">
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Card 1 */}
                  <div className="float-card-1 absolute -left-2 top-20 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300">
                        ⚡
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Learning Mode
                        </p>
                        <p className="text-sm font-bold">Practical First</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 2 */}
                  <div className="float-card-2 absolute -bottom-2 -right-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-xl text-violet-300">
                        ✦
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Career Focus
                        </p>
                        <p className="text-sm font-bold">Future Ready</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HeroContentAnimation>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* =========================================================
          TRUST BAR
      ========================================================= */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            "Practical Learning",
            "Expert Mentors",
            "Modern Curriculum",
            "Career Focused",
          ].map((item) => (
            <div
              key={item}
              className="text-sm font-semibold text-slate-400"
            >
              <span className="mr-2 text-cyan-400">✦</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE US
      ========================================================= */}
      <ScrollAnimation>
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                Why Next Level
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Learn skills that
                <span className="block text-slate-500">
                  actually matter.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-slate-400">
                We focus on practical knowledge, real projects and
                problem-solving so students can confidently move from
                learning to doing.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 font-bold text-cyan-300 transition hover:text-cyan-200"
              >
                Learn more about us →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Project Based",
                  text: "Build real-world projects instead of only watching tutorials.",
                  icon: "↗",
                },
                {
                  title: "Mentor Support",
                  text: "Get guidance from instructors throughout your learning journey.",
                  icon: "◎",
                },
                {
                  title: "Modern Skills",
                  text: "Learn tools and technologies used in today's digital industry.",
                  icon: "✦",
                },
                {
                  title: "Career Focus",
                  text: "Develop practical skills that prepare you for real opportunities.",
                  icon: "⌁",
                },
              ].map((item, index) => (
                <ScrollAnimation
                  key={item.title}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.08}
                >
                  <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/20 hover:bg-white/[0.05]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300 transition group-hover:scale-110">
                      {item.icon}
                    </div>

                    <h3 className="mt-6 text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {item.text}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          COURSES
      ========================================================= */}
      <ScrollAnimation>
        <section className="border-y border-white/5 bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Our Courses
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                  Choose your
                  <span className="text-slate-500"> next skill.</span>
                </h2>
              </div>

              <Link
                href="/courses"
                className="text-sm font-bold text-cyan-300 hover:text-cyan-200"
              >
                View all courses →
              </Link>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {courses.map((course, index) => (
                <ScrollAnimation
                  key={course.title}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.08}
                >
                  <Link
                    href="/courses"
                    className="group block rounded-3xl border border-white/10 bg-slate-950/60 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/20 hover:shadow-[0_25px_80px_rgba(0,0,0,0.25)]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-2xl text-cyan-300">
                        {course.icon}
                      </div>

                      <span className="text-sm font-bold text-slate-700">
                        {course.number}
                      </span>
                    </div>

                    <h3 className="mt-8 text-2xl font-bold transition group-hover:text-cyan-300">
                      {course.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      {course.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">
                        {course.level}
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400">
                        {course.duration}
                      </span>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
                      <span className="text-sm font-semibold text-slate-400">
                        Explore course
                      </span>

                      <span className="transition-transform duration-300 group-hover:translate-x-2">
                        →
                      </span>
                    </div>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          STATS
      ========================================================= */}
      <ScrollAnimation direction="scale">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-violet-500/[0.08] p-8 sm:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />

            <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["500+", "Students"],
                ["20+", "Projects"],
                ["10+", "Mentors"],
                ["4", "Core Courses"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="border-l border-white/10 pl-6"
                >
                  <div className="text-4xl font-black text-white sm:text-5xl">
                    {number}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          TEAM
      ========================================================= */}
      <ScrollAnimation>
        <section className="border-y border-white/5 bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                Our Team
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Learn from people
                <span className="text-slate-500"> who build.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500">
                Our instructors are focused on making technology simple,
                practical and enjoyable for every learner.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {team.map((member, index) => (
                <ScrollAnimation
                  key={member.name}
                  direction="up"
                  delay={index * 0.12}
                >
                  <div className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-violet-500/10">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-900 text-3xl font-black text-cyan-300 shadow-2xl transition duration-500 group-hover:scale-110">
                        {member.initials}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold">
                        {member.name}
                      </h3>

                      <p className="mt-2 text-sm text-cyan-300">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/our-team"
                className="inline-flex rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
              >
                Meet the full team →
              </Link>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          LEARNING EXPERIENCE
      ========================================================= */}
      <ScrollAnimation>
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                The Experience
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                More than a classroom.
                <span className="block text-slate-500">
                  A place to grow.
                </span>
              </h2>

              <p className="mt-6 leading-8 text-slate-400">
                Learn through hands-on practice, guided projects,
                collaboration and continuous feedback.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Hands-on practical classes",
                  "Real project development",
                  "Personalized mentor guidance",
                  "Career-focused learning",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm text-cyan-300">
                      ✓
                    </span>

                    <span className="text-sm font-medium text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-cyan-400/10 blur-[100px]" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-600">
                      Learning Process
                    </span>

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>

                  <div className="mt-8 space-y-4">
                    {[
                      ["01", "Learn", "Understand the fundamentals"],
                      ["02", "Practice", "Apply what you learn"],
                      ["03", "Build", "Create real projects"],
                      ["04", "Grow", "Develop your career"],
                    ].map(([num, title, text]) => (
                      <div
                        key={num}
                        className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.025] p-4"
                      >
                        <span className="text-xs font-bold text-cyan-400">
                          {num}
                        </span>

                        <div>
                          <p className="font-bold">{title}</p>
                          <p className="mt-1 text-xs text-slate-600">
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <ScrollAnimation>
        <section className="border-y border-white/5 bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
                Student Voices
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                What learners
                <span className="text-slate-500"> say.</span>
              </h2>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {testimonials.map((item, index) => (
                <ScrollAnimation
                  key={item.quote}
                  direction="up"
                  delay={index * 0.1}
                >
                  <div className="h-full rounded-3xl border border-white/10 bg-slate-950/60 p-7">
                    <div className="text-3xl text-cyan-400">“</div>

                    <p className="mt-3 text-sm leading-8 text-slate-400">
                      {item.quote}
                    </p>

                    <div className="mt-8 border-t border-white/5 pt-5">
                      <p className="font-bold">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          FUTURE / AI SECTION
      ========================================================= */}
      <ScrollAnimation direction="scale">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/[0.09] via-blue-500/[0.04] to-violet-500/[0.09] p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-violet-500/10 blur-[120px]" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Future Ready
                </div>

                <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  Technology changes.
                  <span className="block text-slate-500">
                    Your skills should too.
                  </span>
                </h2>

                <p className="mt-6 max-w-2xl leading-8 text-slate-400">
                  Stay ahead with modern development, design and digital
                  skills that help you adapt to the rapidly changing
                  technology landscape.
                </p>

                <Link
                  href="/courses"
                  className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
                >
                  Start Learning
                </Link>
              </div>

              <div className="flex justify-center">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-cyan-400/20">
                  <div className="absolute inset-6 rounded-full border border-blue-400/20" />
                  <div className="absolute inset-12 rounded-full border border-violet-400/20" />

                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-400/10 text-5xl text-cyan-300 shadow-[0_0_80px_rgba(34,211,238,0.15)]">
                    ✦
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <ScrollAnimation direction="up">
        <section className="relative px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-16 text-center sm:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Your Next Level Starts Here
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Ready to build something
              <span className="text-slate-500"> meaningful?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-500">
              Choose a course, start learning and take your first step
              toward a stronger digital future.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-[0_15px_50px_rgba(34,211,238,0.2)]"
              >
                Explore Courses
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/10 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.04]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </ScrollAnimation>
    </main>
  );
}