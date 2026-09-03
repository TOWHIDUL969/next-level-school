// import Link from "next/link";

// const courses = [
//   {
//     number: "01",
//     title: "Web Development",
//     shortTitle: "Web Development",
//     description:
//       "Modern and responsive websites ও web applications তৈরি করার জন্য frontend থেকে full-stack development পর্যন্ত practical training।",
//     duration: "6 Months",
//     level: "Beginner to Advanced",
//     skills: [
//       "HTML & CSS",
//       "JavaScript",
//       "React.js",
//       "Next.js",
//       "Node.js",
//       "MongoDB",
//     ],
//     href: "/courses/web-development",
//   },
//   {
//     number: "02",
//     title: "UI/UX Design",
//     shortTitle: "UI/UX Design",
//     description:
//       "User-friendly এবং professional digital interface design করার জন্য UI/UX principles, wireframe, prototype ও design tools শেখানো হবে।",
//     duration: "3 Months",
//     level: "Beginner to Intermediate",
//     skills: [
//       "UI Design",
//       "UX Research",
//       "Wireframing",
//       "Prototyping",
//       "Figma",
//       "Design System",
//     ],
//     href: "/courses/ui-ux",
//   },
//   {
//     number: "03",
//     title: "Graphic Design",
//     shortTitle: "Graphic Design",
//     description:
//       "Professional graphics, social media design, branding এবং creative visual content তৈরির জন্য practical graphic design training।",
//     duration: "3 Months",
//     level: "Beginner to Advanced",
//     skills: [
//       "Adobe Photoshop",
//       "Adobe Illustrator",
//       "Logo Design",
//       "Social Media Design",
//       "Branding",
//       "Print Design",
//     ],
//     href: "/courses/graphic-design",
//   },
//   {
//     number: "04",
//     title: "Digital Marketing with Facebook Ads",
//     shortTitle: "Digital Marketing",
//     description:
//       "Digital platform ব্যবহার করে business ও brand-এর reach, engagement এবং sales বৃদ্ধি করার জন্য practical digital marketing training।",
//     duration: "3 Months",
//     level: "Beginner to Advanced",
//     skills: [
//       "Facebook Marketing",
//       "Facebook Ads",
//       "Content Strategy",
//       "Audience Targeting",
//       "Campaign Setup",
//       "Analytics",
//     ],
//     href: "/courses/digital-marketing",
//   },
//   {
//     number: "05",
//     title: "Video Editing",
//     shortTitle: "Video Editing",
//     description:
//       "YouTube, Facebook, Reels এবং professional video content তৈরির জন্য video editing, motion এবং storytelling-এর practical training।",
//     duration: "3 Months",
//     level: "Beginner to Advanced",
//     skills: [
//       "Video Editing",
//       "Adobe Premiere Pro",
//       "After Effects",
//       "Motion Graphics",
//       "Color Correction",
//       "YouTube Editing",
//     ],
//     href: "/courses/video-editing",
//   },
//   {
//   number: "06",
//   title: "AI Driven Basic Computer & IT Application Course",
//   shortTitle: "AI Driven Basic Computer",
//   description:
//     "AI-এর আধুনিক ব্যবহারসহ computer fundamentals, Microsoft Office, Internet, Email এবং essential IT applications শেখার জন্য একটি practical-based course।",
//   duration: "6 Months",
//   level: "Beginner to Advanced",
//   skills: [
//     "Computer Fundamentals",
//     "Microsoft Word",
//     "Microsoft Excel",
//     "PowerPoint",
//     "Internet & Email",
//     "AI Tools",
//   ],
//   href: "/courses/ai-driven-basic-computer",
// }
// ];

// export default function CoursesPage() {
//   return (
//     <div className="bg-white text-gray-900">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-black">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_35%)]" />

//         <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
//           <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-300">
//             Learn • Practice • Build • Grow
//           </span>

//           <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
//             Explore Our
//             <span className="block text-gray-400">Professional Courses</span>
//           </h1>

//           <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
//             আধুনিক প্রযুক্তি ও ডিজিটাল স্কিল শেখার জন্য আমাদের
//             industry-focused এবং practical-based professional courses
//             বেছে নিন।
//           </p>

//           <div className="mt-8 flex flex-wrap justify-center gap-4">
//             <Link
//               href="/register"
//               className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
//             >
//               Start Learning →
//             </Link>

//             <Link
//               href="/contact"
//               className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Course Intro */}
//       <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
//         <div className="mx-auto max-w-3xl text-center">
//           <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
//             Our Courses
//           </p>

//           <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
//             Build Skills That Matter
//           </h2>

//           <p className="mt-5 leading-8 text-gray-600">
//             Web development, design, marketing এবং creative media—
//             বর্তমান job market ও freelancing-এর জন্য প্রয়োজনীয়
//             practical skills এক জায়গায় শেখার সুযোগ।
//           </p>
//         </div>

//         {/* Course Grid */}
//         <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {courses.map((course) => (
//             <div
//               key={course.number}
//               className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
//             >
//               {/* Number */}
//               <div className="flex items-center justify-between">
//                 <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
//                   {course.number}
//                 </span>

//                 <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
//                   {course.level}
//                 </span>
//               </div>

//               {/* Title */}
//               <h3 className="mt-6 text-2xl font-bold">
//                 {course.title}
//               </h3>

//               {/* Description */}
//               <p className="mt-4 flex-1 leading-7 text-gray-600">
//                 {course.description}
//               </p>

//               {/* Duration */}
//               <div className="mt-6 border-t border-gray-100 pt-5">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-500">Duration</span>
//                   <span className="font-semibold">
//                     {course.duration}
//                   </span>
//                 </div>
//               </div>

//               {/* Skills */}
//               <div className="mt-5 flex flex-wrap gap-2">
//                 {course.skills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>

//               {/* Button */}
//               <Link
//                 href={course.href}
//                 className="mt-7 block rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
//               >
//                 View Course →
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Why Choose Our Courses */}
//       <section className="bg-gray-50 py-20">
//         <div className="mx-auto max-w-7xl px-6 lg:px-8">
//           <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
//             <div>
//               <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
//                 Why Choose Us
//               </p>

//               <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
//                 Learn More Than Just Theory
//               </h2>

//               <p className="mt-5 max-w-xl leading-8 text-gray-600">
//                 আমাদের courses এমনভাবে তৈরি করা হয়েছে যাতে একজন
//                 শিক্ষার্থী শুধু theory না শিখে বাস্তব project ও
//                 practical কাজের মাধ্যমে নিজের skill develop করতে পারে।
//               </p>

//               <Link
//                 href="/about"
//                 className="mt-7 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
//               >
//                 Learn About Us →
//               </Link>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-2">
//               {[
//                 {
//                   title: "Practical Learning",
//                   description:
//                     "Real-world projects ও hands-on practice-এর মাধ্যমে শেখানো হয়।",
//                 },
//                 {
//                   title: "Expert Guidance",
//                   description:
//                     "Instructor-এর guidance ও support-এর মাধ্যমে skill development।",
//                 },
//                 {
//                   title: "Career Focused",
//                   description:
//                     "Job, freelancing ও professional career-এর জন্য প্রয়োজনীয় skill।",
//                 },
//                 {
//                   title: "Project Based",
//                   description:
//                     "Portfolio তৈরির জন্য practical projects সম্পন্ন করার সুযোগ।",
//                 },
//               ].map((item) => (
//                 <div
//                   key={item.title}
//                   className="rounded-2xl border border-gray-200 bg-white p-6"
//                 >
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
//                     ✓
//                   </div>

//                   <h3 className="mt-5 font-bold">{item.title}</h3>

//                   <p className="mt-2 text-sm leading-6 text-gray-600">
//                     {item.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Learning Path */}
//       <section className="bg-black py-20 text-white">
//         <div className="mx-auto max-w-7xl px-6 lg:px-8">
//           <div className="mx-auto max-w-3xl text-center">
//             <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
//               Your Learning Journey
//             </p>

//             <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
//               Start. Learn. Practice. Grow.
//             </h2>

//             <p className="mt-5 leading-7 text-gray-400">
//               সঠিক course নির্বাচন করে step-by-step নিজের skill
//               develop করুন এবং professional career-এর জন্য প্রস্তুত
//               হন।
//             </p>
//           </div>

//           <div className="mt-12 grid gap-6 md:grid-cols-4">
//             {[
//               {
//                 number: "01",
//                 title: "Choose",
//                 description: "আপনার লক্ষ্য অনুযায়ী course নির্বাচন করুন।",
//               },
//               {
//                 number: "02",
//                 title: "Learn",
//                 description: "Structured lessons-এর মাধ্যমে নতুন skill শিখুন।",
//               },
//               {
//                 number: "03",
//                 title: "Practice",
//                 description: "Projects ও practical tasks-এর মাধ্যমে practice করুন।",
//               },
//               {
//                 number: "04",
//                 title: "Grow",
//                 description: "Portfolio তৈরি করে career-এর দিকে এগিয়ে যান।",
//               },
//             ].map((step) => (
//               <div
//                 key={step.number}
//                 className="rounded-2xl border border-white/10 bg-white/5 p-6"
//               >
//                 <span className="text-sm font-bold text-gray-500">
//                   {step.number}
//                 </span>

//                 <h3 className="mt-4 text-xl font-bold">{step.title}</h3>

//                 <p className="mt-3 text-sm leading-6 text-gray-400">
//                   {step.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="border-t bg-white">
//         <div className="mx-auto max-w-4xl px-6 py-20 text-center">
//           <h2 className="text-3xl font-bold sm:text-4xl">
//             Ready to Start Learning?
//           </h2>

//           <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
//             আপনার পছন্দের course নির্বাচন করুন এবং আজ থেকেই নতুন
//             skill শেখার যাত্রা শুরু করুন।
//           </p>

//           <div className="mt-8 flex flex-wrap justify-center gap-4">
//             <Link
//               href="/register"
//               className="rounded-lg bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800"
//             >
//               Register Now →
//             </Link>

//             <Link
//               href="/contact"
//               className="rounded-lg border border-gray-300 px-7 py-3 font-semibold transition hover:border-black"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
import Link from "next/link";

const courses = [
  {
    number: "01",
    title: "Web Development",
    shortTitle: "Web Development",
    description:
      "Modern এবং responsive websites ও web applications তৈরি করার জন্য frontend থেকে full-stack development পর্যন্ত practical training।",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "Development",
    featured: true,
    skills: [
      "HTML & CSS",
      "JavaScript",
      "React.js",
      "Next.js",
      "Node.js",
      "MongoDB",
    ],
    href: "/courses/web-development",
    icon: "</>",
  },
  {
    number: "02",
    title: "UI/UX Design",
    shortTitle: "UI/UX Design",
    description:
      "User-friendly এবং professional digital interface design করার জন্য UI/UX principles, wireframe, prototype ও design tools শেখানো হবে।",
    duration: "3 Months",
    level: "Beginner to Intermediate",
    category: "Design",
    featured: false,
    skills: [
      "UI Design",
      "UX Research",
      "Wireframing",
      "Prototyping",
      "Figma",
      "Design System",
    ],
    href: "/courses/ui-ux",
    icon: "✦",
  },
  {
    number: "03",
    title: "Graphic Design",
    shortTitle: "Graphic Design",
    description:
      "Professional graphics, social media design, branding এবং creative visual content তৈরির জন্য practical graphic design training।",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Creative",
    featured: false,
    skills: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Logo Design",
      "Social Media Design",
      "Branding",
      "Print Design",
    ],
    href: "/courses/graphic-design",
    icon: "◈",
  },
  {
    number: "04",
    title: "Digital Marketing with Facebook Ads",
    shortTitle: "Digital Marketing",
    description:
      "Digital platform ব্যবহার করে business ও brand-এর reach, engagement এবং sales বৃদ্ধি করার জন্য practical digital marketing training।",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Marketing",
    featured: false,
    skills: [
      "Facebook Marketing",
      "Facebook Ads",
      "Content Strategy",
      "Audience Targeting",
      "Campaign Setup",
      "Analytics",
    ],
    href: "/courses/digital-marketing",
    icon: "↗",
  },
  {
    number: "05",
    title: "Video Editing",
    shortTitle: "Video Editing",
    description:
      "YouTube, Facebook, Reels এবং professional video content তৈরির জন্য video editing, motion এবং storytelling-এর practical training।",
    duration: "3 Months",
    level: "Beginner to Advanced",
    category: "Creative",
    featured: false,
    skills: [
      "Video Editing",
      "Adobe Premiere Pro",
      "After Effects",
      "Motion Graphics",
      "Color Correction",
      "YouTube Editing",
    ],
    href: "/courses/video-editing",
    icon: "▶",
  },
  {
    number: "06",
    title: "AI Driven Basic Computer & IT Application Course",
    shortTitle: "AI Driven Basic Computer",
    description:
      "AI-এর আধুনিক ব্যবহারসহ computer fundamentals, Microsoft Office, Internet, Email এবং essential IT applications শেখার জন্য practical-based course।",
    duration: "6 Months",
    level: "Beginner to Advanced",
    category: "IT & AI",
    featured: false,
    skills: [
      "Computer Fundamentals",
      "Microsoft Word",
      "Microsoft Excel",
      "PowerPoint",
      "Internet & Email",
      "AI Tools",
    ],
    href: "/courses/ai-driven-basic-computer",
    icon: "AI",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "Choose",
    description:
      "আপনার career goal অনুযায়ী সঠিক course নির্বাচন করুন।",
  },
  {
    number: "02",
    title: "Learn",
    description:
      "Structured lessons ও instructor guidance-এর মাধ্যমে শিখুন।",
  },
  {
    number: "03",
    title: "Practice",
    description:
      "Real-world tasks ও projects-এর মাধ্যমে skill develop করুন।",
  },
  {
    number: "04",
    title: "Grow",
    description:
      "Portfolio তৈরি করে career-এর পরবর্তী ধাপে এগিয়ে যান।",
  },
];

const benefits = [
  {
    icon: "01",
    title: "Practical First",
    description:
      "Theory-এর পাশাপাশি hands-on practice এবং real-world projects-এর উপর গুরুত্ব।",
  },
  {
    icon: "02",
    title: "Career Focused",
    description:
      "বর্তমান digital job market ও freelancing-এর প্রয়োজনীয় skills-এর দিকে focus।",
  },
  {
    icon: "03",
    title: "Modern Tools",
    description:
      "Industry-relevant software, frameworks, platforms এবং AI tools-এর ব্যবহার।",
  },
  {
    icon: "04",
    title: "Project Based",
    description:
      "শেখার পাশাপাশি নিজের portfolio-এর জন্য practical projects তৈরি করার সুযোগ।",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-gray-950 text-white">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative isolate overflow-hidden">
        {/* Glow */}
        <div className="absolute -left-40 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="absolute -right-40 top-40 -z-10 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[140px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 lg:px-10 lg:pb-28 lg:pt-28">

          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Hero Content */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                Professional Courses
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Learn Skills.
                <br />

                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Build Your Future.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
                Modern technology, creative skills এবং digital career-এর
                জন্য practical ও career-focused professional courses।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
                >
                  Start Learning
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Talk to Us
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-7">
                <div>
                  <p className="text-2xl font-black">06</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Professional Courses
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black">100%</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Practical Focus
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black">∞</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Growth Mindset
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mx-auto w-full max-w-lg">

              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.05] p-3 shadow-2xl backdrop-blur-xl">

                <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-gray-900">

                  {/* Window Header */}
                  <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />

                    <div className="ml-3 flex-1 rounded-lg bg-white/5 px-4 py-2 text-xs text-gray-600">
                      nextlevelschool.dev/courses
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="p-6 sm:p-8">

                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-400">
                      Learning System
                    </p>

                    <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                      Upgrade Your
                      <br />
                      <span className="text-blue-400">Skillset.</span>
                    </h2>

                    <div className="mt-8 space-y-3">

                      {[
                        "Web Development",
                        "UI/UX Design",
                        "Graphic Design",
                        "Digital Marketing",
                        "Video Editing",
                        "AI & IT",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition hover:bg-white/[0.07]"
                        >
                          <span className="font-mono text-xs text-gray-600">
                            0{index + 1}
                          </span>

                          <span className="text-sm font-medium text-gray-300">
                            {item}
                          </span>

                          <span className="ml-auto text-xs text-blue-400">
                            →
                          </span>
                        </div>
                      ))}

                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-gray-900/95 px-5 py-4 shadow-2xl backdrop-blur-xl sm:block">
                <p className="text-xs text-gray-500">
                  Learning Mode
                </p>
                <p className="mt-1 font-bold text-green-400">
                  Practical + Project Based
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COURSE INTRO
      ====================================================== */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                Explore Courses
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Choose Your
                <span className="text-gray-500">
                  {" "}Learning Path
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-gray-500">
              Development, design, marketing, creative media এবং
              AI-powered IT skills—আপনার career goal অনুযায়ী course
              নির্বাচন করুন।
            </p>

          </div>
        </div>
      </section>

      {/* =====================================================
          COURSES
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {courses.map((course) => (
            <article
              key={course.number}
              className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition duration-500 hover:-translate-y-2 ${
                course.featured
                  ? "border-blue-500/40 bg-gradient-to-b from-blue-500/[0.10] to-white/[0.03] shadow-xl shadow-blue-950/20"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >

              {/* Featured */}
              {course.featured && (
                <div className="absolute right-5 top-5 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Featured
                </div>
              )}

              {/* Top */}
              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 font-mono text-sm font-bold text-blue-400 transition duration-300 group-hover:scale-110">
                  {course.icon}
                </div>

                <span className="font-mono text-xs text-gray-600">
                  {course.number}
                </span>

              </div>

              {/* Category */}
              <div className="mt-6">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-500">
                  {course.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-4 min-h-[58px] text-xl font-bold leading-7 text-white">
                {course.title}
              </h3>

              {/* Description */}
              <p className="mt-4 flex-1 text-sm leading-7 text-gray-500">
                {course.description}
              </p>

              {/* Meta */}
              <div className="mt-6 grid grid-cols-2 gap-3">

                <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Duration
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-300">
                    {course.duration}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Level
                  </p>

                  <p className="mt-1 line-clamp-1 text-sm font-semibold text-gray-300">
                    {course.level}
                  </p>
                </div>

              </div>

              {/* Skills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-gray-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Button */}
              <Link
                href={course.href}
                className="mt-7 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-600"
              >
                <span>View Course</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </article>
          ))}

        </div>
      </section>

      {/* =====================================================
          WHY NLS
      ====================================================== */}
      <section className="border-y border-white/5 bg-white/[0.015]">

        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
                Why Choose NLS
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                More Than
                <br />
                <span className="text-gray-500">
                  Just a Course
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-500">
                একটি course শেষ করাই আমাদের লক্ষ্য নয়। আমরা চাই
                শিক্ষার্থীরা শেখা skills বাস্তব কাজে ব্যবহার করতে
                পারুক।
              </p>

              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Learn More About Us
                <span>→</span>
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid gap-4 sm:grid-cols-2">

              {benefits.map((benefit) => (
                <div
                  key={benefit.icon}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gray-600">
                      {benefit.icon}
                    </span>

                    <span className="text-blue-400 opacity-50 transition group-hover:opacity-100">
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-6 font-bold">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LEARNING JOURNEY
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Learning Journey
          </p>

          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            From Learning
            <span className="text-gray-500">
              {" "}to Growth
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-500">
            সঠিক course নির্বাচন থেকে practical project এবং
            portfolio building পর্যন্ত একটি structured learning journey।
          </p>

        </div>

        <div className="relative mt-14 grid gap-5 md:grid-cols-4">

          {/* Connecting Line */}
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />

          {learningSteps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/10 bg-gray-950 p-6 text-center"
            >
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 font-mono text-sm font-bold text-blue-400">
                {step.number}
              </div>

              <h3 className="mt-6 text-lg font-bold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="relative overflow-hidden border-t border-white/5">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 via-gray-950 to-purple-950/40" />

        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">

          <div className="mx-auto inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-400">
            Your Next Level Starts Here
          </div>

          <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Ready to Build
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your Future?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            আপনার পছন্দের course নির্বাচন করুন এবং আজ থেকেই
            practical skill শেখার journey শুরু করুন।
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/register"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Register Now →
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:-translate-y-1 hover:bg-white/10"
            >
              Contact Us
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}