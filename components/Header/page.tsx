import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 bg-slate-950">
      <div className="mx-auto max-w-7xl">

        <div className="navbar min-h-16 rounded-2xl border text-white border-slate-900 bg-slate-950 px-3 shadow-lg backdrop-blur-md lg:px-5">

          {/* ================= Logo / Brand ================= */}
          <div className="navbar-start">

            {/* Mobile Menu Button */}
            <div className="dropdown lg:hidden bg-slate-950">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="pink"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>

              {/* Mobile Menu */}
              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-64 rounded-2xl text-white border border-base-300 bg-slate-950 p-3 shadow-xl"
              >
                <li>
                  <Link href="/" className="font-medium">
                    Home
                  </Link>
                </li>

                <li>
                  <Link href="/about" className="font-medium">
                    About Us
                  </Link>
                </li>

                <li>
                  <details>
                    <summary className="font-medium">
                      Courses
                    </summary>

                    <ul>
                      <li>
                        <Link href="/courses">
                          All Courses
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/web-development">
                          Web Development
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/basic-computer">
                          Basic Computer
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/ui-ux">
                          UI/UX Design
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/graphic-design">
                          Graphic Design
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/digital-marketing">
                          Digital Marketing
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/video-editing">
                          Video Editing
                        </Link>
                      </li>

                      <li>
                        <Link href="/courses/ai-driven-basic-computer">
                          AI Driven Basic Computer
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>


                <li>
                  <Link href="/our-team" className="font-medium">
                    Our-Team
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="font-medium">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="font-medium">
                    Contact
                  </Link>
                </li>

                <div className="my-2 border-t border-base-300" />

                <li>
                  <Link href="/login">
                    Log In
                  </Link>
                </li>

                <li>
                  <Link
                    href="/register"
                    className="bg-primary font-semibold text-primary-content"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Logo */}
            <Link
              href="/"
              className="ml-1 flex items-center lg:hidden"
            >
              <Image
                src="/logo.png"
                alt="Next Level School"
                width={42}
                height={42}
                className="h-10 w-10 object-contain"
              />
            </Link>

            {/* Desktop Brand */}
            <Link
              href="/"
              className="hidden items-center gap-3 lg:flex"
            >
              <Image
                src="/logo.png"
                alt="Next Level School"
                width={42}
                height={42}
                className="h-10 w-10 object-contain"
              />

              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Next Level School
                </h1>

                <p className="text-xs text-base-content/60">
                  IT Institute
                </p>
              </div>
            </Link>
          </div>

          {/* ================= Desktop Navigation ================= */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal items-center gap-1 px-1">

              <li>
                <Link
                  href="/"
                  className="font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="font-medium transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>

              {/* Courses Dropdown */}
              <li>
                <details>
                  <summary className="font-medium">
                    Courses
                  </summary>

                  <ul className="z-50 mt-3 w-64 rounded-xl text-white border border-base-300 bg-slate-950 p-2 shadow-xl">

                    <li>
                      <Link href="/courses" className="font-semibold">
                        All Courses
                      </Link>
                    </li>

                    <div className="my-1 border-t border-base-200" />

                    <li>
                      <Link href="/courses/web-development">
                        Web Development
                      </Link>
                    </li>

                    <li>
                      <Link href="/courses/basic-computer">
                        Basic Computer
                      </Link>
                    </li>

                    <li>
                      <Link href="/courses/ui-ux">
                        UI/UX Design
                      </Link>
                    </li>

                    <li>
                      <Link href="/courses/graphic-design">
                        Graphic Design
                      </Link>
                    </li>

                    <li>
                      <Link href="/courses/digital-marketing">
                        Digital Marketing
                      </Link>
                    </li>

                    <li>
                      <Link href="/courses/video-editing">
                        Video Editing
                      </Link>
                    </li>

                    <li>
                      <Link href="/courses/ai-driven-basic-computer">
                        AI Driven Basic Computer
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              <li>
                <Link href="/our-team" className="font-medium">
                  Our-Team
                </Link>
              </li>
              <li>
                  <Link href="/blogs" className="font-medium">
                    Blogs
                  </Link>
                </li>

              <li>
                <Link
                  href="/contact"
                  className="font-medium transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= Right Side ================= */}
          <div className="navbar-end gap-2">

            {/* Search */}
            <div className="hidden xl:flex">
              <label className="input input-sm w-52 rounded-full border-base-300">
                <svg
                  className="h-4 w-4 opacity-60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>

                <input
                  type="search"
                  placeholder="Search..."
                />
              </label>
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="btn btn-ghost hidden rounded-full sm:flex"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              href="/register"
              className="btn btn-primary hidden rounded-full px-5 sm:flex"
            >
              Register
            </Link>

            {/* Mobile User */}
            <div className="dropdown dropdown-end sm:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                  A
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-44 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                <li>
                  <Link href="/login">
                    Log In
                  </Link>
                </li>

                <li>
                  <Link href="/register">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}