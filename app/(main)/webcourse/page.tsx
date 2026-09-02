import React from "react";
import Link from "next/link";

const technologies = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React.js",
  "Tailwind CSS",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Git & GitHub",
];

const modules = [
  {
    number: "01",
    title: "HTML & CSS",
    description:
      "Learn the fundamentals of HTML5, CSS3, responsive design, layouts, forms, and modern styling techniques.",
  },
  {
    number: "02",
    title: "JavaScript",
    description:
      "Understand JavaScript fundamentals, ES6+, DOM manipulation, events, functions, arrays, objects, and asynchronous programming.",
  },
  {
    number: "03",
    title: "React.js",
    description:
      "Build modern interactive applications using React components, props, state, hooks, routing, and API integration.",
  },
  {
    number: "04",
    title: "Tailwind CSS",
    description:
      "Create beautiful responsive interfaces using utility-first CSS and modern UI development techniques.",
  },
  {
    number: "05",
    title: "Next.js",
    description:
      "Learn the Next.js App Router, layouts, pages, dynamic routes, server components, and modern full-stack development.",
  },
  {
    number: "06",
    title: "Node.js & Express",
    description:
      "Build powerful backend applications and REST APIs using Node.js and Express.js.",
  },
  {
    number: "07",
    title: "MongoDB",
    description:
      "Learn database fundamentals, CRUD operations, collections, queries, and connecting MongoDB with your application.",
  },
  {
    number: "08",
    title: "Full-Stack Project",
    description:
      "Build and deploy a complete real-world full-stack web application from frontend to backend.",
  },
];

export default function WebDevelopmentCoursePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black px-6 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Hero Content */}
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-200">
                Professional Web Development Course
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Become a
                <span className="block text-gray-400">
                  Full-Stack Web Developer
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
                Learn modern web development from the fundamentals to
                full-stack application development and build real-world
                projects with industry-relevant technologies.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  href="/register"
                  className="rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                >
                  Enroll Now
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl border border-white/20 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </Link>

              </div>
            </div>


            {/* Course Summary Card */}
            <div className="lg:justify-self-end">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl">
                  💻
                </div>

                <h2 className="text-2xl font-bold">
                  Web Development
                </h2>

                <p className="mt-3 text-gray-400">
                  From beginner fundamentals to professional
                  full-stack development.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-4">

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-gray-400">
                      Level
                    </p>
                    <p className="mt-1 font-semibold">
                      Beginner → Advanced
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-gray-400">
                      Format
                    </p>
                    <p className="mt-1 font-semibold">
                      Practical
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-gray-400">
                      Projects
                    </p>
                    <p className="mt-1 font-semibold">
                      Real-World
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-gray-400">
                      Certificate
                    </p>
                    <p className="mt-1 font-semibold">
                      Available
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Course Overview */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Course Overview
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything You Need to Start Your Web Development Career
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                This course is designed for learners who want to build
                a strong foundation in web development and gradually
                move toward professional full-stack development.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                You will learn through hands-on practice, coding
                exercises, assignments, and real-world projects.
              </p>
            </div>


            <div className="grid gap-5 sm:grid-cols-2">

              <div className="rounded-2xl border p-6">
                <div className="text-3xl">🎯</div>
                <h3 className="mt-4 text-xl font-bold">
                  Practical Learning
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Focus on coding and practical implementation.
                </p>
              </div>

              <div className="rounded-2xl border p-6">
                <div className="text-3xl">🧑‍💻</div>
                <h3 className="mt-4 text-xl font-bold">
                  Real Projects
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Build projects that demonstrate your skills.
                </p>
              </div>

              <div className="rounded-2xl border p-6">
                <div className="text-3xl">🚀</div>
                <h3 className="mt-4 text-xl font-bold">
                  Career Focused
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Learn technologies used in modern development.
                </p>
              </div>

              <div className="rounded-2xl border p-6">
                <div className="text-3xl">🏆</div>
                <h3 className="mt-4 text-xl font-bold">
                  Certificate
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Receive a certificate after successful completion.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* Technologies */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Technologies
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Technologies You Will Learn
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Learn a modern technology stack used to build
              professional web applications.
            </p>
          </div>


          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm"
              >
                {technology}
              </span>
            ))}
          </div>

        </div>
      </section>


      {/* Course Modules */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Curriculum
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Course Modules
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              A structured learning path designed to take you from
              beginner to full-stack developer.
            </p>
          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-2">

            {modules.map((module) => (
              <div
                key={module.number}
                className="group rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex gap-5">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                    {module.number}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {module.title}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-600">
                      {module.description}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* Learning Journey */}
      <section className="bg-gray-950 px-6 py-20 text-white lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Your Learning Journey
            </span>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From Zero to Full-Stack Developer
            </h2>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl">01</span>
              <h3 className="mt-5 text-xl font-bold">
                Learn
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Understand the fundamentals and core concepts.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl">02</span>
              <h3 className="mt-5 text-xl font-bold">
                Practice
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Practice coding through exercises and assignments.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl">03</span>
              <h3 className="mt-5 text-xl font-bold">
                Build
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Build real-world applications and portfolio projects.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl">04</span>
              <h3 className="mt-5 text-xl font-bold">
                Launch
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Deploy your projects and prepare for your career.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-100 px-6 py-14 text-center sm:px-12">

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Become a Web Developer?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Start learning modern web development and build the
            skills you need for your future.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href="/register"
              className="rounded-xl bg-black px-7 py-3.5 font-semibold text-white transition hover:bg-gray-800"
            >
              Enroll Now
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Ask a Question
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

