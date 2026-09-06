
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".login-brand", {
        opacity: 0,
        y: -20,
        duration: 0.6,
      })
        .from(
          ".login-content",
          {
            opacity: 0,
            y: 35,
            filter: "blur(10px)",
            duration: 0.9,
          },
          "-=0.25"
        )
        .from(
          ".login-card",
          {
            opacity: 0,
            y: 45,
            scale: 0.96,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".login-feature",
          {
            opacity: 0,
            x: -20,
            stagger: 0.12,
            duration: 0.5,
          },
          "-=0.4"
        );

      gsap.to(".login-glow-1", {
        x: 70,
        y: 40,
        scale: 1.12,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".login-glow-2", {
        x: -60,
        y: -30,
        scale: 1.1,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".login-grid", {
        backgroundPosition: "50px 50px",
        duration: 8,
        repeat: -1,
        ease: "none",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") || "");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      setSuccess("Login successful!");

      console.log("Logged in user:", data.user);

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-zinc-950 text-white"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Grid */}
        <div
          className="login-grid absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,1) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,1) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Blue Glow */}
        <div className="login-glow-1 absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-[130px]" />

        {/* Purple Glow */}
        <div className="login-glow-2 absolute -right-40 bottom-10 h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[140px]" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[100px]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="login-brand relative z-20 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-10 w-10 items-center justify-center transition group-hover:border-white/20">
              <span className="text-sm font-bold"> <Image src={'/logo.png'} alt="Logo" width={40} height={40}></Image></span>
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight">
                Next Level School
              </p>

              <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
                IT Institute
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* =====================================================
          LOGIN AREA
      ====================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-81px)] items-center py-12">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_480px] lg:px-8">
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="login-content hidden lg:block">
            <div className="max-w-xl">
              {/* Small label */}
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />

                <span className="text-xs font-medium text-zinc-400">
                  Student Portal
                </span>
              </div>

              <h1 className="text-6xl font-bold leading-[1.02] tracking-[-0.04em] xl:text-7xl">
                Welcome
                <br />

                <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
                  Back.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-zinc-500">
                Continue your learning journey, track your progress and
                access everything you need from your Next Level School
                account.
              </p>

              {/* Features */}
              <div className="mt-10 space-y-5">
                <div className="login-feature flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-blue-400">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Track Your Learning
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Keep track of your course progress.
                    </p>
                  </div>
                </div>

                <div className="login-feature flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-purple-400">
                    ◆
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Access Your Courses
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Learn whenever and wherever you want.
                    </p>
                  </div>
                </div>

                <div className="login-feature flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-cyan-400">
                    ↗
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Build Your Future
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Develop practical career-ready skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <div className="login-card">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
              {/* Card glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-[80px]" />

              <div className="relative">
                {/* Card header */}
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="text-zinc-300"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <path d="m10 17 5-5-5-5" />
                      <path d="M15 12H3" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Enter your account details to continue.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                      {success}
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Email Address
                    </label>

                    <div className="group relative">
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-zinc-300">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                          />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                        className="h-13 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25 focus:bg-black/50 focus:ring-4 focus:ring-white/[0.03]"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-medium text-zinc-400"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-xs text-zinc-600 transition hover:text-white"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="group relative">
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition group-focus-within:text-zinc-300">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <rect
                            x="4"
                            y="10"
                            width="16"
                            height="11"
                            rx="2"
                          />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                      </div>

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                        className="h-13 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/25 focus:bg-black/50 focus:ring-4 focus:ring-white/[0.03]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-white"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path d="M3 3l18 18" />
                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                            <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6-.4.8-1.3 2-2.7 3.2" />
                            <path d="M6.2 6.2C4.5 7.3 3.4 8.8 2.5 10c1 2 4.5 6 9.5 6 1.2 0 2.3-.2 3.3-.6" />
                          </svg>
                        ) : (
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                            <circle cx="12" cy="12" r="2.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember */}
                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) =>
                          setRemember(e.target.checked)
                        }
                        className="peer sr-only"
                      />

                      <span className="flex h-4 w-4 items-center justify-center rounded border border-white/15 bg-black/30 text-transparent transition peer-checked:border-white peer-checked:bg-white peer-checked:text-black">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </span>

                      <span className="text-xs text-zinc-500">
                        Remember me
                      </span>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/5" />

                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="text-base font-bold">G</span>

                  Continue with Google
                </button>

                {/* Register */}
                <p className="mt-7 text-center text-sm text-zinc-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-white transition hover:text-zinc-400"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-700">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>

              Secure Student Portal
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

