import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">

              <Image
                src="/logo.png"
                alt="Next Level School"
                width={50}
                height={50}
                className="h-12 w-12 object-contain"
              />

              <div>
                <h2 className="text-lg font-bold">
                  Next Level School
                </h2>

                <p className="text-xs text-gray-400">
                  IT Institute
                </p>
              </div>

            </Link>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              Learn modern technology and digital skills with
              practical-based professional training.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold hover:bg-white hover:text-black"
              >
                f
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold hover:bg-white hover:text-black"
              >
                ▶
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-bold hover:bg-white hover:text-black"
              >
                in
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">

              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/courses"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Courses
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Registration
                </Link>
              </li>

            </ul>
          </div>

          {/* Courses */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Courses
            </h3>

            <ul className="mt-6 space-y-4">

              <li>
                <Link
                  href="/courses/web-development"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Web Development
                </Link>
              </li>

              <li>
                <Link
                  href="/courses/ui-ux"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  UI/UX Design
                </Link>
              </li>

              <li>
                <Link
                  href="/courses/graphic-design"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Graphic Design
                </Link>
              </li>

              <li>
                <Link
                  href="/courses/digital-marketing"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Digital Marketing
                </Link>
              </li>

              <li>
                <Link
                  href="/courses/video-editing"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Video Editing
                </Link>
              </li>

              <li>
                <Link
                  href="/courses/ai-driven-basic-computer"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  AI Driven Basic Computer
                </Link>
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-widest">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm font-medium">
                  📍 Address
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Your Institute Address
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">
                  ☎ Phone
                </p>

                <a
                  href="tel:+8801XXXXXXXXX"
                  className="mt-1 block text-sm text-gray-400 hover:text-white"
                >
                  +880 1XXX-XXXXXX
                </a>
              </div>

              <div>
                <p className="text-sm font-medium">
                  ✉ Email
                </p>

                <a
                  href="mailto:info@nextlevelschool.com"
                  className="mt-1 block text-sm text-gray-400 hover:text-white"
                >
                  info@nextlevelschool.com
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Next Level School.
            All rights reserved.
          </p>

          <div className="flex justify-center gap-6 sm:justify-end">

            <Link
              href="/privacy-policy"
              className="text-sm text-gray-500 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-white"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}