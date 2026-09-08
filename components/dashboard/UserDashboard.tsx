"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
    Activity,
    ArrowRight,
    Bell,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    PlayCircle,
    Settings,
    Sparkles,
    UserRound,
    WalletCards,
    X,
} from "lucide-react";
import Image from "next/image";

interface DashboardUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface UserDashboardProps {
    user: DashboardUser;
}

/* ============================================================
   DEMO DATA
============================================================ */

const courses = [
    {
        id: 1,
        title: "MERN Stack Web Development",
        category: "Web Development",
        instructor: "Next Level School",
        progress: 72,
        lessons: "18 / 25 Lessons",
        color: "purple",
    },
    {
        id: 2,
        title: "Graphics Design & Outsourcing",
        category: "Design",
        instructor: "Next Level School",
        progress: 48,
        lessons: "12 / 25 Lessons",
        color: "blue",
    },
    {
        id: 3,
        title: "Basic Computer & IT Application",
        category: "Computer",
        instructor: "Next Level School",
        progress: 86,
        lessons: "21 / 24 Lessons",
        color: "cyan",
    },
];

const activities = [
    {
        title: "Completed HTML & CSS Module",
        time: "2 hours ago",
        icon: CheckCircle2,
    },
    {
        title: "Started React Components lesson",
        time: "Yesterday",
        icon: PlayCircle,
    },
    {
        title: "Submitted assignment",
        time: "2 days ago",
        icon: Activity,
    },
];

/* ============================================================
   MAIN DASHBOARD
============================================================ */

export default function UserDashboard({
    user,
}: UserDashboardProps) {
    const dashboardRef = useRef<HTMLDivElement>(null);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const initial =
        user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

    /* ============================================================
       LOGOUT
    ============================================================ */

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

            window.location.href = "/login";
        } catch (error) {
            console.error("Logout Error:", error);
            setLoggingOut(false);
        }
    };

    /* ============================================================
       GSAP ANIMATIONS
    ============================================================ */

    useEffect(() => {
        if (!dashboardRef.current) return;

        const ctx = gsap.context(() => {
            /* ---------------------------------------------
               HEADER
            --------------------------------------------- */

            gsap.fromTo(
                ".dashboard-header",
                {
                    y: -30,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                }
            );

            /* ---------------------------------------------
               WELCOME
            --------------------------------------------- */

            gsap.fromTo(
                ".welcome-card",
                {
                    y: 45,
                    opacity: 0,
                    scale: 0.98,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.9,
                    delay: 0.15,
                    ease: "power3.out",
                }
            );

            /* ---------------------------------------------
               STAT CARDS
            --------------------------------------------- */

            gsap.fromTo(
                ".stat-card",
                {
                    y: 45,
                    opacity: 0,
                    scale: 0.94,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    delay: 0.3,
                    stagger: 0.12,
                    ease: "back.out(1.4)",
                }
            );

            /* ---------------------------------------------
               DASHBOARD ITEMS
            --------------------------------------------- */

            gsap.fromTo(
                ".dashboard-item",
                {
                    y: 35,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.65,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );

            /* ---------------------------------------------
               COURSE CARDS
            --------------------------------------------- */

            gsap.fromTo(
                ".course-card",
                {
                    x: -25,
                    opacity: 0,
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: 0.75,
                    stagger: 0.12,
                    ease: "power3.out",
                }
            );

            /* ---------------------------------------------
               FLOATING BACKGROUND ORBS
            --------------------------------------------- */

            gsap.fromTo(
                ".floating-orb",
                {
                    scale: 0.7,
                    opacity: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: "power3.out",
                }
            );

            /* ---------------------------------------------
               CONTINUOUS ORB MOTION
            --------------------------------------------- */

            gsap.to(".orb-one", {
                x: 40,
                y: 25,
                duration: 7,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".orb-two", {
                x: -35,
                y: 35,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            gsap.to(".orb-three", {
                x: 30,
                y: -30,
                duration: 9,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            /* ---------------------------------------------
               LEARNING GOAL
            --------------------------------------------- */

            gsap.fromTo(
                ".learning-goal",
                {
                    scale: 0.92,
                    opacity: 0,
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    delay: 1,
                    ease: "power3.out",
                }
            );
        }, dashboardRef);

        return () => ctx.revert();
    }, []);

    /* ============================================================
       JSX
    ============================================================ */

    return (
        <div
            ref={dashboardRef}
            className="relative min-h-screen overflow-hidden bg-[#05050a] text-white"
        >
            {/* =====================================================
          BACKGROUND GRAPHICS
      ====================================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                {/* Purple Orb */}
                <div className="floating-orb orb-one absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

                {/* Blue Orb */}
                <div className="floating-orb orb-two absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[130px]" />

                {/* Cyan Orb */}
                <div className="floating-orb orb-three absolute bottom-[-180px] left-[35%] h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[130px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize: "45px 45px",
                    }}
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.08),transparent_35%)]" />
            </div>

            {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <aside className="relative z-10 h-full w-80 max-w-[85vw] border-r border-white/10 bg-[#09090f] p-5 shadow-2xl">
                        <div className="flex h-full flex-col">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 shadow-lg">
                                        <Sparkles size={21} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold">
                                            Next Level School
                                        </h2>

                                        <p className="text-xs text-zinc-500">
                                            Student Portal
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-xl border border-white/10 p-2 text-zinc-400"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <DashboardNavigation
                                onNavigate={() => setMobileMenuOpen(false)}
                            />

                            <div className="mt-auto border-t border-white/10 pt-5">
                                <div className="mb-4 flex items-center gap-3">
                                    <Avatar initial={initial} />

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {user.name}
                                        </p>

                                        <p className="truncate text-xs text-zinc-500">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                >
                                    <LogOut size={17} />

                                    {loggingOut
                                        ? "Logging out..."
                                        : "Logout"}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}

            {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

            <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 border-r border-white/10 bg-[#08080d]/90 backdrop-blur-2xl lg:block">
                <div className="flex h-full flex-col p-5">
                    {/* Brand */}

                    <div className="mb-10 flex items-center gap-3 px-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black shadow-lg shadow-purple-900/30">
                            {/* <Sparkles size={21} /> */}
                            <Image
                                src="/logo.png"
                                alt="Next Level School"
                                width={42}
                                height={42}
                                className="h-10 w-10 object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="font-bold tracking-tight">
                                Next Level School
                            </h1>

                            <p className="text-xs text-zinc-500">
                                Student Portal
                            </p>
                        </div>
                    </div>

                    <DashboardNavigation />

                    {/* Bottom User */}

                    <div className="mt-auto border-t border-white/10 pt-5">
                        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
                            <Avatar initial={initial} />

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {user.name}
                                </p>

                                <p className="truncate text-xs text-zinc-500">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LogOut size={17} />

                            {loggingOut
                                ? "Logging out..."
                                : "Logout"}
                        </button>
                    </div>
                </div>
            </aside>

            {/* =====================================================
          MAIN AREA
      ====================================================== */}

            <main className="relative z-10 lg:ml-72">
                {/* Header */}

                <header className="dashboard-header sticky top-0 z-30 border-b border-white/10 bg-[#05050a]/75 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu */}

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 lg:hidden"
                        >
                            <Menu size={19} />
                        </button>

                        <div className="hidden lg:block">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                                Student Dashboard
                            </p>

                            <p className="mt-1 text-sm text-zinc-300">
                                Manage your learning journey
                            </p>
                        </div>

                        {/* Right */}

                        <div className="ml-auto flex items-center gap-3">
                            <button
                                type="button"
                                className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2.5 transition hover:bg-white/[0.08]"
                            >
                                <Bell size={18} />

                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,.9)]" />
                            </button>

                            <Link
                                href="/profile"
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 transition hover:bg-white/[0.08]"
                            >
                                <Avatar initial={initial} />

                                <div className="hidden text-left sm:block">
                                    <p className="max-w-28 truncate text-sm font-semibold">
                                        {user.name}
                                    </p>

                                    <p className="text-[10px] capitalize text-zinc-500">
                                        {user.role}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* =====================================================
            CONTENT
        ====================================================== */}

                <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
                    {/* =================================================
              WELCOME
          ================================================== */}

                    <section className="welcome-card relative mb-7 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/[0.14] via-blue-600/[0.08] to-cyan-500/[0.12] p-6 shadow-2xl shadow-purple-950/20 lg:p-8">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                        <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

                        <div className="relative z-10">
                            <div className="mb-3 flex items-center gap-2 text-sm text-cyan-400">
                                {/* <Sparkles size={16} /> */}
                                <Image
                                    src="/logo.png"
                                    alt="Next Level School"
                                    width={42}
                                    height={42}
                                    className="h-10 w-10 object-contain"
                                />

                                <span>
                                    Welcome back
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Hello, {user.name} 👋
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                                Keep learning, complete your lessons and
                                take another step toward your goals today.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/dashboard/courses"
                                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-purple-900/20 transition hover:-translate-y-0.5"
                                >
                                    Browse Courses

                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                <Link
                                    href="/profile"
                                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* =================================================
              STATS
          ================================================== */}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            icon={BookOpen}
                            title="My Courses"
                            value="03"
                            description="Currently learning"
                            gradient="from-purple-600/20 to-purple-500/5"
                            iconClass="text-purple-400"
                        />

                        <StatCard
                            icon={Activity}
                            title="Learning Progress"
                            value="68%"
                            description="+12% this month"
                            gradient="from-blue-600/20 to-blue-500/5"
                            iconClass="text-blue-400"
                        />

                        <StatCard
                            icon={CheckCircle2}
                            title="Completed"
                            value="12"
                            description="Lessons completed"
                            gradient="from-cyan-600/20 to-cyan-500/5"
                            iconClass="text-cyan-400"
                        />

                        <StatCard
                            icon={GraduationCap}
                            title="Certificates"
                            value="02"
                            description="Earned certificates"
                            gradient="from-fuchsia-600/20 to-fuchsia-500/5"
                            iconClass="text-fuchsia-400"
                        />
                    </section>

                    {/* =================================================
              MAIN GRID
          ================================================== */}

                    <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_360px]">
                        {/* My Courses */}

                        <section className="dashboard-item">
                            <DashboardSectionHeader
                                title="My Courses"
                                description="Continue where you left off"
                                href="/dashboard/courses"
                                linkText="View all"
                            />

                            <div className="mt-4 space-y-4">
                                {courses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Right Column */}

                        <div className="space-y-7">
                            {/* Upcoming Class */}

                            <section className="dashboard-item rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold">
                                            Upcoming Class
                                        </h2>

                                        <p className="mt-1 text-xs text-zinc-600">
                                            Your next learning session
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                                        <CalendarDays size={18} />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.08] to-blue-500/[0.04] p-4">
                                    <p className="text-xs font-medium text-cyan-400">
                                        Tomorrow
                                    </p>

                                    <h3 className="mt-2 font-semibold">
                                        React & Next.js
                                    </h3>

                                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                                        <Clock3 size={14} />
                                        10:00 AM — 11:30 AM
                                    </div>

                                    <button
                                        type="button"
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500/10 py-2.5 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
                                    >
                                        Join Class
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </section>

                            {/* Quick Actions */}

                            <section className="dashboard-item rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                                <div className="mb-5">
                                    <h2 className="font-bold">
                                        Quick Actions
                                    </h2>

                                    <p className="mt-1 text-xs text-zinc-600">
                                        Useful shortcuts
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <QuickAction
                                        href="/dashboard/courses"
                                        icon={BookOpen}
                                        title="Browse Courses"
                                        color="purple"
                                    />

                                    <QuickAction
                                        href="/dashboard/assignments"
                                        icon={Activity}
                                        title="Assignments"
                                        color="blue"
                                    />

                                    <QuickAction
                                        href="/dashboard/payments"
                                        icon={WalletCards}
                                        title="Payments"
                                        color="cyan"
                                    />

                                    <QuickAction
                                        href="/profile"
                                        icon={UserRound}
                                        title="My Profile"
                                        color="fuchsia"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* =================================================
              BOTTOM GRID
          ================================================== */}

                    <div className="mt-7 grid gap-7 lg:grid-cols-2">
                        {/* Recent Activity */}

                        <section className="dashboard-item rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl lg:p-6">
                            <DashboardSectionHeader
                                title="Recent Activity"
                                description="Your latest learning activity"
                            />

                            <div className="mt-5 space-y-1">
                                {activities.map((activity, index) => {
                                    const Icon = activity.icon;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/[0.04]"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                                <Icon size={17} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {activity.title}
                                                </p>

                                                <p className="mt-1 text-xs text-zinc-600">
                                                    {activity.time}
                                                </p>
                                            </div>

                                            <ChevronRight
                                                size={16}
                                                className="text-zinc-700"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Learning Goal */}

                        <section className="learning-goal relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/[0.1] via-blue-600/[0.05] to-cyan-500/[0.08] p-5 backdrop-blur-xl lg:p-6">
                            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold">
                                            Monthly Learning Goal
                                        </h2>

                                        <p className="mt-1 text-xs text-zinc-600">
                                            Keep your learning streak alive
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                                        <GraduationCap size={18} />
                                    </div>
                                </div>

                                <div className="mt-7 flex items-center gap-6">
                                    {/* Circular Progress */}

                                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#8b5cf6_0deg,#3b82f6_220deg,#22d3ee_280deg,rgba(255,255,255,.06)_280deg)]">
                                        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-[#09090f]">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold">
                                                    78%
                                                </p>

                                                <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                                                    Goal
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Great progress!
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                                            You have completed 18 of your
                                            24 monthly learning targets.
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-cyan-400">
                                            <Sparkles size={13} />
                                            Keep going!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}

                    <div className="py-8 text-center text-xs text-zinc-700">
                        © {new Date().getFullYear()} Next Level School · Student Portal
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ============================================================
   NAVIGATION
============================================================ */

function DashboardNavigation({
    onNavigate,
}: {
    onNavigate?: () => void;
}) {
    const items = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Courses",
            href: "/dashboard/courses",
            icon: BookOpen,
        },
        {
            title: "Assignments",
            href: "/dashboard/assignments",
            icon: Activity,
        },
        {
            title: "Class Schedule",
            href: "/dashboard/schedule",
            icon: CalendarDays,
        },
        {
            title: "Payments",
            href: "/dashboard/payments",
            icon: WalletCards,
        },
        {
            title: "Certificates",
            href: "/dashboard/certificates",
            icon: GraduationCap,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: UserRound,
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ];

    return (
        <nav className="flex-1 space-y-1 overflow-y-auto">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        onClick={onNavigate}
                        className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${item.title === "Dashboard"
                            ? "border border-purple-500/10 bg-gradient-to-r from-purple-500/15 via-blue-500/10 to-cyan-500/10 text-white"
                            : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                            }`}
                    >
                        <Icon
                            size={18}
                            className={
                                item.title === "Dashboard"
                                    ? "text-cyan-400"
                                    : "text-zinc-600 transition group-hover:text-cyan-400"
                            }
                        />

                        <span>{item.title}</span>

                        <ChevronRight
                            size={15}
                            className="ml-auto text-zinc-700 transition group-hover:text-cyan-400"
                        />
                    </Link>
                );
            })}
        </nav>
    );
}

/* ============================================================
   AVATAR
============================================================ */

function Avatar({
    initial,
}: {
    initial: string;
}) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 text-sm font-bold shadow-lg shadow-purple-900/20">
            {initial}
        </div>
    );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
    icon: Icon,
    title,
    value,
    description,
    gradient,
    iconClass,
}: {
    icon: typeof BookOpen;
    title: string;
    value: string;
    description: string;
    gradient: string;
    iconClass: string;
}) {
    return (
        <div className="stat-card group relative min-h-[165px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-white opacity-100 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
            {/* Gradient */}

            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-70`}
            />

            {/* Glow */}

            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20" />

            {/* Content */}

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ${iconClass}`}
                    >
                        <Icon size={20} strokeWidth={2} />
                    </div>

                    <Sparkles
                        size={15}
                        className="text-zinc-700 transition duration-300 group-hover:text-cyan-400 group-hover:rotate-12"
                    />
                </div>

                <p className="mt-5 text-sm text-zinc-400">
                    {title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                    {value}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({
    course,
}: {
    course: (typeof courses)[number];
}) {
    const gradient =
        course.color === "purple"
            ? "from-purple-600/20 to-purple-500/5"
            : course.color === "blue"
                ? "from-blue-600/20 to-blue-500/5"
                : "from-cyan-600/20 to-cyan-500/5";

    const progressColor =
        course.color === "purple"
            ? "from-purple-600 to-fuchsia-500"
            : course.color === "blue"
                ? "from-blue-600 to-purple-500"
                : "from-cyan-500 to-blue-500";

    return (
        <div className="course-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 opacity-100 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/15">
            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`}
            />

            <div className="relative z-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Course Icon */}

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-cyan-500/20">
                        <BookOpen
                            size={25}
                            className="text-cyan-400"
                        />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-purple-500/10 bg-purple-500/10 px-2.5 py-1 text-[10px] font-medium text-purple-300">
                                {course.category}
                            </span>

                            <span className="text-[10px] text-zinc-600">
                                {course.instructor}
                            </span>
                        </div>

                        <h3 className="mt-2 text-base font-bold">
                            {course.title}
                        </h3>

                        <div className="mt-3 flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">
                                {course.lessons}
                            </span>

                            <span className="font-semibold text-cyan-400">
                                {course.progress}%
                            </span>
                        </div>

                        {/* Progress */}

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000`}
                                style={{
                                    width: `${course.progress}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Continue */}

                    <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold transition hover:border-cyan-500/20 hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                        Continue
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function DashboardSectionHeader({
    title,
    description,
    href,
    linkText,
}: {
    title: string;
    description: string;
    href?: string;
    linkText?: string;
}) {
    return (
        <div className="flex items-end justify-between">
            <div>
                <h2 className="text-lg font-bold">
                    {title}
                </h2>

                <p className="mt-1 text-xs text-zinc-600">
                    {description}
                </p>
            </div>

            {href && (
                <Link
                    href={href}
                    className="flex items-center gap-1 text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                >
                    {linkText}
                    <ArrowRight size={13} />
                </Link>
            )}
        </div>
    );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
    href,
    icon: Icon,
    title,
    color,
}: {
    href: string;
    icon: typeof BookOpen;
    title: string;
    color:
    | "purple"
    | "blue"
    | "cyan"
    | "fuchsia";
}) {
    const classes = {
        purple:
            "bg-purple-500/10 text-purple-400 hover:border-purple-500/20 hover:bg-purple-500/10",
        blue:
            "bg-blue-500/10 text-blue-400 hover:border-blue-500/20 hover:bg-blue-500/10",
        cyan:
            "bg-cyan-500/10 text-cyan-400 hover:border-cyan-500/20 hover:bg-cyan-500/10",
        fuchsia:
            "bg-fuchsia-500/10 text-fuchsia-400 hover:border-fuchsia-500/20 hover:bg-fuchsia-500/10",
    };

    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition hover:-translate-y-0.5"
        >
            <div
                className={`rounded-xl p-2.5 ${classes[color]}`}
            >
                <Icon size={17} />
            </div>

            <span className="text-sm font-medium">
                {title}
            </span>

            <ChevronRight
                size={15}
                className="ml-auto text-zinc-700 transition group-hover:text-cyan-400"
            />
        </Link>
    );
}