"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  ChevronRight,
  CircleDollarSign,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

const enrollmentData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 180 },
  { month: "Mar", students: 240 },
  { month: "Apr", students: 310 },
  { month: "May", students: 390 },
  { month: "Jun", students: 460 },
  { month: "Jul", students: 520 },
  { month: "Aug", students: 610 },
  { month: "Sep", students: 690 },
  { month: "Oct", students: 760 },
  { month: "Nov", students: 830 },
  { month: "Dec", students: 920 },
];

const revenueData = [
  { month: "Jan", revenue: 180000 },
  { month: "Feb", revenue: 240000 },
  { month: "Mar", revenue: 290000 },
  { month: "Apr", revenue: 360000 },
  { month: "May", revenue: 410000 },
  { month: "Jun", revenue: 480000 },
  { month: "Jul", revenue: 520000 },
  { month: "Aug", revenue: 590000 },
  { month: "Sep", revenue: 630000 },
  { month: "Oct", revenue: 690000 },
  { month: "Nov", revenue: 760000 },
  { month: "Dec", revenue: 840000 },
];

const courseData = [
  { name: "MERN", value: 42 },
  { name: "Graphics", value: 25 },
  { name: "UI/UX", value: 18 },
  { name: "Basic IT", value: 15 },
];

const coursePerformance = [
  {
    title: "MERN Web Development",
    students: 186,
    progress: 92,
    category: "Development",
  },
  {
    title: "Graphics Design",
    students: 142,
    progress: 84,
    category: "Design",
  },
  {
    title: "UI/UX Design",
    students: 118,
    progress: 78,
    category: "Design",
  },
  {
    title: "Basic Computer & IT",
    students: 224,
    progress: 96,
    category: "IT",
  },
];

const recentEnrollments = [
  {
    name: "Avijit Shaha Apurbo",
    course: "MERN Web Development",
    status: "Active",
    amount: "৳12,000",
    initials: "AS",
  },
  {
    name: "Mustahim Billah Nishan",
    course: "Graphics Design",
    status: "Pending",
    amount: "৳8,500",
    initials: "MN",
  },
  {
    name: "Salma Maliha",
    course: "UI/UX Design",
    status: "Active",
    amount: "৳9,000",
    initials: "SM",
  },
  {
    name: "Momtahina",
    course: "Basic Computer & IT",
    status: "Active",
    amount: "৳5,000",
    initials: "M",
  },
];

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/dashboard/admin/students",
    icon: Users,
  },
  {
    title: "Teachers",
    href: "/dashboard/admin/teachers",
    icon: UserRound,
  },
  {
    title: "Courses",
    href: "/dashboard/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Enrollments",
    href: "/dashboard/admin/enrollments",
    icon: GraduationCap,
  },
  {
    title: "Payments",
    href: "/dashboard/admin/payments",
    icon: WalletCards,
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

const chartTooltipStyle = {
  backgroundColor: "#09090b",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "14px",
  color: "#fff",
};

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className="stat-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                positive
                  ? "bg-cyan-400/10 text-cyan-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}

              {change}
            </span>

            <span className="text-xs text-zinc-600">vs last month</span>
          </div>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dashboard-item", {
        opacity: 0,
        y: 25,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".stat-card", {
        opacity: 0,
        y: 35,
        scale: 0.96,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".chart-card", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.35,
        ease: "power3.out",
      });

      gsap.to(".floating-glow", {
        x: 80,
        y: 40,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen overflow-hidden bg-[#050507] text-white"
    >
      {/* Background */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="floating-glow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[140px]" />

        <div className="floating-glow absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}

        <aside className="dashboard-item hidden w-72 shrink-0 border-r border-white/10 bg-black/20 p-5 backdrop-blur-2xl lg:block">
          <div className="sticky top-5">
            {/* Logo */}

            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400 shadow-lg shadow-purple-500/20">
                <Sparkles size={22} />
              </div>

              <div>
                <h1 className="font-bold tracking-tight">
                  Next Level
                </h1>

                <p className="text-xs text-zinc-500">
                  Admin Console
                </p>
              </div>
            </div>

            {/* Navigation */}

            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Management
            </p>

            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                      index === 0
                        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white shadow-lg shadow-purple-900/10"
                        : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        index === 0
                          ? "text-purple-400"
                          : "text-zinc-600 group-hover:text-cyan-400"
                      }
                    />

                    {item.title}

                    {index === 0 && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Card */}

            <div className="mt-10 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-cyan-500/10 p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <ShieldCheck size={20} />
              </div>

              <h3 className="text-sm font-semibold">
                Admin Security
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Your dashboard is protected with secure authentication.
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />
              </div>

              <p className="mt-2 text-[11px] text-cyan-400">
                Security status: Excellent
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}

        <main className="min-w-0 flex-1">
          {/* Header */}

          <header className="dashboard-item sticky top-0 z-30 border-b border-white/10 bg-[#050507]/70 px-5 py-4 backdrop-blur-2xl lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 lg:hidden">
                  <Menu size={19} />
                </button>

                <div>
                  <p className="hidden text-xs text-zinc-600 sm:block">
                    Admin Panel
                  </p>

                  <h2 className="text-lg font-semibold sm:text-xl">
                    Dashboard
                  </h2>
                </div>
              </div>

              <div className="hidden w-full max-w-sm md:block">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-2.5">
                  <Search size={17} className="text-zinc-600" />

                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                  />

                  <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-zinc-600">
                    ⌘ K
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="relative rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-zinc-400 transition hover:border-cyan-500/30 hover:text-cyan-400">
                  <Bell size={18} />

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                </button>

                <div className="hidden h-9 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold">
                      Admin
                    </p>

                    <p className="text-[11px] text-zinc-600">
                      Super Administrator
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-sm font-bold shadow-lg shadow-purple-900/20">
                    A
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}

          <div className="mx-auto max-w-[1700px] p-5 lg:p-8">
            {/* Welcome */}

            <section className="dashboard-item mb-7">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />

                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                      System Online
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Welcome back, Admin
                    <span className="ml-2">👋</span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                    Here&apos;s what&apos;s happening with Next Level
                    School today.
                  </p>
                </div>

                <Link
                  href="/dashboard/admin/courses/create"
                  className="group flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold shadow-xl shadow-purple-900/20 transition hover:scale-[1.02]"
                >
                  <Plus size={18} />

                  Add New Course

                  <ChevronRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </section>

            {/* Stats */}

            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Students"
                value="2,480"
                change="+18.4%"
                positive
                icon={Users}
                gradient="from-purple-600 to-fuchsia-500"
              />

              <StatCard
                title="Active Courses"
                value="24"
                change="+12.8%"
                positive
                icon={BookOpen}
                gradient="from-blue-600 to-indigo-500"
              />

              <StatCard
                title="Total Revenue"
                value="৳48.6L"
                change="+24.6%"
                positive
                icon={CircleDollarSign}
                gradient="from-cyan-500 to-blue-500"
              />

              <StatCard
                title="Completion Rate"
                value="86.4%"
                change="+8.2%"
                positive
                icon={Activity}
                gradient="from-violet-600 to-cyan-400"
              />
            </section>

            {/* Charts */}

            <section className="mb-7 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
              {/* Enrollment */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-purple-400">
                      Growth Analytics
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Student Enrollment
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      Monthly enrollment performance
                    </p>
                  </div>

                  <button className="rounded-xl border border-white/10 p-2 text-zinc-500 transition hover:text-white">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData}>
                      <defs>
                        <linearGradient
                          id="enrollmentGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#a855f7"
                            stopOpacity={0.4}
                          />

                          <stop
                            offset="50%"
                            stopColor="#3b82f6"
                            stopOpacity={0.15}
                          />

                          <stop
                            offset="100%"
                            stopColor="#22d3ee"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#52525b",
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#52525b",
                          fontSize: 11,
                        }}
                      />

                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        cursor={{
                          stroke: "rgba(168,85,247,0.3)",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="students"
                        stroke="#a855f7"
                        strokeWidth={3}
                        fill="url(#enrollmentGradient)"
                        activeDot={{
                          r: 6,
                          fill: "#22d3ee",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Course Distribution */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:p-6">
                <div className="mb-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                    Course Analytics
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Course Distribution
                  </h2>
                </div>

                <div className="relative h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={105}
                        paddingAngle={4}
                        stroke="none"
                      >
                        <Cell fill="#a855f7" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#22d3ee" />
                        <Cell fill="#6366f1" />
                      </Pie>

                      <Tooltip
                        contentStyle={chartTooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">
                      24
                    </span>

                    <span className="text-xs text-zinc-600">
                      Courses
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {courseData.map((course, index) => (
                    <div
                      key={course.name}
                      className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: [
                            "#a855f7",
                            "#3b82f6",
                            "#22d3ee",
                            "#6366f1",
                          ][index],
                        }}
                      />

                      <span className="text-xs text-zinc-500">
                        {course.name}
                      </span>

                      <span className="ml-auto text-xs font-semibold text-white">
                        {course.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Revenue */}

            <section className="mb-7">
              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:p-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
                      Financial Analytics
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Revenue Overview
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="text-xs text-zinc-500">
                      Revenue
                    </span>
                  </div>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#52525b",
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#52525b",
                          fontSize: 11,
                        }}
                        tickFormatter={(value) =>
                          `${value / 1000}k`
                        }
                      />

                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        formatter={(value) =>
                          `৳${Number(value).toLocaleString()}`
                        }
                      />

                      <Bar
                        dataKey="revenue"
                        radius={[8, 8, 2, 2]}
                        fill="#3b82f6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Course Performance + Recent */}

            <section className="grid gap-5 xl:grid-cols-2">
              {/* Performance */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-purple-400">
                      Performance
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Course Performance
                    </h2>
                  </div>

                  <Link
                    href="/dashboard/admin/courses"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-5">
                  {coursePerformance.map((course) => (
                    <div key={course.title}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {course.title}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {course.students} students •{" "}
                            {course.category}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-cyan-400">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transition-all"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Enrollment */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-400">
                      Live Activity
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Recent Enrollments
                    </h2>
                  </div>

                  <button className="text-xs font-semibold text-cyan-400">
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {recentEnrollments.map((student) => (
                    <div
                      key={student.name}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white/[0.025] p-3 transition hover:border-white/10 hover:bg-white/[0.05]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 text-xs font-bold text-purple-300">
                        {student.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {student.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-zinc-600">
                          {student.course}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {student.amount}
                        </p>

                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            student.status === "Active"
                              ? "bg-cyan-400/10 text-cyan-400"
                              : "bg-yellow-400/10 text-yellow-400"
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>

                      <ChevronRight
                        size={15}
                        className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Actions */}

            <section className="dashboard-item mt-7">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-600/[0.08] via-blue-600/[0.05] to-cyan-500/[0.08] p-5 backdrop-blur-xl lg:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-bold">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Manage your school quickly
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Link
                    href="/dashboard/admin/courses/create"
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-purple-500/30 hover:bg-purple-500/10"
                  >
                    <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                      <Plus size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Add Course
                      </p>

                      <p className="text-[11px] text-zinc-600">
                        Create new course
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/admin/students"
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-blue-500/10"
                  >
                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                      <Users size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Students
                      </p>

                      <p className="text-[11px] text-zinc-600">
                        Manage students
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/admin/enrollments"
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-cyan-500/10"
                  >
                    <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                      <GraduationCap size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Enrollments
                      </p>

                      <p className="text-[11px] text-zinc-600">
                        Review requests
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard/admin/analytics"
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10"
                  >
                    <div className="rounded-xl bg-fuchsia-500/10 p-2.5 text-fuchsia-400">
                      <TrendingUp size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Analytics
                      </p>

                      <p className="text-[11px] text-zinc-600">
                        View reports
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </section>

            {/* Footer */}

            <footer className="dashboard-item py-8 text-center text-xs text-zinc-700">
              © 2026 Next Level School • Admin Console
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}