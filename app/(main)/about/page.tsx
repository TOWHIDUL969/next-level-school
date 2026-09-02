import React from 'react'


import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-black px-6 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">

            <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
              About Next Level School
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Empowering Learners,
              <span className="block text-gray-400">
                Building Futures
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              We are committed to helping students develop practical
              technology skills and build a strong foundation for their
              education, career, and future.
            </p>

          </div>
        </div>
      </section>


      {/* About Us */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          {/* Content */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Who We Are
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Learning That Creates Opportunities
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Next Level School is a technology-focused learning
              institute dedicated to providing practical and
              career-oriented education.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Our goal is to make technology education accessible,
              practical, and easy to understand. We focus on hands-on
              learning so that students can develop skills that can
              be applied in real-world situations.
            </p>

            <div className="mt-8">
              <Link
                href="/courses"
                className="inline-flex rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Explore Our Courses
              </Link>
            </div>
          </div>


          {/* Mission Card */}
          <div className="rounded-3xl bg-gray-100 p-8 sm:p-10">

            <div className="grid gap-6 sm:grid-cols-2">

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl">🎯</div>

                <h3 className="mt-4 text-xl font-bold">
                  Our Mission
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  To provide quality technology education and help
                  learners become confident and skilled professionals.
                </p>
              </div>


              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl">🚀</div>

                <h3 className="mt-4 text-xl font-bold">
                  Our Vision
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  To build a community of skilled learners who are
                  ready to take advantage of modern technology and
                  career opportunities.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* Statistics */}
      <section className="border-y bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <h3 className="text-4xl font-bold text-gray-900">
                500+
              </h3>

              <p className="mt-2 text-gray-600">
                Students
              </p>
            </div>


            <div>
              <h3 className="text-4xl font-bold text-gray-900">
                10+
              </h3>

              <p className="mt-2 text-gray-600">
                Professional Courses
              </p>
            </div>


            <div>
              <h3 className="text-4xl font-bold text-gray-900">
                20+
              </h3>

              <p className="mt-2 text-gray-600">
                Expert Trainers
              </p>
            </div>


            <div>
              <h3 className="text-4xl font-bold text-gray-900">
                95%
              </h3>

              <p className="mt-2 text-gray-600">
                Student Satisfaction
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* What We Offer */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              What We Offer
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Skills for the Modern World
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Our training programs are designed to help learners
              develop practical skills in technology and digital
              creativity.
            </p>
          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Web Development */}
            <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                💻
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Web Development
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Learn modern web development technologies and build
                real-world applications.
              </p>
            </div>


            {/* Computer */}
            <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                🖥️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Computer Skills
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Build strong computer and IT application skills for
                education and professional work.
              </p>
            </div>


            {/* Graphics */}
            <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                🎨
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Graphics Design
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Develop creative design skills and learn how to
                create professional digital content.
              </p>
            </div>


            {/* UI/UX */}
            <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                ✨
              </div>

              <h3 className="mt-5 text-xl font-bold">
                UI/UX Design
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Learn how to design beautiful, user-friendly, and
                modern digital experiences.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Why Choose Us */}
      <section className="bg-gray-950 px-6 py-20 text-white lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Why Choose Us
            </span>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              More Than Just a Classroom
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              We believe effective learning happens when students
              practice what they learn and receive proper guidance.
            </p>
          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="text-3xl">📚</div>

              <h3 className="mt-5 text-xl font-bold">
                Practical Education
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Our courses focus on practical knowledge, projects,
                and real-world applications.
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="text-3xl">👨‍🏫</div>

              <h3 className="mt-5 text-xl font-bold">
                Supportive Trainers
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Learners receive guidance and support throughout
                their learning journey.
              </p>
            </div>


            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="text-3xl">🌎</div>

              <h3 className="mt-5 text-xl font-bold">
                Career Focused
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                We help learners develop skills that can open doors
                to further education and career opportunities.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gray-100 px-6 py-14 text-center sm:px-12">

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Take the Next Level?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Start your learning journey today and build the skills
            you need for tomorrow.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href="/courses"
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              View Courses
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Contact Us
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}


