import Link from "next/link";

const courses = [
  {
    number: "01",
    title: "Web Development",
    shortTitle: "Web Development",
    description:
      "Modern and responsive websites ও web applications তৈরি করার জন্য frontend থেকে full-stack development পর্যন্ত practical training।",
    duration: "6 Months",
    level: "Beginner to Advanced",
    skills: [
      "HTML & CSS",
      "JavaScript",
      "React.js",
      "Next.js",
      "Node.js",
      "MongoDB",
    ],
    href: "/courses/web-development",
  },
  {
    number: "02",
    title: "UI/UX Design",
    shortTitle: "UI/UX Design",
    description:
      "User-friendly এবং professional digital interface design করার জন্য UI/UX principles, wireframe, prototype ও design tools শেখানো হবে।",
    duration: "3 Months",
    level: "Beginner to Intermediate",
    skills: [
      "UI Design",
      "UX Research",
      "Wireframing",
      "Prototyping",
      "Figma",
      "Design System",
    ],
    href: "/courses/ui-ux",
  },
  {
    number: "03",
    title: "Graphic Design",
    shortTitle: "Graphic Design",
    description:
      "Professional graphics, social media design, branding এবং creative visual content তৈরির জন্য practical graphic design training।",
    duration: "3 Months",
    level: "Beginner to Advanced",
    skills: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Logo Design",
      "Social Media Design",
      "Branding",
      "Print Design",
    ],
    href: "/courses/graphic-design",
  },
  {
    number: "04",
    title: "Digital Marketing with Facebook Ads",
    shortTitle: "Digital Marketing",
    description:
      "Digital platform ব্যবহার করে business ও brand-এর reach, engagement এবং sales বৃদ্ধি করার জন্য practical digital marketing training।",
    duration: "3 Months",
    level: "Beginner to Advanced",
    skills: [
      "Facebook Marketing",
      "Facebook Ads",
      "Content Strategy",
      "Audience Targeting",
      "Campaign Setup",
      "Analytics",
    ],
    href: "/courses/digital-marketing",
  },
  {
    number: "05",
    title: "Video Editing",
    shortTitle: "Video Editing",
    description:
      "YouTube, Facebook, Reels এবং professional video content তৈরির জন্য video editing, motion এবং storytelling-এর practical training।",
    duration: "3 Months",
    level: "Beginner to Advanced",
    skills: [
      "Video Editing",
      "Adobe Premiere Pro",
      "After Effects",
      "Motion Graphics",
      "Color Correction",
      "YouTube Editing",
    ],
    href: "/courses/video-editing",
  },
  {
  number: "06",
  title: "AI Driven Basic Computer & IT Application Course",
  shortTitle: "AI Driven Basic Computer",
  description:
    "AI-এর আধুনিক ব্যবহারসহ computer fundamentals, Microsoft Office, Internet, Email এবং essential IT applications শেখার জন্য একটি practical-based course।",
  duration: "6 Months",
  level: "Beginner to Advanced",
  skills: [
    "Computer Fundamentals",
    "Microsoft Word",
    "Microsoft Excel",
    "PowerPoint",
    "Internet & Email",
    "AI Tools",
  ],
  href: "/courses/ai-driven-basic-computer",
}
];

export default function CoursesPage() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-300">
            Learn • Practice • Build • Grow
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Our
            <span className="block text-gray-400">Professional Courses</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            আধুনিক প্রযুক্তি ও ডিজিটাল স্কিল শেখার জন্য আমাদের
            industry-focused এবং practical-based professional courses
            বেছে নিন।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Start Learning →
            </Link>

            <Link
              href="/contact"
              className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Course Intro */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Our Courses
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Build Skills That Matter
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Web development, design, marketing এবং creative media—
            বর্তমান job market ও freelancing-এর জন্য প্রয়োজনীয়
            practical skills এক জায়গায় শেখার সুযোগ।
          </p>
        </div>

        {/* Course Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.number}
              className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              {/* Number */}
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                  {course.number}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {course.level}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-6 text-2xl font-bold">
                {course.title}
              </h3>

              {/* Description */}
              <p className="mt-4 flex-1 leading-7 text-gray-600">
                {course.description}
              </p>

              {/* Duration */}
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold">
                    {course.duration}
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-5 flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Button */}
              <Link
                href={course.href}
                className="mt-7 block rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
              >
                View Course →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Why Choose Us
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Learn More Than Just Theory
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-gray-600">
                আমাদের courses এমনভাবে তৈরি করা হয়েছে যাতে একজন
                শিক্ষার্থী শুধু theory না শিখে বাস্তব project ও
                practical কাজের মাধ্যমে নিজের skill develop করতে পারে।
              </p>

              <Link
                href="/about"
                className="mt-7 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Learn About Us →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Practical Learning",
                  description:
                    "Real-world projects ও hands-on practice-এর মাধ্যমে শেখানো হয়।",
                },
                {
                  title: "Expert Guidance",
                  description:
                    "Instructor-এর guidance ও support-এর মাধ্যমে skill development।",
                },
                {
                  title: "Career Focused",
                  description:
                    "Job, freelancing ও professional career-এর জন্য প্রয়োজনীয় skill।",
                },
                {
                  title: "Project Based",
                  description:
                    "Portfolio তৈরির জন্য practical projects সম্পন্ন করার সুযোগ।",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                    ✓
                  </div>

                  <h3 className="mt-5 font-bold">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="bg-black py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Your Learning Journey
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Start. Learn. Practice. Grow.
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              সঠিক course নির্বাচন করে step-by-step নিজের skill
              develop করুন এবং professional career-এর জন্য প্রস্তুত
              হন।
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Choose",
                description: "আপনার লক্ষ্য অনুযায়ী course নির্বাচন করুন।",
              },
              {
                number: "02",
                title: "Learn",
                description: "Structured lessons-এর মাধ্যমে নতুন skill শিখুন।",
              },
              {
                number: "03",
                title: "Practice",
                description: "Projects ও practical tasks-এর মাধ্যমে practice করুন।",
              },
              {
                number: "04",
                title: "Grow",
                description: "Portfolio তৈরি করে career-এর দিকে এগিয়ে যান।",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <span className="text-sm font-bold text-gray-500">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Start Learning?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            আপনার পছন্দের course নির্বাচন করুন এবং আজ থেকেই নতুন
            skill শেখার যাত্রা শুরু করুন।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Register Now →
            </Link>

            <Link
              href="/contact"
              className="rounded-lg border border-gray-300 px-7 py-3 font-semibold transition hover:border-black"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}