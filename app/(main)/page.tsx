import Link from "next/link";
import ScrollAnimation from "@/components/ScrollAnimation/page";
import HeroAnimation from "@/components/HeroAnimation/page";

const courses = [
  {
    number: "01",
    title: "Web Development",
    description:
      "Learn modern frontend and backend development with real-world projects.",
    icon: "⌘",
  },
  {
    number: "02",
    title: "UI/UX Design",
    description:
      "Design beautiful, user-friendly digital experiences from scratch.",
    icon: "✦",
  },
  {
    number: "03",
    title: "Graphic Design",
    description:
      "Master creative design tools and build professional visual content.",
    icon: "◈",
  },
  {
    number: "04",
    title: "Digital Marketing",
    description:
      "Learn Facebook Ads, social media marketing and modern marketing strategies.",
    icon: "↗",
  },
  {
    number: "05",
    title: "Video Editing",
    description:
      "Create engaging professional videos for social media and digital platforms.",
    icon: "▶",
  },
  {
    number: "06",
    title: "AI Driven Basic Computer",
    description:
      "Master essential computer skills with modern AI-powered tools.",
    icon: "✧",
  },
];

const features = [
  {
    icon: "01",
    title: "Practical Learning",
    description:
      "Learn by working on practical tasks, projects and real-world problems.",
  },
  {
    icon: "02",
    title: "Expert Mentors",
    description:
      "Get proper guidance from experienced and industry-focused instructors.",
  },
  {
    icon: "03",
    title: "Career Focused",
    description:
      "Build practical skills that prepare you for education, freelancing and careers.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-gray-900">


      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-gray-950 text-white">
        {/* Background Glow */}
        <div className="absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute -right-32 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

        {/* Grid Background */}
        <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8">
          {/* Hero Content */}
          <div className="scroll-item">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              Welcome to Next Level School
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Learn Today.
              <span className="block bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Build Tomorrow.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl">
              Build practical digital skills, master modern technologies and
              prepare yourself for a successful career in the digital world.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="group rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition duration-300 hover:-translate-y-1 hover:bg-gray-200"
              >
                Explore Courses
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Get Started
              </Link>
            </div>

            {/* Mini Trust */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div>
                <span className="font-bold text-white">6+</span> Professional
                Courses
              </div>

              <div className="h-5 w-px bg-white/20" />

              <div>
                <span className="font-bold text-white">100%</span> Practical
                Learning
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="scroll-item relative hidden min-h-[500px] items-center justify-center lg:flex">
            {/* Main Card */}
            <div className="relative z-10 w-[390px] rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-2xl bg-gray-900 p-6">
                {/* Fake Browser Header */}
                <div className="mb-8 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="space-y-4">
                  <div className="h-4 w-24 rounded bg-gray-700" />

                  <div className="h-10 w-full rounded-lg bg-gray-800" />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-24 rounded-xl bg-gray-800" />
                    <div className="h-24 rounded-xl bg-gray-800" />
                    <div className="h-24 rounded-xl bg-gray-800" />
                  </div>

                  <div className="h-32 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Your next level starts here
                  </span>

                  <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-black">
                    START
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Tech Cards */}
            <div className="absolute left-0 top-20 animate-bounce rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-2xl shadow-xl backdrop-blur-xl [animation-duration:4s]">
              {"</>"}
            </div>

            <div className="absolute right-0 top-10 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-2xl shadow-xl backdrop-blur-xl">
              AI
            </div>

            <div className="absolute bottom-16 left-8 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-xl shadow-xl backdrop-blur-xl">
              ✦ UI/UX
            </div>

            <div className="absolute bottom-0 right-12 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-xl shadow-xl backdrop-blur-xl">
              JS
            </div>
          </div>
        </div>
      </section>

      {/* GSAP */}
      <ScrollAnimation />


      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 px-6 py-10 sm:grid-cols-4 lg:px-8">
          {[
            ["500+", "Students"],
            ["6+", "Professional Courses"],
            ["10+", "Expert Mentors"],
            ["100%", "Practical Learning"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="scroll-item px-4 text-center sm:px-6"
            >
              <div className="text-3xl font-black tracking-tight sm:text-4xl">
                {number}
              </div>

              <div className="mt-2 text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}
      <section className="scroll-section bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Heading */}
            <div className="scroll-item">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                Why Next Level
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                More than just a classroom.
              </h2>

              <p className="mt-6 max-w-md leading-7 text-gray-600">
                We focus on practical skills, modern technologies and
                career-oriented learning so that students can confidently move
                to their next level.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.icon}
                  className="scroll-item group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                    {feature.icon}
                  </div>

                  <h3 className="text-lg font-bold">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COURSES
      ====================================================== */}
      <section className="scroll-section bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="scroll-item">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                Our Courses
              </p>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                Choose your next skill.
              </h2>

              <p className="mt-4 max-w-xl text-gray-500">
                Learn the skills that matter in today&apos;s digital world.
              </p>
            </div>

            <Link
              href="/courses"
              className="scroll-item font-semibold transition hover:translate-x-1"
            >
              View All Courses →
            </Link>
          </div>

          {/* Course Grid */}
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.number}
                href={`/courses/${course.title
                  .toLowerCase()
                  .replaceAll(" ", "-")
                  .replace("ui/ux", "ui-ux")
                  .replace("digital-marketing", "digital-marketing")}`}
                className="scroll-item group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:border-gray-300 hover:shadow-2xl"
              >
                {/* Number */}
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-gray-400">
                    {course.number}
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold transition duration-300 group-hover:bg-black group-hover:text-white">
                    {course.icon}
                  </span>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-bold">{course.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {course.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-sm font-semibold">View Course</span>

                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          LEARNING EXPERIENCE
      ====================================================== */}
      <section className="scroll-section bg-gray-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="scroll-item">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                The Next Level Experience
              </p>

              <h2 className="text-4xl font-black sm:text-5xl">
                Learn skills.
                <br />
                Build projects.
                <br />
                Create your future.
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-gray-400">
                From fundamentals to advanced technologies, our learning
                approach focuses on practical experience and real-world
                application.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:-translate-y-1 hover:bg-gray-200"
              >
                Discover More →
              </Link>
            </div>

            {/* Experience Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                ["01", "Learn", "Understand the fundamentals."],
                ["02", "Practice", "Apply what you learn."],
                ["03", "Build", "Create real projects."],
                ["04", "Grow", "Move toward your career."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="scroll-item rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:bg-white/10"
                >
                  <span className="text-sm text-gray-500">{number}</span>

                  <h3 className="mt-10 text-xl font-bold">{title}</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AI SECTION
      ====================================================== */}
      <section className="scroll-section relative overflow-hidden bg-gray-100 py-24">
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="scroll-item">
              <div className="mb-5 inline-flex rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold">
                ✦ AI Powered Learning
              </div>

              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                Learn computer skills
                <span className="block text-gray-500">
                  with the power of AI.
                </span>
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-gray-600">
                Our AI Driven Basic Computer & IT Application Course combines
                essential computer skills with modern AI tools and techniques.
              </p>

              <Link
                href="/courses/ai-driven-basic-computer"
                className="mt-8 inline-flex rounded-xl bg-black px-6 py-3.5 font-semibold text-white transition hover:-translate-y-1 hover:bg-gray-800"
              >
                Explore AI Course →
              </Link>
            </div>

            <div className="scroll-item relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <span className="font-bold">AI Learning System</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-4 py-7">
                  {[
                    "Computer Fundamentals",
                    "Microsoft Office",
                    "AI Tools",
                    "Internet & Email",
                    "Practical Projects",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
                        0{index + 1}
                      </span>

                      <span className="font-medium">{item}</span>

                      <span className="ml-auto text-green-500">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="scroll-section bg-black py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="scroll-item">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
              Your Next Level Starts Here
            </p>

            <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
              Ready to build
              <span className="block text-gray-500">your future?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Start learning today and take the next step toward your dream
              career.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-white px-8 py-4 font-bold text-black transition duration-300 hover:-translate-y-1 hover:bg-gray-200"
              >
                Create Your Account →
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white transition duration-300 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}