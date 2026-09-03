import Link from "next/link";

const contactInfo = [
  {
    icon: "📍",
    title: "Our Location",
    text: "5 No. Sarai Union, Lama, Chattogram, Bangladesh",
    link: "#location",
  },
  {
    icon: "📞",
    title: "Call Us",
    text: "+880 1XXX-XXXXXX",
    link: "tel:+8801XXXXXXXXX",
  },
  {
    icon: "✉️",
    title: "Email Us",
    text: "info@nextlevelschool.com",
    link: "mailto:info@nextlevelschool.com",
  },
  {
    icon: "🕐",
    title: "Working Hours",
    text: "Saturday – Thursday | 9:00 AM – 8:00 PM",
    link: "#hours",
  },
];

const faqs = [
  {
    question: "How can I enroll in a course?",
    answer:
      "You can contact us directly or visit our Courses page to select your preferred course and submit an admission request.",
  },
  {
    question: "Do you provide practical training?",
    answer:
      "Yes. Our courses are designed with practical projects, assignments and hands-on learning.",
  },
  {
    question: "Can I contact an instructor before admission?",
    answer:
      "Yes. Contact our support team and we will guide you to the appropriate instructor or course coordinator.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              We&apos;re here to help
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Let&apos;s Build Your
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Next Level
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl">
              Have a question about our courses, admission or training
              programs? Our team is ready to help you take the next step in
              your learning journey.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#contact-form"
                className="btn border-0 bg-cyan-500 px-6 text-slate-950 hover:bg-cyan-400"
              >
                Send a Message
              </a>

              <Link
                href="/courses"
                className="btn btn-outline border-white/20 px-6 text-white hover:border-white hover:bg-white hover:text-slate-950"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.06]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-2xl transition group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="font-bold text-white">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-cyan-400">
                  Learn more →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section id="contact-form" className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] lg:grid-cols-[0.85fr_1.15fr]">
            {/* LEFT INFO */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 sm:p-10 lg:p-14">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />

              <div className="relative">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Get In Touch
                </span>

                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  We&apos;d love to
                  <span className="block text-cyan-400">hear from you.</span>
                </h2>

                <p className="mt-5 leading-7 text-slate-400">
                  Whether you are interested in a course, need admission
                  support, or simply want to know more about Next Level School,
                  feel free to send us a message.
                </p>

                {/* Mini features */}
                <div className="mt-10 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Quick Response</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Our support team will get back to you as soon as
                        possible.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Expert Guidance</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Get proper guidance about courses and career paths.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-semibold">Student Support</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        We support our learners throughout their journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="p-8 sm:p-10 lg:p-14">
              <div className="mb-8">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Send us a message
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Fill out the form and we&apos;ll contact you shortly.
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="input h-12 w-full border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="input h-12 w-full border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      className="input h-12 w-full border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Subject
                    </label>

                    <select className="select h-12 w-full border-white/10 bg-slate-900 text-slate-300 focus:border-cyan-400 focus:outline-none">
                      <option value="">Select subject</option>
                      <option>Course Information</option>
                      <option>Admission</option>
                      <option>Training Support</option>
                      <option>Career Guidance</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Your Message
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    className="textarea w-full border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn h-12 w-full border-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-base font-bold text-slate-950 shadow-lg shadow-cyan-500/10 hover:from-cyan-300 hover:to-blue-400"
                >
                  Send Message
                  <span>→</span>
                </button>

                <p className="text-center text-xs text-slate-600">
                  Your information is safe with us. We never share your
                  personal information.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LOCATION ================= */}
      <section id="location" className="border-y border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Map Placeholder */}
            <div className="relative min-h-[400px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
                  backgroundSize: "35px 35px",
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-4xl shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                    📍
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    Next Level School
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    5 No. Sarai Union, Lama, Chattogram, Bangladesh
                  </p>

                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm mt-5 border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                Visit Us
              </span>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Come and meet us
                <span className="block text-cyan-400">
                  at Next Level School.
                </span>
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                Want to know more about our learning environment? Visit our
                institute and talk directly with our team.
              </p>

              <div id="hours" className="mt-8 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="mt-2 font-semibold">
                    5 No. Sarai Union, Lama, Chattogram, Bangladesh
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-slate-500">Office Hours</p>
                  <p className="mt-2 font-semibold">
                    Saturday – Thursday
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    9:00 AM – 8:00 PM
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-sm text-slate-500">Friday</p>
                  <p className="mt-2 font-semibold text-cyan-400">
                    Weekly Holiday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              FAQ
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Quick answers to some common questions from our students.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="collapse collapse-plus rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <input
                  type="radio"
                  name="contact-faq"
                  defaultChecked={index === 0}
                />

                <div className="collapse-title pr-12 text-base font-semibold sm:text-lg">
                  {faq.question}
                </div>

                <div className="collapse-content">
                  <p className="leading-7 text-slate-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24 lg:px-8 lg:pb-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 px-8 py-16 text-center sm:px-12">
          <div className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Start Today
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-5xl">
              Ready to take your skills
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                to the next level?
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-400">
              Explore our professional courses and start building the skills
              that can shape your future.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/courses"
                className="btn border-0 bg-cyan-400 px-7 text-slate-950 hover:bg-cyan-300"
              >
                Explore Courses
              </Link>

              <a
                href="#contact-form"
                className="btn btn-outline border-white/20 px-7 text-white hover:border-white hover:bg-white hover:text-slate-950"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}