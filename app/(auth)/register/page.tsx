"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function RegisterPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".register-brand", {
        y: -20,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".register-content",
          {
            x: -40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.35"
        )
        .from(
          ".register-card",
          {
            y: 40,
            opacity: 0,
            scale: 0.97,
            duration: 0.9,
          },
          "-=0.5"
        )
        .from(
          ".register-feature",
          {
            y: 20,
            opacity: 0,
            stagger: 0.12,
            duration: 0.5,
          },
          "-=0.45"
        );

      gsap.to(".register-grid", {
        backgroundPosition: "45px 45px",
        duration: 15,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".register-glow-1", {
        x: 80,
        y: 50,
        scale: 1.15,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".register-glow-2", {
        x: -70,
        y: -40,
        scale: 1.2,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // User টাইপ করার সময় পুরোনো error remove হবে
    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const getPasswordStrength = () => {
    const password = form.password;

    if (!password) {
      return {
        label: "",
        width: "0%",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        label: "Weak",
        width: "25%",
      };
    }

    if (score === 2) {
      return {
        label: "Medium",
        width: "50%",
      };
    }

    if (score === 3) {
      return {
        label: "Strong",
        width: "75%",
      };
    }

    return {
      label: "Very Strong",
      width: "100%",
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Terms validation
    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    // Required field validation
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    // Password validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess(
        "Account created successfully! You can now sign in."
      );

      // Form reset
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setAgreeTerms(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-zinc-950 text-white"
    >
      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="register-grid absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.08) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.08) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "45px 45px",
          }}
        />

        <div
          className="register-glow-1 absolute -left-32 top-20 h-[420px] w-[420px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.09), transparent 70%)",
          }}
        />

        <div
          className="register-glow-2 absolute -right-32 bottom-10 h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#09090b_85%)]" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="register-brand relative z-20 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full font-black tracking-tight shadow-[0_0_30px_rgba(255,255,255,0.05)] transition duration-300 group-hover:border-white/30 group-hover:bg-white/10">
            <Image
              src="/logo.png"
              alt="Next Level School Logo"
              width={40}
              height={40}
            />
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide">
              Next Level School
            </p>

            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              IT Institute
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>

          Back to Home
        </Link>
      </header>

      {/* ================= MAIN ================= */}
      <section className="relative z-10 flex min-h-[calc(100vh-92px)] items-center px-6 pb-12 pt-4 sm:px-10 lg:px-14">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          {/* ================= LEFT CONTENT ================= */}
          <div className="register-content hidden lg:block">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />

              Start Your Journey
            </div>

            <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-[-0.04em] xl:text-7xl">
              Build Skills.
              <br />

              <span className="text-zinc-500">
                Build Your Future.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-zinc-400">
              Create your student account and get access to practical
              courses, expert mentors, projects, resources and a
              career-focused learning environment.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-4">

              <div className="register-feature flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <svg
                    className="h-5 w-5 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Learn at Your Pace
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Flexible learning with structured resources.
                  </p>
                </div>
              </div>

              <div className="register-feature flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <svg
                    className="h-5 w-5 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                    />

                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Expert Mentorship
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Learn from experienced industry mentors.
                  </p>
                </div>
              </div>

              <div className="register-feature flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <svg
                    className="h-5 w-5 text-zinc-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Career Focused
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Build real-world skills and projects.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================= REGISTER CARD ================= */}
          <div className="register-card w-full max-w-xl justify-self-center lg:justify-self-end">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">

              {/* Card Glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-white/[0.04] blur-3xl" />

              <div className="relative">

                {/* Mobile Heading */}
                <div className="mb-7 lg:hidden">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    Student Registration
                  </div>

                  <h1 className="text-3xl font-black tracking-tight">
                    Create Account
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Join Next Level School and start learning.
                  </p>
                </div>

                {/* Desktop Card Header */}
                <div className="mb-7 hidden lg:block">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    Student Registration
                  </p>

                  <h2 className="text-3xl font-black tracking-tight">
                    Create Your Account
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    Enter your details to create your student account.
                  </p>
                </div>

                {/* ================= FORM ================= */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    >
                      {error}
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div
                      role="status"
                      className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                    >
                      {success}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-white/30 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/[0.03]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-white/30 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/[0.03]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-white/30 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/[0.03]"
                    />
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

                      {passwordStrength.label && (
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pr-12 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-white/30 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/[0.03]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 transition hover:text-white"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.9 5.1A10.8 10.8 0 0112 5c5 0 8.5 3.5 9.8 7a10.5 10.5 0 01-3.1 4.5M6.2 6.2A10.7 10.7 0 002.2 12C3.5 15.5 7 19 12 19c1.5 0 2.9-.3 4.1-.9"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.2 12C3.5 8.5 7 5 12 5s8.5 3.5 9.8 7c-1.3 3.5-4.8 7-9.8 7s-8.5-3.5-9.8-7z"
                            />

                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {form.password && (
                      <div className="mt-2">
                        <div className="h-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-white transition-all duration-500"
                            style={{
                              width:
                                passwordStrength.width,
                            }}
                          />
                        </div>

                        <p className="mt-1.5 text-[10px] text-zinc-600">
                          Use 8+ characters with uppercase,
                          numbers and symbols.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs font-medium text-zinc-400"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className={`h-12 w-full rounded-xl border bg-white/[0.035] px-4 pr-12 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:bg-white/[0.06] focus:ring-4 focus:ring-white/[0.03] ${
                          form.confirmPassword &&
                          form.password !==
                            form.confirmPassword
                            ? "border-red-500/30 focus:border-red-500/50"
                            : form.confirmPassword &&
                              form.password ===
                                form.confirmPassword
                            ? "border-white/20 focus:border-white/30"
                            : "border-white/10 focus:border-white/30"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 transition hover:text-white"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.9 5.1A10.8 10.8 0 0112 5c5 0 8.5 3.5 9.8 7a10.5 10.5 0 01-3.1 4.5M6.2 6.2A10.7 10.7 0 002.2 12C3.5 15.5 7 19 12 19c1.5 0 2.9-.3 4.1-.9"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.2 12C3.5 8.5 7 5 12 5s8.5 3.5 9.8 7c-1.3 3.5-4.8 7-9.8 7s-8.5-3.5-9.8-7z"
                            />

                            <circle
                              cx="12"
                              cy="12"
                              r="3"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    {form.confirmPassword &&
                      form.password !==
                        form.confirmPassword && (
                        <p className="mt-1.5 text-[10px] text-red-400">
                          Passwords do not match.
                        </p>
                      )}
                  </div>

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) =>
                        setAgreeTerms(e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-white/20 bg-white/[0.04] checked:border-white checked:bg-white"
                    />

                    <span className="text-xs leading-5 text-zinc-500">
                      I agree to the{" "}

                      <Link
                        href="/terms"
                        className="text-zinc-300 underline underline-offset-2 transition hover:text-white"
                      >
                        Terms & Conditions
                      </Link>{" "}

                      and{" "}

                      <Link
                        href="/privacy-policy"
                        className="text-zinc-300 underline underline-offset-2 transition hover:text-white"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={!agreeTerms || loading}
                    className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-black transition duration-300 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="relative z-10">
                      {loading
                        ? "Creating Account..."
                        : "Create Student Account"}
                    </span>

                    {!loading && (
                      <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    )}

                    {loading && (
                      <span className="relative z-10 h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    )}

                    <span className="absolute inset-0 -translate-x-full bg-zinc-200 transition-transform duration-500 group-hover:translate-x-0" />
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />

                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    Or continue with
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Google sign up will be available soon."
                    )
                  }
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.95h5.23a4.47 4.47 0 01-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.22z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0012 21.7z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.8A5.86 5.86 0 016.23 12c0-.63.11-1.24.31-1.8V7.7H3.3A9.75 9.75 0 002.25 12c0 1.57.38 3.05 1.05 4.3l3.24-2.5z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 6.17c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.27 14.63 2.3 12 2.3a9.74 9.74 0 00-8.7 5.4l3.24 2.5C7.31 7.89 9.46 6.17 12 6.17z"
                    />
                  </svg>

                  Continue with Google
                </button>

                {/* Login */}
                <p className="mt-6 text-center text-sm text-zinc-500">
                  Already have an account?{" "}

                  <Link
                    href="/login"
                    className="font-semibold text-white transition hover:text-zinc-300"
                  >
                    Sign in
                  </Link>
                </p>

                {/* Security */}
                <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="16"
                      height="11"
                      x="4"
                      y="10"
                      rx="2"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10V7a4 4 0 018 0v3"
                    />
                  </svg>

                  Secure Student Registration
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] text-zinc-700">
              © {new Date().getFullYear()} Next Level School IT
              Institute. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}