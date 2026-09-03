import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  {
    name: "Your Name",
    role: "Founder & Director",
    category: "Leadership",
    image: "/team/member-1.jpg",
    bio: "Leading Next Level School with a vision to create practical and career-focused technology education.",
    skills: ["Leadership", "Education", "Technology"],
  },
  {
    name: "Instructor Name",
    role: "Senior Web Development Instructor",
    category: "Instructors",
    image: "/team/member-2.jpg",
    bio: "Passionate about modern web technologies and helping students build real-world applications.",
    skills: ["MERN", "Next.js", "JavaScript"],
  },
  {
    name: "Instructor Name",
    role: "Graphic Design Instructor",
    category: "Instructors",
    image: "/team/member-3.jpg",
    bio: "Helping students transform creative ideas into professional visual designs.",
    skills: ["Photoshop", "Illustrator", "Branding"],
  },
  {
    name: "Instructor Name",
    role: "UI/UX Design Instructor",
    category: "Instructors",
    image: "/team/member-4.jpg",
    bio: "Focused on creating user-centered digital experiences and practical design skills.",
    skills: ["UI/UX", "Figma", "Prototyping"],
  },
  {
    name: "Instructor Name",
    role: "Digital Marketing Instructor",
    category: "Instructors",
    image: "/team/member-5.jpg",
    bio: "Teaching students how to build brands, reach audiences and grow businesses online.",
    skills: ["Facebook Ads", "Marketing", "SEO"],
  },
  {
    name: "Instructor Name",
    role: "Video Editing Instructor",
    category: "Instructors",
    image: "/team/member-6.jpg",
    bio: "Turning creative concepts into engaging and professional video content.",
    skills: ["Premiere Pro", "After Effects", "Editing"],
  },
];

const values = [
  {
    icon: "🎯",
    title: "Student First",
    text: "Every decision we make starts with one question — how can we help our students grow?",
  },
  {
    icon: "⚡",
    title: "Practical Learning",
    text: "We focus on real-world projects and practical skills instead of only theoretical knowledge.",
  },
  {
    icon: "🚀",
    title: "Future Focused",
    text: "Our team continuously adapts to modern technologies and changing industry demands.",
  },
  {
    icon: "🤝",
    title: "Teamwork",
    text: "We believe great results come from collaboration, communication and continuous support.",
  },
];

export default function OurTeamPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glows */}
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Hero Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                Meet the people behind NLS
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Meet Our
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Amazing Team
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
                Behind every successful student is a dedicated team. Meet the
                educators, mentors and professionals who are working to build
                the next generation of skilled professionals.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#team"
                  className="btn border-0 bg-cyan-400 px-7 text-slate-950 hover:bg-cyan-300"
                >
                  Meet the Team
                </a>

                <Link
                  href="/contact"
                  className="btn btn-outline border-white/20 px-7 text-white hover:border-white hover:bg-white hover:text-slate-950"
                >
                  Contact Us
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <div>
                  <p className="text-3xl font-black text-white">6+</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Expert Members
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-black text-white">100%</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Student Focus
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-black text-white">24/7</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Learning Support
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto h-[430px] w-[430px]">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/10" />
                <div className="absolute inset-8 rounded-full border border-blue-400/10" />
                <div className="absolute inset-16 rounded-full border border-purple-400/10" />

                {/* Glow */}
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[90px]" />

                {/* Center */}
                <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
                  <div className="text-center">
                    <div className="text-5xl">👥</div>
                    <p className="mt-3 text-sm font-bold text-cyan-400">
                      NLS TEAM
                    </p>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute left-0 top-20 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                      💻
                    </div>
                    <div>
                      <p className="text-sm font-bold">Developers</p>
                      <p className="text-xs text-slate-500">Tech Team</p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 top-44 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                      🎨
                    </div>
                    <div>
                      <p className="text-sm font-bold">Designers</p>
                      <p className="text-xs text-slate-500">Creative Team</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-14 left-16 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10">
                      🎓
                    </div>
                    <div>
                      <p className="text-sm font-bold">Mentors</p>
                      <p className="text-xs text-slate-500">Education Team</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section id="team" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section heading */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Our People
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              The Team Behind
              <span className="block text-cyan-400">
                Your Success
              </span>
            </h2>

            <p className="mt-5 text-slate-400">
              Our team combines education, technology, creativity and industry
              experience to create a better learning environment.
            </p>
          </div>

          {/* Team Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name + member.role}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.05]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                  {/* Category */}
                  <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                    {member.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>

                  <p className="mt-1 font-medium text-cyan-400">
                    {member.role}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-xs text-slate-600">
                      Next Level School
                    </span>

                    <div className="flex gap-2">
                      <button
                        aria-label={`Facebook profile of ${member.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
                      >
                        f
                      </button>

                      <button
                        aria-label={`LinkedIn profile of ${member.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-400"
                      >
                        in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="border-y border-white/10 bg-white/[0.02] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            {/* Text */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                What Drives Us
              </span>

              <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                More Than
                <span className="block text-cyan-400">
                  Just a Team
                </span>
              </h2>

              <p className="mt-6 leading-7 text-slate-400">
                We are a group of passionate educators and technology
                professionals who believe that the right skills can transform
                lives and create opportunities.
              </p>

              <Link
                href="/about"
                className="btn btn-outline mt-8 border-white/20 text-white hover:border-white hover:bg-white hover:text-slate-950"
              >
                Learn About Us →
              </Link>
            </div>

            {/* Values */}
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-cyan-400/20"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                    {value.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOIN TEAM ================= */}
      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 px-8 py-16 text-center sm:px-12">
          {/* Glow */}
          <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />

          <div className="relative">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Grow With Us
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Want to be part of
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                our journey?
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-400">
              We are always interested in connecting with talented educators,
              professionals and passionate people who want to make an impact.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="btn border-0 bg-cyan-400 px-7 text-slate-950 hover:bg-cyan-300"
              >
                Get In Touch
              </Link>

              <Link
                href="/courses"
                className="btn btn-outline border-white/20 px-7 text-white hover:border-white hover:bg-white hover:text-slate-950"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}