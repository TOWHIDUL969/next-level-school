"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";

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
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

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

/* =========================================================
   TYPES
========================================================= */

type Admin = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

type NavItem = {
  title: string;
  href: string;
  icon: ElementType;
};

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: ElementType;
  gradient: string;
};

/* =========================================================
   DATA
========================================================= */

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

const courseColors = [
  "#a855f7",
  "#3b82f6",
  "#22d3ee",
  "#6366f1",
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

const navItems: NavItem[] = [
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

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  gradient,
}: StatCardProps) {
  return (
    <div
      className="
        stat-card
        group
        relative
        min-w-0
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.045]
        p-5
        opacity-0
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-white/20
      "
    >
      {/* Glow */}
      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-32
          w-32
          rounded-full
          bg-gradient-to-br
          ${gradient}
          opacity-20
          blur-3xl
          transition-all
          duration-700
          group-hover:scale-150
          group-hover:opacity-40
        `}
      />

      <div className="relative flex min-w-0 items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-zinc-500">
            {title}
          </p>

          <h3
            className="
              mt-3
              whitespace-nowrap
              text-2xl
              font-bold
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            {value}
          </h3>

          <div className="mt-3 flex min-w-0 items-center gap-2">
            <span
              className={`
                inline-flex
                shrink-0
                items-center
                gap-1
                rounded-full
                px-2
                py-1
                text-xs
                font-semibold
                ${
                  positive
                    ? "bg-cyan-400/10 text-cyan-400"
                    : "bg-red-400/10 text-red-400"
                }
              `}
            >
              {positive ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}

              {change}
            </span>

            <span className="truncate text-[11px] text-zinc-600">
              vs last month
            </span>
          </div>
        </div>

        {/* Icon */}
        <div
          className={`
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            ${gradient}
            shadow-lg
            sm:h-12
            sm:w-12
          `}
        >
          <Icon
            size={21}
            className="text-white"
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const mobileSidebarRef = useRef<HTMLElement>(null);

  const pathname = usePathname();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* =======================================================
     FETCH ADMIN
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchAdmin = async () => {
      try {
        setLoadingAdmin(true);

        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch admin"
          );
        }

        if (mounted) {
          setAdmin(data.user);
        }
      } catch (error) {
        console.error("Admin fetch error:", error);

        if (mounted) {
          setAdmin(null);
        }
      } finally {
        if (mounted) {
          setLoadingAdmin(false);
        }
      }
    };

    fetchAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Logout API returned ${response.status} instead of JSON`
        );
      }

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Logout failed"
        );
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout Error:", error);
      setLoggingOut(false);
    }
  };

  /* =======================================================
     GSAP PAGE ANIMATION
  ======================================================= */

  useLayoutEffect(() => {
    if (!dashboardRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      /*
       * IMPORTANT:
       * Sidebar এবং Header intentionally এখানে নেই।
       * কারণ GSAP transform করলে fixed/sticky positioning
       * কিছু browser-এ unexpected behavior করতে পারে।
       */

      const dashboardItems =
        gsap.utils.toArray<HTMLElement>(
          ".dashboard-item"
        );

      const statCards =
        gsap.utils.toArray<HTMLElement>(
          ".stat-card"
        );

      const chartCards =
        gsap.utils.toArray<HTMLElement>(
          ".chart-card"
        );

      if (prefersReducedMotion) {
        gsap.set(
          [
            ...dashboardItems,
            ...statCards,
            ...chartCards,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
          }
        );

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          dashboardItems,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
          }
        )
        .fromTo(
          statCards,
          {
            opacity: 0,
            y: 35,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.3"
        )
        .fromTo(
          chartCards,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
          },
          "-=0.35"
        );

      /* Floating background glow */

      gsap.to(".floating-glow", {
        x: 80,
        y: 40,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, dashboardRef);

    return () => {
      ctx.revert();
    };
  }, []);

  /* =======================================================
     MOBILE SIDEBAR ANIMATION
  ======================================================= */

  useLayoutEffect(() => {
    if (!mobileSidebarRef.current) return;

    const sidebar = mobileSidebarRef.current;

    if (mobileMenuOpen) {
      gsap.fromTo(
        sidebar,
        {
          xPercent: -100,
        },
        {
          xPercent: 0,
          duration: 0.45,
          ease: "power3.out",
        }
      );
    }
  }, [mobileMenuOpen]);

  /* =======================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  /* =======================================================
     LOCK BODY SCROLL WHEN MOBILE MENU IS OPEN
  ======================================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  const isActive = (href: string) => {
    if (href === "/dashboard/admin") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  /* =======================================================
     ADMIN DISPLAY
  ======================================================= */

  const adminName = admin?.name || "Admin";

  const adminInitial =
    admin?.name?.charAt(0)?.toUpperCase() || "A";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={dashboardRef}
      className="
        h-screen
        overflow-hidden
        bg-[#050507]
        text-white
      "
    >
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="floating-glow absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-600/20 blur-[140px]" />

        <div className="floating-glow absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
            bg-[size:60px_60px]
            [mask-image:linear-gradient(to_bottom,black,transparent)]
          "
        />
      </div>

      {/* ===================================================
          MAIN LAYOUT
      =================================================== */}

      <div className="relative z-10 flex h-full min-h-0">
        {/* =================================================
            DESKTOP SIDEBAR
        ================================================= */}

        <aside
          className="
            fixed
            inset-y-0
            left-0
            z-40
            hidden
            w-72
            border-r
            border-white/10
            bg-[#08080b]/90
            backdrop-blur-2xl
            lg:flex
            lg:flex-col
          "
        >
          {/* Sidebar Header / Logo */}

          <div className="shrink-0 p-5 pb-0">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black shadow-lg shadow-purple-500/20">
                <Image
                  src="/logo.png"
                  alt="Next Level School"
                  width={42}
                  height={42}
                  priority
                  className="h-10 w-10 object-contain"
                />
              </div>

              <div>
                <h1 className="font-bold tracking-tight">
                  Next Level School
                </h1>

                <p className="text-xs text-zinc-500">
                  Admin Console
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Sidebar Content */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              px-5
              pb-6
              [scrollbar-width:thin]
              [scrollbar-color:rgba(255,255,255,0.12)_transparent]
            "
          >
            {/* Navigation Label */}

            <p
              className="
                mb-3
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Management
            </p>

            {/* Navigation */}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={`
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      transition-all
                      ${
                        active
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/10 text-white shadow-lg shadow-purple-900/10"
                          : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-purple-400"
                          : "text-zinc-600 group-hover:text-cyan-400"
                      }
                    />

                    <span>{item.title}</span>

                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Security Card */}

            <div
              className="
                mt-8
                overflow-hidden
                rounded-3xl
                border
                border-purple-500/20
                bg-gradient-to-br
                from-purple-600/10
                via-blue-600/5
                to-cyan-500/10
                p-5
              "
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <ShieldCheck size={20} />
              </div>

              <h3 className="text-sm font-semibold">
                Admin Security
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Your dashboard is protected with secure
                authentication.
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

        {/* =================================================
            MOBILE SIDEBAR
        ================================================= */}

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            {/* Overlay */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="
                absolute
                inset-0
                bg-black/70
                backdrop-blur-sm
              "
            />

            {/* Sidebar */}

            <aside
              ref={mobileSidebarRef}
              className="
                relative
                z-10
                flex
                h-full
                w-80
                max-w-[85vw]
                min-h-0
                flex-col
                border-r
                border-white/10
                bg-[#09090b]
                shadow-2xl
              "
            >
              {/* Mobile Sidebar Header */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-white/10
                  p-5
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black shadow-lg shadow-purple-500/20">
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
                      Admin Console
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  aria-label="Close navigation"
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-2
                    text-zinc-400
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Navigation Scroll Area */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                  p-5
                  [scrollbar-width:thin]
                  [scrollbar-color:rgba(255,255,255,0.12)_transparent]
                "
              >
                <p
                  className="
                    mb-3
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-zinc-600
                  "
                >
                  Management
                </p>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        aria-current={
                          active ? "page" : undefined
                        }
                        className={`
                          group
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          px-4
                          py-3
                          text-sm
                          transition
                          ${
                            active
                              ? "bg-white/[0.07] text-white"
                              : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                          }
                        `}
                      >
                        <Icon
                          size={18}
                          className={
                            active
                              ? "text-purple-400"
                              : "text-zinc-600 group-hover:text-cyan-400"
                          }
                        />

                        <span>{item.title}</span>

                        <ChevronRight
                          size={15}
                          className={`
                            ml-auto
                            transition
                            ${
                              active
                                ? "text-cyan-400"
                                : "text-zinc-700 group-hover:text-cyan-400"
                            }
                          `}
                        />
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Security Card */}

                <div
                  className="
                    mt-8
                    rounded-3xl
                    border
                    border-purple-500/20
                    bg-gradient-to-br
                    from-purple-600/10
                    via-blue-600/5
                    to-cyan-500/10
                    p-5
                  "
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <ShieldCheck size={20} />
                  </div>

                  <h3 className="text-sm font-semibold">
                    Admin Security
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Your dashboard is protected with secure
                    authentication.
                  </p>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />
                  </div>

                  <p className="mt-2 text-[11px] text-cyan-400">
                    Security status: Excellent
                  </p>
                </div>
              </div>

              {/* Mobile Admin Info */}

              <div
                className="
                  shrink-0
                  border-t
                  border-white/10
                  p-5
                "
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-purple-600
                      to-blue-600
                      font-bold
                      uppercase
                    "
                  >
                    {adminInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {adminName}
                    </p>

                    <p className="truncate text-xs text-zinc-600">
                      {admin?.email || ""}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-red-500/10
                    bg-red-500/[0.04]
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-red-400
                    transition
                    hover:bg-red-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <LogOut size={17} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* =================================================
            MAIN
        ================================================= */}

        <main
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-y-auto
            overscroll-contain
            lg:ml-72
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              sticky
              top-0
              z-30
              border-b
              border-white/10
              bg-[#050507]/85
              px-5
              py-4
              backdrop-blur-2xl
              lg:px-8
            "
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left */}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(true)
                  }
                  aria-label="Open navigation"
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-2.5
                    transition
                    hover:bg-white/10
                    lg:hidden
                  "
                >
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

              {/* Search */}

              <div className="hidden w-full max-w-sm md:block">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-4
                    py-2.5
                  "
                >
                  <Search
                    size={17}
                    className="text-zinc-600"
                  />

                  <input
                    type="search"
                    placeholder="Search anything..."
                    aria-label="Search dashboard"
                    className="
                      w-full
                      bg-transparent
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-600
                    "
                  />

                  <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-zinc-600">
                    ⌘ K
                  </span>
                </div>
              </div>

              {/* Right */}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="
                    relative
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    p-2.5
                    text-zinc-400
                    transition
                    hover:border-cyan-500/30
                    hover:text-cyan-400
                  "
                >
                  <Bell size={18} />

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                </button>

                <div className="hidden h-9 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-3">
                  {/* User info */}

                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold">
                      {loadingAdmin
                        ? "Loading..."
                        : adminName}
                    </p>

                    <p className="text-[11px] text-zinc-600">
                      {admin?.role === "admin"
                        ? "Super Administrator"
                        : "Administrator"}
                    </p>
                  </div>

                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-purple-600
                      to-blue-600
                      text-sm
                      font-bold
                      uppercase
                      shadow-lg
                      shadow-purple-900/20
                    "
                  >
                    {adminInitial}
                  </div>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    title="Logout"
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-red-500/10
                      bg-red-500/[0.04]
                      px-3
                      py-2.5
                      text-red-400
                      transition
                      hover:border-red-500/30
                      hover:bg-red-500/10
                      hover:text-red-300
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <LogOut size={17} />

                    <span className="hidden lg:inline">
                      {loggingOut
                        ? "Logging out..."
                        : "Logout"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="mx-auto max-w-[1700px] p-5 lg:p-8">
            {/* =================================================
                WELCOME
            ================================================= */}

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
                    Welcome back, {adminName}

                    <span className="ml-2">
                      👋
                    </span>
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                    Here&apos;s what&apos;s happening with
                    Next Level School today.
                  </p>
                </div>

                <Link
                  href="/dashboard/admin/courses"
                  className="
                    group
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-purple-600
                    via-blue-600
                    to-cyan-500
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    shadow-xl
                    shadow-purple-900/20
                    transition
                    hover:scale-[1.02]
                  "
                >
                  <Plus size={18} />

                  Add New Course

                  <ChevronRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </section>

            {/* =================================================
                STATS
            ================================================= */}

            <section
              className="
                mb-7
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >
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

            {/* =================================================
                ANALYTICS
            ================================================= */}

            <section className="mb-7 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
              {/* Enrollment */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 opacity-0 backdrop-blur-xl lg:p-6">
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

                  <button
                    type="button"
                    aria-label="More enrollment options"
                    className="rounded-xl border border-white/10 p-2 text-zinc-500 transition hover:text-white"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="h-[320px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
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
                          stroke:
                            "rgba(168,85,247,0.3)",
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

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 opacity-0 backdrop-blur-xl lg:p-6">
                <div className="mb-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                    Course Analytics
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Course Distribution
                  </h2>
                </div>

                <div className="relative h-[260px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
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
                        {courseData.map(
                          (course, index) => (
                            <Cell
                              key={course.name}
                              fill={
                                courseColors[index]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        contentStyle={
                          chartTooltipStyle
                        }
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
                  {courseData.map(
                    (course, index) => (
                      <div
                        key={course.name}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-white/[0.03]
                          p-2.5
                        "
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              courseColors[index],
                          }}
                        />

                        <span className="text-xs text-zinc-500">
                          {course.name}
                        </span>

                        <span className="ml-auto text-xs font-semibold text-white">
                          {course.value}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                REVENUE
            ================================================= */}

            <section className="mb-7">
              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 opacity-0 backdrop-blur-xl lg:p-6">
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
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="1"
                          x2="0"
                          y2="0"
                        >
                          <stop
                            offset="0%"
                            stopColor="#22d3ee"
                          />

                          <stop
                            offset="50%"
                            stopColor="#60a5fa"
                          />

                          <stop
                            offset="100%"
                            stopColor="#a78bfa"
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={true}
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
                          `${Number(value) / 1000}k`
                        }
                      />

                      <Tooltip
                        contentStyle={chartTooltipStyle}
                        formatter={(value) => [
                          `৳${Number(
                            value
                          ).toLocaleString()}`,
                          "Revenue",
                        ]}
                      />

                      <Bar
                        dataKey="revenue"
                        radius={[8, 8, 2, 2]}
                        fill="url(#revenueGradient)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* =================================================
                COURSE PERFORMANCE + RECENT ENROLLMENTS
            ================================================= */}

            <section className="grid gap-5 xl:grid-cols-2">
              {/* Course Performance */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 opacity-0 backdrop-blur-xl lg:p-6">
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
                    className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-5">
                  {coursePerformance.map(
                    (course) => (
                      <div key={course.title}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {course.title}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              {course.students} students
                              {" • "}
                              {course.category}
                            </p>
                          </div>

                          <span className="text-sm font-bold text-cyan-400">
                            {course.progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="
                              h-full
                              rounded-full
                              bg-gradient-to-r
                              from-purple-500
                              via-blue-500
                              to-cyan-400
                              transition-all
                            "
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Recent Enrollments */}

              <div className="chart-card rounded-3xl border border-white/10 bg-white/[0.035] p-5 opacity-0 backdrop-blur-xl lg:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-400">
                      Live Activity
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      Recent Enrollments
                    </h2>
                  </div>

                  <Link
                    href="/dashboard/admin/enrollments"
                    className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentEnrollments.map(
                    (student) => (
                      <Link
                        key={student.name}
                        href="/dashboard/admin/enrollments"
                        className="
                          group
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          border-transparent
                          bg-white/[0.025]
                          p-3
                          transition
                          hover:border-white/10
                          hover:bg-white/[0.05]
                        "
                      >
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-gradient-to-br
                            from-purple-600/30
                            to-blue-600/30
                            text-xs
                            font-bold
                            text-purple-300
                          "
                        >
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
                            className={`
                              mt-1
                              inline-block
                              rounded-full
                              px-2
                              py-0.5
                              text-[10px]
                              font-semibold
                              ${
                                student.status ===
                                "Active"
                                  ? "bg-cyan-400/10 text-cyan-400"
                                  : "bg-yellow-400/10 text-yellow-400"
                              }
                            `}
                          >
                            {student.status}
                          </span>
                        </div>

                        <ChevronRight
                          size={15}
                          className="
                            text-zinc-700
                            transition
                            group-hover:translate-x-1
                            group-hover:text-cyan-400
                          "
                        />
                      </Link>
                    )
                  )}
                </div>
              </div>
            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="dashboard-item mt-7">
              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-gradient-to-r
                  from-purple-600/[0.08]
                  via-blue-600/[0.05]
                  to-cyan-500/[0.08]
                  p-5
                  backdrop-blur-xl
                  lg:p-6
                "
              >
                <div className="mb-5">
                  <h2 className="text-lg font-bold">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Manage your school quickly
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Add Course */}

                  <Link
                    href="/dashboard/admin/courses"
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-4
                      transition
                      hover:-translate-y-1
                      hover:border-purple-500/30
                      hover:bg-purple-500/10
                    "
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

                  {/* Students */}

                  <Link
                    href="/dashboard/admin/students"
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-4
                      transition
                      hover:-translate-y-1
                      hover:border-blue-500/30
                      hover:bg-blue-500/10
                    "
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

                  {/* Enrollments */}

                  <Link
                    href="/dashboard/admin/enrollments"
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-4
                      transition
                      hover:-translate-y-1
                      hover:border-cyan-500/30
                      hover:bg-cyan-500/10
                    "
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

                  {/* Analytics */}

                  <Link
                    href="/dashboard/admin/analytics"
                    className="
                      group
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-4
                      transition
                      hover:-translate-y-1
                      hover:border-fuchsia-500/30
                      hover:bg-fuchsia-500/10
                    "
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

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="dashboard-item py-8 text-center text-xs text-zinc-700">
              © 2026 Next Level School • Admin Console
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}