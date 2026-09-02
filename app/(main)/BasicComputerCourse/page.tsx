import Link from "next/link";

const technologies = [
  "Microsoft Word",
  "Microsoft Excel",
  "Microsoft PowerPoint",
  "Microsoft Access",
  "Internet & Email",
  "Google Workspace",
  "Windows",
  "Typing & Documentation",
  "Basic Computer Hardware",
];

const modules = [
  {
    number: "01",
    title: "Computer Fundamentals",
    description:
      "কম্পিউটারের মৌলিক ধারণা, Hardware, Software, Operating System এবং Computer ব্যবহার শেখানো হবে।",
  },
  {
    number: "02",
    title: "Windows & File Management",
    description:
      "Windows operating system, folder management, file copy, move, rename, delete এবং বিভিন্ন settings সম্পর্কে শেখানো হবে।",
  },
  {
    number: "03",
    title: "Microsoft Word",
    description:
      "Professional document তৈরি, formatting, table, image, page setup, CV, application ও অফিসিয়াল document তৈরি শেখানো হবে।",
  },
  {
    number: "04",
    title: "Microsoft Excel",
    description:
      "Excel spreadsheet, data entry, formatting, formula, function, sorting, filtering এবং basic calculation শেখানো হবে।",
  },
  {
    number: "05",
    title: "Microsoft PowerPoint",
    description:
      "Professional presentation তৈরি, slide design, image, animation, transition এবং presentation delivery শেখানো হবে।",
  },
  {
    number: "06",
    title: "Microsoft Access",
    description:
      "Professional Database management system তৈরি, Data entry, Form Design, Query,Report delivery শেখানো হবে।",
  },
  {
    number: "07",
    title: "Internet & Email",
    description:
      "Internet browsing, Google search, email account ব্যবহার, email পাঠানো, attachment এবং online communication শেখানো হবে।",
  },
  {
    number: "08",
    title: "Typing & Documentation",
    description:
      "বাংলা ও ইংরেজি typing, typing speed improvement এবং professional documentation সম্পর্কে practical training দেওয়া হবে।",
  },
  {
    number: "09",
    title: "Google Workspace",
    description:
      "Google Drive, Docs, Sheets, Forms এবং অন্যান্য প্রয়োজনীয় online productivity tools সম্পর্কে ধারণা দেওয়া হবে।",
  },
];

const learningPoints = [
  "কম্পিউটার ব্যবহারে আত্মবিশ্বাসী হওয়া",
  "Professional document তৈরি করতে পারা",
  "MS Word, Excel ,PowerPoint ও Access ব্যবহার করা",
  "বাংলা ও ইংরেজি Typing দক্ষতা বৃদ্ধি",
  "Internet ও Email ব্যবহার করা",
  "Online application ও digital services ব্যবহার করা",
  "Office-এর প্রয়োজনীয় computer কাজ সম্পন্ন করা",
  "দৈনন্দিন digital কাজ সহজে পরিচালনা করা",
];

export default function BasicComputerCoursePage() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-gray-200">
              Basic Computer & IT Application Course
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build Your
              <span className="block text-gray-400">
                Computer Skills
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              কম্পিউটারের একদম বেসিক থেকে শুরু করে Microsoft Office,
              Internet, Email, Typing এবং প্রয়োজনীয় IT Application-এর
              practical training।
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
              >
                Enroll Now →
              </Link>

              <Link
                href="/contact"
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course Summary */}
      <section className="border-b bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4 lg:px-8">
          <div>
            <p className="text-sm text-gray-500">Course Level</p>
            <p className="mt-1 font-bold">Beginner</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Course Type</p>
            <p className="mt-1 font-bold">Practical</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Learning Mode</p>
            <p className="mt-1 font-bold">Offline / Lab</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Certificate</p>
            <p className="mt-1 font-bold">Available</p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Course Overview
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Master the Essential Computer Skills
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              বর্তমান সময়ে শিক্ষা, চাকরি, ব্যবসা এবং দৈনন্দিন জীবনে
              কম্পিউটার দক্ষতা অত্যন্ত গুরুত্বপূর্ণ। এই কোর্সটি এমনভাবে
              তৈরি করা হয়েছে যাতে একজন beginner খুব সহজে কম্পিউটার
              ব্যবহার শেখার পাশাপাশি বাস্তব কাজের জন্য প্রয়োজনীয়
              দক্ষতা অর্জন করতে পারে।
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              এখানে শুধু theoretical knowledge নয়, বরং practical lab
              practice-এর মাধ্যমে বিভিন্ন computer application শেখানো
              হবে।
            </p>
          </div>

          <div className="rounded-3xl bg-black p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
              You Will Learn
            </p>

            <ul className="mt-6 space-y-4">
              {learningPoints.slice(0, 6).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                    ✓
                  </span>

                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Tools & Applications
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              What You Will Learn
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((technology) => (
              <div
                key={technology}
                className="rounded-xl border border-gray-200 bg-white p-5 font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  ✓
                </div>

                {technology}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Course Curriculum
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Course Modules
          </h2>

          <p className="mt-4 text-gray-600">
            Beginner level থেকে practical computer skill অর্জনের জন্য
            কোর্সটি কয়েকটি গুরুত্বপূর্ণ module-এ ভাগ করা হয়েছে।
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module.number}
              className="group rounded-2xl border border-gray-200 p-6 transition hover:border-black hover:shadow-lg"
            >
              <div className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                  {module.number}
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    {module.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {module.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Journey */}
      <section className="bg-black py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Learning Journey
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                From Beginner to Confident User
              </h2>

              <p className="mt-6 leading-8 text-gray-400">
                আমাদের practical-based training-এর মাধ্যমে আপনি
                ধাপে ধাপে computer-এর basic concepts থেকে real-life
                office এবং digital কাজের জন্য প্রয়োজনীয় দক্ষতা
                অর্জন করবেন।
              </p>
            </div>

            <div className="space-y-4">
              {learningPoints.map((point, index) => (
                <div
                  key={point}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                    {index + 1}
                  </span>

                  <span className="text-gray-300">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career / Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Career Benefits
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Where Can These Skills Help You?
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Basic computer skill অর্জনের পর বিভিন্ন educational,
              office এবং digital কাজের ক্ষেত্রে আপনি আরও confident
              হয়ে উঠতে পারবেন।
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Computer Operator",
              "Office Assistant",
              "Data Entry",
              "Administrative Work",
            ].map((career) => (
              <div
                key={career}
                className="rounded-xl bg-white p-5 font-semibold shadow-sm"
              >
                {career}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Start Your Computer Learning Journey?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
            আজ থেকেই আপনার computer skill উন্নত করার যাত্রা শুরু করুন।
            আমাদের practical-based Basic Computer & IT Application
            Course-এ ভর্তি হয়ে নিজের দক্ষতা তৈরি করুন।
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