// import React from 'react'


// import Link from "next/link";

// export default function AboutPage() {
//   return (
//     <main className="min-h-screen bg-white">

//       {/* Hero Section */}
//       <section className="bg-black px-6 py-20 text-white lg:py-28">
//         <div className="mx-auto max-w-7xl">
//           <div className="max-w-3xl">

//             <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
//               About Next Level School
//             </span>

//             <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
//               Empowering Learners,
//               <span className="block text-gray-400">
//                 Building Futures
//               </span>
//             </h1>

//             <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
//               We are committed to helping students develop practical
//               technology skills and build a strong foundation for their
//               education, career, and future.
//             </p>

//           </div>
//         </div>
//       </section>


//       {/* About Us */}
//       <section className="px-6 py-20 lg:py-28">
//         <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

//           {/* Content */}
//           <div>
//             <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
//               Who We Are
//             </span>

//             <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               Learning That Creates Opportunities
//             </h2>

//             <p className="mt-6 leading-8 text-gray-600">
//               Next Level School is a technology-focused learning
//               institute dedicated to providing practical and
//               career-oriented education.
//             </p>

//             <p className="mt-4 leading-8 text-gray-600">
//               Our goal is to make technology education accessible,
//               practical, and easy to understand. We focus on hands-on
//               learning so that students can develop skills that can
//               be applied in real-world situations.
//             </p>

//             <div className="mt-8">
//               <Link
//                 href="/courses"
//                 className="inline-flex rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
//               >
//                 Explore Our Courses
//               </Link>
//             </div>
//           </div>


//           {/* Mission Card */}
//           <div className="rounded-3xl bg-gray-100 p-8 sm:p-10">

//             <div className="grid gap-6 sm:grid-cols-2">

//               <div className="rounded-2xl bg-white p-6 shadow-sm">
//                 <div className="text-3xl">🎯</div>

//                 <h3 className="mt-4 text-xl font-bold">
//                   Our Mission
//                 </h3>

//                 <p className="mt-3 text-sm leading-6 text-gray-600">
//                   To provide quality technology education and help
//                   learners become confident and skilled professionals.
//                 </p>
//               </div>


//               <div className="rounded-2xl bg-white p-6 shadow-sm">
//                 <div className="text-3xl">🚀</div>

//                 <h3 className="mt-4 text-xl font-bold">
//                   Our Vision
//                 </h3>

//                 <p className="mt-3 text-sm leading-6 text-gray-600">
//                   To build a community of skilled learners who are
//                   ready to take advantage of modern technology and
//                   career opportunities.
//                 </p>
//               </div>

//             </div>

//           </div>

//         </div>
//       </section>


//       {/* Statistics */}
//       <section className="border-y bg-gray-50 px-6 py-16">
//         <div className="mx-auto max-w-7xl">

//           <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">

//             <div>
//               <h3 className="text-4xl font-bold text-gray-900">
//                 500+
//               </h3>

//               <p className="mt-2 text-gray-600">
//                 Students
//               </p>
//             </div>


//             <div>
//               <h3 className="text-4xl font-bold text-gray-900">
//                 10+
//               </h3>

//               <p className="mt-2 text-gray-600">
//                 Professional Courses
//               </p>
//             </div>


//             <div>
//               <h3 className="text-4xl font-bold text-gray-900">
//                 20+
//               </h3>

//               <p className="mt-2 text-gray-600">
//                 Expert Trainers
//               </p>
//             </div>


//             <div>
//               <h3 className="text-4xl font-bold text-gray-900">
//                 95%
//               </h3>

//               <p className="mt-2 text-gray-600">
//                 Student Satisfaction
//               </p>
//             </div>

//           </div>

//         </div>
//       </section>


//       {/* What We Offer */}
//       <section className="px-6 py-20 lg:py-28">
//         <div className="mx-auto max-w-7xl">

//           <div className="mx-auto max-w-2xl text-center">
//             <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
//               What We Offer
//             </span>

//             <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
//               Skills for the Modern World
//             </h2>

//             <p className="mt-4 leading-7 text-gray-600">
//               Our training programs are designed to help learners
//               develop practical skills in technology and digital
//               creativity.
//             </p>
//           </div>


//           <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

//             {/* Web Development */}
//             <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
//                 💻
//               </div>

//               <h3 className="mt-5 text-xl font-bold">
//                 Web Development
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-gray-600">
//                 Learn modern web development technologies and build
//                 real-world applications.
//               </p>
//             </div>


//             {/* Computer */}
//             <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
//                 🖥️
//               </div>

//               <h3 className="mt-5 text-xl font-bold">
//                 Computer Skills
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-gray-600">
//                 Build strong computer and IT application skills for
//                 education and professional work.
//               </p>
//             </div>


//             {/* Graphics */}
//             <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
//                 🎨
//               </div>

//               <h3 className="mt-5 text-xl font-bold">
//                 Graphics Design
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-gray-600">
//                 Develop creative design skills and learn how to
//                 create professional digital content.
//               </p>
//             </div>


//             {/* UI/UX */}
//             <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
//                 ✨
//               </div>

//               <h3 className="mt-5 text-xl font-bold">
//                 UI/UX Design
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-gray-600">
//                 Learn how to design beautiful, user-friendly, and
//                 modern digital experiences.
//               </p>
//             </div>

//           </div>

//         </div>
//       </section>


//       {/* Why Choose Us */}
//       <section className="bg-gray-950 px-6 py-20 text-white lg:py-24">
//         <div className="mx-auto max-w-7xl">

//           <div className="max-w-2xl">
//             <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
//               Why Choose Us
//             </span>

//             <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
//               More Than Just a Classroom
//             </h2>

//             <p className="mt-5 leading-7 text-gray-400">
//               We believe effective learning happens when students
//               practice what they learn and receive proper guidance.
//             </p>
//           </div>


//           <div className="mt-12 grid gap-6 md:grid-cols-3">

//             <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
//               <div className="text-3xl">📚</div>

//               <h3 className="mt-5 text-xl font-bold">
//                 Practical Education
//               </h3>

//               <p className="mt-3 leading-7 text-gray-400">
//                 Our courses focus on practical knowledge, projects,
//                 and real-world applications.
//               </p>
//             </div>


//             <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
//               <div className="text-3xl">👨‍🏫</div>

//               <h3 className="mt-5 text-xl font-bold">
//                 Supportive Trainers
//               </h3>

//               <p className="mt-3 leading-7 text-gray-400">
//                 Learners receive guidance and support throughout
//                 their learning journey.
//               </p>
//             </div>


//             <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
//               <div className="text-3xl">🌎</div>

//               <h3 className="mt-5 text-xl font-bold">
//                 Career Focused
//               </h3>

//               <p className="mt-3 leading-7 text-gray-400">
//                 We help learners develop skills that can open doors
//                 to further education and career opportunities.
//               </p>
//             </div>

//           </div>

//         </div>
//       </section>


//       {/* Final CTA */}
//       <section className="px-6 py-20">
//         <div className="mx-auto max-w-4xl rounded-3xl bg-gray-100 px-6 py-14 text-center sm:px-12">

//           <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
//             Ready to Take the Next Level?
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
//             Start your learning journey today and build the skills
//             you need for tomorrow.
//           </p>

//           <div className="mt-8 flex flex-wrap justify-center gap-4">

//             <Link
//               href="/courses"
//               className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
//             >
//               View Courses
//             </Link>

//             <Link
//               href="/contact"
//               className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
//             >
//               Contact Us
//             </Link>

//           </div>

//         </div>
//       </section>

//     </main>
//   );
// }

import Link from "next/link";

const values = [
  {
    number: "01",
    title: "Practical Learning",
    description:
      "শুধু theory নয়—real-world project, hands-on practice এবং practical task-এর মাধ্যমে শেখানো হয়।",
    icon: "⌘",
  },
  {
    number: "02",
    title: "Career Focused",
    description:
      "বর্তমান job market ও freelancing industry-এর প্রয়োজন অনুযায়ী skill development-এর উপর গুরুত্ব দেওয়া হয়।",
    icon: "↗",
  },
  {
    number: "03",
    title: "Modern Technology",
    description:
      "Modern software, AI tools এবং latest technology ব্যবহার করে শিক্ষার্থীদের future-ready করা হয়।",
    icon: "✦",
  },
  {
    number: "04",
    title: "Student Support",
    description:
      "Learning journey-তে guidance, feedback এবং প্রয়োজনীয় support দিয়ে শিক্ষার্থীদের এগিয়ে যেতে সাহায্য করা হয়।",
    icon: "∞",
  },
];

const stats = [
  { value: "500+", label: "Students" },
  { value: "6+", label: "Professional Courses" },
  { value: "100%", label: "Practical Focus" },
  { value: "24/7", label: "Learning Mindset" },
];

const skills = [
  "Web Development",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Video Editing",
  "AI & IT Application",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative isolate overflow-hidden border-b border-white/5">
        {/* Background Glow */}
        <div className="absolute left-1/4 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="absolute bottom-0 right-0 -z-10 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[130px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
              About Next Level School
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Building Skills.
              <br />

              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Creating Futures.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              Next Level School IT Institute একটি modern, practical এবং
              career-focused learning platform যেখানে শিক্ষার্থীদের
              technology-based দক্ষতা অর্জনের জন্য প্রয়োজনীয় training
              এবং learning environment তৈরি করা হয়।
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/courses"
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
              >
                Explore Courses →
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-gray-700 bg-white/5 px-7 py-3.5 font-semibold transition hover:-translate-y-1 hover:border-gray-500 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="border-b border-white/5 bg-black/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/5 sm:grid-cols-4 sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-8 text-center sm:py-10"
            >
              <h3 className="text-3xl font-black sm:text-4xl">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          WHO WE ARE
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-blue-600/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl">
              <div className="rounded-2xl bg-gray-900 p-7 sm:p-9">

                {/* Fake Terminal */}
                <div className="mb-8 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="font-mono text-sm leading-8">
                  <p className="text-gray-500">
                    // next-level-school
                  </p>

                  <p className="mt-3">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-cyan-400">mission</span> ={" "}
                    <span className="text-green-400">
                      &quot;Empower Learners&quot;
                    </span>
                  </p>

                  <p>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-cyan-400">focus</span> = [
                  </p>

                  {skills.map((skill) => (
                    <p
                      key={skill}
                      className="pl-6 text-blue-300"
                    >
                      &quot;{skill}&quot;,
                    </p>
                  ))}

                  <p>];</p>

                  <p className="mt-3">
                    <span className="text-purple-400">return</span>{" "}
                    <span className="text-green-400">
                      future
                    </span>
                    ;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Who We Are
            </p>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Technology শেখার
              <br />
              <span className="text-gray-500">
                একটি নতুন approach
              </span>
            </h2>

            <div className="mt-6 space-y-5 text-gray-400 leading-7">
              <p>
                Next Level School-এর লক্ষ্য হলো শিক্ষার্থীদের এমন
                technology skills দেওয়া, যেগুলো তারা বাস্তব জীবনে
                ব্যবহার করতে পারে।
              </p>

              <p>
                আমরা traditional classroom learning-এর পাশাপাশি
                practical project, problem solving এবং modern tools-এর
                মাধ্যমে শেখার সুযোগ তৈরি করি।
              </p>

              <p>
                একজন beginner থেকে শুরু করে career-ready professional
                হওয়া পর্যন্ত একটি structured learning journey তৈরি
                করাই আমাদের অন্যতম লক্ষ্য।
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION / VISION
      ====================================================== */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/5 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">

          {/* Mission */}
          <div className="bg-gray-950 px-6 py-16 sm:px-10 lg:py-20">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-400">
              ◈
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Our Mission
            </p>

            <h2 className="text-3xl font-bold">
              Make Technology Skills Accessible
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-gray-400">
              আমাদের mission হলো practical এবং industry-relevant
              technology education-এর মাধ্যমে শিক্ষার্থীদের দক্ষ,
              confident এবং career-ready করে তোলা।
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gray-950 px-6 py-16 sm:px-10 lg:py-20">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-2xl text-purple-400">
              ✦
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
              Our Vision
            </p>

            <h2 className="text-3xl font-bold">
              Create Future-Ready Learners
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-gray-400">
              এমন একটি learning community তৈরি করা যেখানে শিক্ষার্থীরা
              technology-এর পরিবর্তনের সাথে নিজেকে continuously update
              করে ভবিষ্যতের সুযোগের জন্য প্রস্তুত হতে পারে।
            </p>
          </div>

        </div>
      </section>

      {/* =====================================================
          VALUES
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Why Next Level
          </p>

          <h2 className="text-3xl font-black sm:text-4xl">
            Learning That Goes
            <span className="text-gray-500"> Beyond the Classroom</span>
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            আমরা বিশ্বাস করি, শুধু certificate নয়—একজন শিক্ষার্থীর
            actual skill, confidence এবং problem-solving ability-ই
            তার সবচেয়ে বড় asset।
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">

          {values.map((value) => (
            <div
              key={value.number}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between">

                <span className="text-sm font-mono text-gray-600">
                  {value.number}
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-400 transition group-hover:scale-110">
                  {value.icon}
                </span>
              </div>

              <h3 className="mt-7 text-xl font-bold">
                {value.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                {value.description}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-gray-950 to-purple-950/30" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Start Your Journey
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Ready to Take Your
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Skills to the Next Level?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
            আজ থেকেই শেখা শুরু করুন এবং নিজের future-এর জন্য
            একটি strong technology skillset তৈরি করুন।
          </p>

          <div className="mt-8">
            <Link
              href="/courses"
              className="inline-flex items-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              View All Courses →
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}


