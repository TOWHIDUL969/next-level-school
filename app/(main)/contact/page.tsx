import React from 'react'


import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              Get in Touch
            </span>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Let&apos;s Start a
              <span className="block text-gray-400">
                Conversation
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Have questions about our courses, admission, or training
              programs? We&apos;re here to help you take the next step.
            </p>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Contact Information
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-gray-600">
              Feel free to contact us for course information, admission
              details, class schedules, or any other questions.
            </p>

            <div className="mt-10 space-y-6">

              {/* Location */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                  📍
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Our Location
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Bangladesh
                  </p>
                </div>
              </div>


              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                  📞
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Phone
                  </h3>

                  <p className="mt-1 text-gray-600">
                    +880 1XXXXXXXXX
                  </p>
                </div>
              </div>


              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                  ✉️
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Email
                  </h3>

                  <p className="mt-1 text-gray-600">
                    info@nextlevelschool.com
                  </p>
                </div>
              </div>


              {/* Opening Hours */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl text-white">
                  🕒
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Opening Hours
                  </h3>

                  <p className="mt-1 text-gray-600">
                    Saturday – Thursday
                  </p>

                  <p className="text-gray-600">
                    9:00 AM – 8:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>


          {/* Contact Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <h2 className="text-2xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <p className="mt-2 text-gray-500">
              Fill out the form and we&apos;ll get back to you soon.
            </p>

            <form className="mt-8 space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border text-gray-700 border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>


              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border text-gray-700 border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>


              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border text-gray-700 border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>


              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="What is this about?"
                  className="w-full rounded-xl border text-gray-700 border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>


              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border text-gray-700 border-gray-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>


              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-black px-6 py-3.5 font-semibold text-white transition hover:bg-gray-800"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 text-center text-white sm:px-12">

          <h2 className="text-3xl font-bold">
            Ready to Start Learning?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Explore our courses and choose the right learning path
            for your future.
          </p>

          <Link
            href="/courses"
            className="mt-7 inline-block rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Explore Courses
          </Link>

        </div>
      </section>

    </main>
  );
}

