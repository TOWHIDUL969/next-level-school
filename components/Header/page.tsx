"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "teacher" | "admin";
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Header user fetch error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error);
      setLoggingOut(false);
    }
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "teacher"
        ? "/dashboard/teacher"
        : "/dashboard";

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 bg-slate-950 px-3 pt-3">
      <div className="mx-auto max-w-7xl">
        <div className="navbar min-h-16 rounded-2xl border border-slate-900 bg-slate-950 px-3 text-white shadow-lg backdrop-blur-md lg:px-5">

          {/* ================= Logo / Brand ================= */}
          <div className="navbar-start">

            {/* Mobile Menu Button */}
            <div className="dropdown bg-slate-950 lg:hidden">
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
                className="menu dropdown-content z-50 mt-3 w-64 rounded-2xl border border-base-300 bg-slate-950 p-3 text-white shadow-xl"
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

                {!loading && !user && (
                  <>
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
                  </>
                )}

                {!loading && user && (
                  <>
                    <li>
                      <Link href={dashboardLink}>
                        Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link href="/profile">
                        My Profile
                      </Link>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-red-400"
                      >
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </li>
                  </>
                )}
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

                  <ul className="z-50 mt-3 w-64 rounded-xl border border-base-300 bg-slate-950 p-2 text-white shadow-xl">

                    <li>
                      <Link
                        href="/courses"
                        className="font-semibold"
                      >
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

            {/* ================= Desktop Auth ================= */}
            {!loading && !user && (
              <>
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
              </>
            )}

            {/* ================= Logged In User ================= */}
            {!loading && user && (
              <div className="dropdown dropdown-end hidden sm:block">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1.5 transition hover:bg-white/[0.08]"
                >
                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                    {userInitial}
                  </div>

                  {/* User Name */}
                  <div className="hidden text-left md:block">
                    <p className="max-w-28 truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="text-[10px] capitalize text-white/50">
                      {user.role}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-4 w-4 opacity-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </div>

                {/* Profile Dropdown */}
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-50 mt-3 w-64 rounded-2xl border border-base-300 bg-slate-950 p-2 text-white shadow-2xl"
                >
                  {/* Profile Header */}
                  <div className="mb-2 rounded-xl bg-white/[0.04] p-3">
                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                        {userInitial}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-white/50">
                          {user.email}
                        </p>

                        <p className="mt-0.5 text-[10px] capitalize text-primary">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard */}
                  <li>
                    <Link href={dashboardLink}>
                      <span>📊</span>
                      Dashboard
                    </Link>
                  </li>

                  {/* Profile */}
                  <li>
                    <Link href="/profile">
                      <span>👤</span>
                      My Profile
                    </Link>
                  </li>

                  <div className="my-1 border-t border-white/10" />

                  {/* Logout */}
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <span>🚪</span>
                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* ================= Mobile User ================= */}
            <div className="dropdown dropdown-end sm:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                  {loading ? "..." : userInitial}
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu dropdown-content z-50 mt-3 w-56 rounded-2xl border border-base-300 bg-slate-950 p-2 text-white shadow-xl"
              >
                {loading ? (
                  <li>
                    <span>Loading...</span>
                  </li>
                ) : user ? (
                  <>
                    {/* User Info */}
                    <div className="mb-2 rounded-xl bg-white/[0.04] p-3">
                      <p className="truncate text-sm font-bold">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-white/50">
                        {user.email}
                      </p>

                      <p className="mt-1 text-[10px] capitalize text-primary">
                        {user.role}
                      </p>
                    </div>

                    <li>
                      <Link href={dashboardLink}>
                        📊 Dashboard
                      </Link>
                    </li>

                    <li>
                      <Link href="/profile">
                        👤 My Profile
                      </Link>
                    </li>

                    <div className="my-1 border-t border-white/10" />

                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-red-400"
                      >
                        🚪
                        {loggingOut
                          ? "Logging out..."
                          : "Logout"}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}