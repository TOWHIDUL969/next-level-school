"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Bot,
    Briefcase,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Code2,
    Database,
    FileText,
    Globe,
    GraduationCap,
    Layers,
    Lock,
    Mail,
    Megaphone,
    Monitor,
    Music,
    Palette,
    PenTool,
    Play,
    Server,
    Settings,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Star,
    Terminal,
    UserRound,
    Video,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface Instructor {
    name?: string;
    email?: string;
    avatar?: string;
}

interface Course {
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    thumbnail?: string;
    category?: string;
    level?: string;
    duration?: number;
    price?: number;
    instructor?: Instructor;
    totalLessons?: number;
    skills?: string[];
    icon?: string;
    featured?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Module {
    _id: string;
    courseId: string;
    title: string;
    description?: string;
    order?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Lesson {
    _id: string;
    courseId?: string;
    moduleId?: string;
    title: string;
    description?: string;
    videoUrl?: string;
    videoPublicId?: string;
    duration?: number;
    order?: number;
    isFree?: boolean;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Enrollment {
    status?: string;
    paymentStatus?: string;
    progress?: number;
    completedLessons?: string[];
}

/* =========================================================
   ICON MAP
========================================================= */

const iconMap = {
    code: Code2,
    monitor: Monitor,
    palette: Palette,
    "pen-tool": PenTool,
    megaphone: Megaphone,
    video: Video,
    bot: Bot,
    database: Database,
    globe: Globe,
    smartphone: Smartphone,
    briefcase: Briefcase,
    "graduation-cap": GraduationCap,
    "file-text": FileText,
    settings: Settings,
    "book-open": BookOpen,
    camera: Camera,
    music: Music,
    "shopping-cart": ShoppingCart,
    calculator: Terminal,
    terminal: Terminal,
    server: Server,
    layers: Layers,
} as const;

function getCourseIcon(icon?: string) {
    if (!icon) return BookOpen;

    const normalized = icon.trim().toLowerCase();

    return (
        iconMap[normalized as keyof typeof iconMap] ||
        BookOpen
    );
}

/* =========================================================
   HELPERS
========================================================= */

function formatCourseDuration(hours?: number) {
    if (!hours || hours <= 0) {
        return "Self-paced";
    }

    return `${hours} hours`;
}

function formatLessonDuration(seconds?: number) {
    if (!seconds || seconds <= 0) {
        return "";
    }

    const totalSeconds = Math.floor(seconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );
    const remainingSeconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}

function getCourseSkills(course: Course) {
    if (
        Array.isArray(course.skills) &&
        course.skills.length > 0
    ) {
        return course.skills
            .filter((skill) => typeof skill === "string")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [
        "Practical Skills",
        "Modern Tools",
        "Hands-on Practice",
        "Career Skills",
    ];
}

/* =========================================================
   PAGE
========================================================= */

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;

    /* =======================================================
       STATE
    ======================================================= */

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const [loading, setLoading] = useState(true);
    const [modulesLoading, setModulesLoading] = useState(true);
    const [lessonsLoading, setLessonsLoading] = useState(true);

    const [error, setError] = useState("");

    const [openModules, setOpenModules] = useState<
        Record<string, boolean>
    >({});

    const [enrolling, setEnrolling] = useState(false);

    const [enrollmentMessage, setEnrollmentMessage] =
        useState("");

    const [enrollmentError, setEnrollmentError] =
        useState("");

    const [enrollmentStatus, setEnrollmentStatus] = useState<
        "idle" | "success" | "already" | "error"
    >("idle");

    const [enrollmentLoading, setEnrollmentLoading] =
        useState(true);

    const [currentEnrollment, setCurrentEnrollment] =
        useState<Enrollment | null>(null);
    const enrollmentRef =
        useRef<HTMLDivElement>(null);

    const [isAuthenticated, setIsAuthenticated] =
        useState(false);

    const [authLoading, setAuthLoading] =
        useState(true);

    /* =======================================================
       ENROLL HANDLER
    ======================================================= */

    const handleEnroll = async () => {
        if (!course?._id || enrolling) return;

        try {
            setEnrolling(true);
            setEnrollmentMessage("");
            setEnrollmentError("");
            setEnrollmentStatus("idle");

            const response = await fetch("/api/enrollments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: course._id,
                }),
            });

            const data = await response.json();

            /* =================================================
               LOGIN / REGISTER REQUIRED
            ================================================= */

            if (response.status === 401) {
                router.push(
                    `/register?redirect=${encodeURIComponent(
                        `/courses/${course.slug}`
                    )}`
                );

                return;
            }

            /* =================================================
               PAYMENT REQUIRED
            ================================================= */

            if (
                response.ok &&
                data?.success &&
                data?.requiresPayment === true
            ) {
                const enrollmentId =
                    data?.enrollment?._id;

                if (!enrollmentId) {
                    setEnrollmentStatus("error");

                    setEnrollmentError(
                        "Enrollment was created, but the enrollment ID was not returned."
                    );

                    return;
                }

                router.push(
                    `/checkout/${encodeURIComponent(
                        course._id
                    )}`
                );

                return;
            }

            /* =================================================
               ALREADY ENROLLED / COMPLETED
            ================================================= */

            if (
                response.ok &&
                data?.success &&
                data?.alreadyEnrolled === true
            ) {
                if (data?.completed === true) {
                    setEnrollmentStatus("already");

                    setEnrollmentMessage(
                        data?.message ||
                        "You have already completed this course."
                    );

                    return;
                }

                /* Existing pending payment */

                if (
                    data?.requiresPayment === true
                ) {
                    router.push(
                        `/checkout/${encodeURIComponent(
                            course._id
                        )}`
                    );

                    return;
                }

                setEnrollmentStatus("already");

                setEnrollmentMessage(
                    data?.message ||
                    "You are already enrolled in this course."
                );

                return;
            }

            /* =================================================
               LEGACY 409 RESPONSE
            ================================================= */

            if (response.status === 409) {
                setEnrollmentStatus("already");

                setEnrollmentMessage(
                    data?.message ||
                    "You are already enrolled in this course."
                );

                return;
            }

            /* =================================================
               OTHER API ERRORS
            ================================================= */

            if (!response.ok) {
                setEnrollmentStatus("error");

                setEnrollmentError(
                    data?.message ||
                    "Failed to enroll in this course."
                );

                return;
            }

            /* =================================================
               FREE COURSE SUCCESS
            ================================================= */

            setEnrollmentStatus("success");

            setEnrollmentMessage(
                data?.message ||
                "Successfully enrolled in this course."
            );

            /* Update local enrollment state immediately */

            setCurrentEnrollment({
                status:
                    data?.enrollment?.status ||
                    "active",

                paymentStatus:
                    data?.enrollment?.paymentStatus ||
                    "paid",

                progress:
                    data?.enrollment?.progress || 0,

                completedLessons:
                    data?.enrollment
                        ?.completedLessons || [],
            });
        } catch (err) {
            console.error(
                "Enrollment error:",
                err
            );

            setEnrollmentStatus("error");

            setEnrollmentError(
                "Something went wrong. Please try again."
            );
        } finally {
            setEnrolling(false);
        }
    };

    /* =======================================================
   CHECK AUTHENTICATION
======================================================= */

    useEffect(() => {
        let cancelled = false;

        const checkAuthentication = async () => {
            try {
                setAuthLoading(true);

                const response = await fetch(
                    "/api/auth/me",
                    {
                        cache: "no-store",
                    }
                );

                if (cancelled) return;

                if (!response.ok) {
                    setIsAuthenticated(false);
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    setIsAuthenticated(
                        Boolean(
                            data?.success &&
                            data?.user
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "Authentication check error:",
                    error
                );

                if (!cancelled) {
                    setIsAuthenticated(false);
                }
            } finally {
                if (!cancelled) {
                    setAuthLoading(false);
                }
            }
        };

        checkAuthentication();

        return () => {
            cancelled = true;
        };
    }, []);
    /* =======================================================
       LESSON CLICK HANDLER
    ======================================================= */

    /* =======================================================
   LESSON CLICK HANDLER
======================================================= */

    const handleLessonClick = (lesson: Lesson) => {
        if (!course) return;

        // =================================================
        // WAIT FOR AUTH CHECK
        // =================================================
        if (authLoading) {
            return;
        }

        // =================================================
        // FREE LESSON
        // Anyone can watch it.
        // =================================================
        if (lesson.isFree === true) {
            router.push(
                `/courses/${encodeURIComponent(
                    course.slug
                )}/preview/${encodeURIComponent(
                    lesson._id
                )}`
            );
            return;
        }

        // =================================================
        // PAID LESSON
        // =================================================

        // User is NOT logged in
        // Send to Register
        if (!isAuthenticated) {
            router.push(
                `/register?redirect=${encodeURIComponent(
                    `/courses/${course.slug}`
                )}`
            );
            return;
        }

        // =================================================
        // WAIT FOR ENROLLMENT CHECK
        // =================================================
        if (enrollmentLoading) {
            return;
        }

        // =================================================
        // LOGGED IN BUT NOT ENROLLED
        // Scroll to Enroll Now section
        // =================================================
        if (!currentEnrollment) {
            enrollmentRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return;
        }

        // =================================================
        // PAID + ACTIVE
        // =================================================
        const hasPaidAccess =
            currentEnrollment.status === "active" &&
            currentEnrollment.paymentStatus === "paid";

        // =================================================
        // COMPLETED COURSE
        // =================================================
        const isCompleted =
            currentEnrollment.status === "completed";

        if (hasPaidAccess || isCompleted) {
            router.push(
                `/courses/${encodeURIComponent(
                    course.slug
                )}/learn?lesson=${encodeURIComponent(
                    lesson._id
                )}`
            );
            return;
        }

        // =================================================
        // PENDING + UNPAID
        // =================================================
        if (
            currentEnrollment.status === "pending" &&
            currentEnrollment.paymentStatus === "unpaid"
        ) {
            router.push(
                `/checkout/${encodeURIComponent(
                    course._id
                )}`
            );
            return;
        }

        // =================================================
        // UNKNOWN ENROLLMENT STATE
        // Scroll to Enroll Now
        // =================================================
        enrollmentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    /* =======================================================
       FETCH COURSE
    ======================================================= */

    useEffect(() => {
        if (!slug) return;

        const courseSlug = slug;
        let cancelled = false;

        const loadCourse = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/courses?slug=${encodeURIComponent(
                        courseSlug
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Course request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch course."
                    );
                }

                if (!data.course) {
                    throw new Error(
                        "Course not found."
                    );
                }

                if (!cancelled) {
                    setCourse(data.course);
                   
                }
            } catch (err) {
                console.error(
                    "Course loading error:",
                    err
                );

                if (!cancelled) {
                    setCourse(null);
                    setError(
                        "Failed to load course."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCourse();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    /* =======================================================
       CHECK ENROLLMENT
    ======================================================= */

    useEffect(() => {
        if (!course?._id) {
            setEnrollmentLoading(false);
            return;
        }

        const courseId = course._id;
        let cancelled = false;

        const checkEnrollment = async () => {
            try {
                setEnrollmentLoading(true);

                const response = await fetch(
                    `/api/enrollments?courseId=${encodeURIComponent(
                        courseId
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                if (cancelled) return;

                /*
                 * User is not logged in.
                 * Course page should still work normally.
                 */

                if (response.status === 401) {
                    setCurrentEnrollment(null);
                    return;
                }

                const data = await response.json();

                if (!response.ok) {
                    setCurrentEnrollment(null);
                    return;
                }

                if (
                    data?.enrolled &&
                    data?.enrollment
                ) {
                    setCurrentEnrollment(
                        data.enrollment
                    );
                } else {
                    setCurrentEnrollment(null);
                }
            } catch (err) {
                console.error(
                    "Enrollment status check error:",
                    err
                );

                if (!cancelled) {
                    setCurrentEnrollment(null);
                }
            } finally {
                if (!cancelled) {
                    setEnrollmentLoading(false);
                }
            }
        };

        checkEnrollment();

        return () => {
            cancelled = true;
        };
    }, [course?._id]);

    /* =======================================================
       FETCH MODULES
    ======================================================= */

    useEffect(() => {
        if (!course?._id) return;

        const courseId = course._id;
        let cancelled = false;

        async function fetchModules() {
            try {
                setModulesLoading(true);

                const response = await fetch(
                    `/api/modules?courseId=${encodeURIComponent(
                        courseId
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Modules request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch modules."
                    );
                }

                const moduleList: Module[] =
                    Array.isArray(data.modules)
                        ? [...data.modules].sort(
                            (a, b) =>
                                (a.order || 0) -
                                (b.order || 0)
                        )
                        : [];

                if (!cancelled) {
                    setModules(moduleList);

                    if (moduleList.length > 0) {
                        setOpenModules({
                            [moduleList[0]._id]: true,
                        });
                    }
                }
            } catch (err) {
                console.error(
                    "Modules fetch error:",
                    err
                );

                if (!cancelled) {
                    setModules([]);
                }
            } finally {
                if (!cancelled) {
                    setModulesLoading(false);
                }
            }
        }

        fetchModules();

        return () => {
            cancelled = true;
        };
    }, [course?._id]);

    /* =======================================================
       FETCH ALL LESSONS
    ======================================================= */

    useEffect(() => {
        if (!course?._id) return;

        const courseId = course._id;
        let cancelled = false;

        async function fetchLessons() {
            try {
                setLessonsLoading(true);

                const response = await fetch(
                    `/api/lessons?courseId=${encodeURIComponent(
                        courseId
                    )}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Lessons request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch lessons."
                    );
                }

                const lessonList: Lesson[] =
                    Array.isArray(data.lessons)
                        ? [...data.lessons].sort(
                            (a, b) => {
                                const moduleCompare =
                                    String(
                                        a.moduleId || ""
                                    ).localeCompare(
                                        String(
                                            b.moduleId ||
                                            ""
                                        )
                                    );

                                if (
                                    moduleCompare !==
                                    0
                                ) {
                                    return moduleCompare;
                                }

                                return (
                                    (a.order || 0) -
                                    (b.order || 0)
                                );
                            }
                        )
                        : [];

                if (!cancelled) {
                    setLessons(lessonList);
                }
            } catch (err) {
                console.error(
                    "Lessons fetch error:",
                    err
                );

                if (!cancelled) {
                    setLessons([]);
                }
            } finally {
                if (!cancelled) {
                    setLessonsLoading(false);
                }
            }
        }

        fetchLessons();

        return () => {
            cancelled = true;
        };
    }, [course?._id]);

    /* =======================================================
       GROUP LESSONS BY MODULE
    ======================================================= */

    const lessonsByModule = useMemo(() => {
        const grouped: Record<string, Lesson[]> = {};

        for (const lesson of lessons) {
            if (!lesson.moduleId) continue;

            if (!grouped[lesson.moduleId]) {
                grouped[lesson.moduleId] = [];
            }

            grouped[lesson.moduleId].push(
                lesson
            );
        }

        Object.keys(grouped).forEach(
            (moduleId) => {
                grouped[moduleId].sort(
                    (a, b) =>
                        (a.order || 0) -
                        (b.order || 0)
                );
            }
        );

        return grouped;
    }, [lessons]);

    /* =======================================================
       COURSE ICON
    ======================================================= */

    const CourseIcon = useMemo(
        () => getCourseIcon(course?.icon),
        [course?.icon]
    );

    /* =======================================================
       SKILLS
    ======================================================= */

    const skills = course
        ? getCourseSkills(course)
        : [];

    /* =======================================================
       TOTAL LESSONS
    ======================================================= */

    const totalLessons =
        lessons.length > 0
            ? lessons.length
            : Number(course?.totalLessons || 0);

    /* =======================================================
       LOADING
    ======================================================= */

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050507] text-white">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-5 w-32 rounded bg-white/10" />

                        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                            <div>
                                <div className="h-7 w-40 rounded bg-white/10" />

                                <div className="mt-5 h-20 max-w-3xl rounded bg-white/10" />

                                <div className="mt-6 h-20 max-w-2xl rounded bg-white/5" />
                            </div>

                            <div className="aspect-video rounded-3xl bg-white/5" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /* =======================================================
       ERROR
    ======================================================= */

    if (error || !course) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#050507] px-4 text-white">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                        <BookOpen size={28} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold">
                        Course Not Found
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                        The course you are looking for
                        may have been removed or is
                        currently unavailable.
                    </p>

                    <Link
                        href="/courses"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                        <ArrowLeft size={16} />
                        Back to Courses
                    </Link>
                </div>
            </main>
        );
    }

    /* =======================================================
       ENROLLMENT BUTTON RENDERER
    ======================================================= */

    const renderEnrollmentButton = () => {
        if (
            currentEnrollment?.status ===
            "active"
        ) {
            return (
                <Link
                    href={`/courses/${course.slug}/learn`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-emerald-900/40"
                >
                    <Play
                        size={17}
                        fill="currentColor"
                    />
                    Continue Course
                    <ArrowRight size={16} />
                </Link>
            );
        }

        if (
            currentEnrollment?.status ===
            "completed"
        ) {
            return (
                <Link
                    href={`/courses/${course.slug}/learn`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:-translate-y-0.5"
                >
                    <CheckCircle2 size={17} />
                    Course Completed
                    <ArrowRight size={16} />
                </Link>
            );
        }

        if (
            currentEnrollment?.status ===
            "pending" &&
            currentEnrollment?.paymentStatus ===
            "unpaid"
        ) {
            return (
                <Link
                    href={`/checkout/${course._id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-3.5 text-sm font-bold text-amber-300 transition hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-amber-500/15"
                >
                    <Lock size={17} />
                    Payment Required
                    <ArrowRight size={16} />
                </Link>
            );
        }

        return (
            <button
                type="button"
                onClick={handleEnroll}
                disabled={
                    enrolling ||
                    enrollmentLoading
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:-translate-y-0.5 hover:shadow-purple-900/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
                <ShoppingCart size={17} />

                {enrollmentLoading
                    ? "Checking..."
                    : enrolling
                        ? "Enrolling..."
                        : "Enroll Now"}

                <ArrowRight size={16} />
            </button>
        );
    };

    /* =======================================================
       ENROLLMENT MESSAGES
    ======================================================= */

    const renderEnrollmentMessages = () => (
        <>
            {enrollmentMessage &&
                enrollmentStatus ===
                "success" && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3.5 text-sm">
                        <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-emerald-400"
                        />

                        <div>
                            <p className="font-semibold text-emerald-200">
                                Enrollment Successful
                            </p>

                            <p className="mt-1 leading-5 text-emerald-300/80">
                                {
                                    enrollmentMessage
                                }
                            </p>
                        </div>
                    </div>
                )}

            {enrollmentMessage &&
                enrollmentStatus ===
                "already" && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3.5 text-sm">
                        <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-blue-400"
                        />

                        <div>
                            <p className="font-semibold text-blue-200">
                                Already Enrolled
                            </p>

                            <p className="mt-1 leading-5 text-blue-300/80">
                                {
                                    enrollmentMessage
                                }
                            </p>
                        </div>
                    </div>
                )}

            {enrollmentError &&
                enrollmentStatus ===
                "error" && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3.5 text-sm">
                        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-300">
                            !
                        </span>

                        <div>
                            <p className="font-semibold text-red-200">
                                Enrollment Failed
                            </p>

                            <p className="mt-1 leading-5 text-red-300/80">
                                {
                                    enrollmentError
                                }
                            </p>
                        </div>
                    </div>
                )}
        </>
    );

    /* =======================================================
       MAIN
    ======================================================= */

    return (
        <main className="min-h-screen overflow-hidden bg-[#050507] text-white">
            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[130px]" />

                    <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />

                    <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-fuchsia-600/10 blur-[120px]" />

                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                            backgroundSize:
                                "45px 45px",
                        }}
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
                    <Link
                        href="/courses"
                        className="group mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                    >
                        <ArrowLeft
                            size={17}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Back to Courses
                    </Link>

                    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                        {/* LEFT */}

                        <div>
                            <div className="mb-5 flex flex-wrap items-center gap-2.5">
                                {course.featured && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300">
                                        <Star
                                            size={13}
                                            fill="currentColor"
                                        />
                                        Featured Course
                                    </span>
                                )}

                                {course.category && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                                        {
                                            course.category
                                        }
                                    </span>
                                )}

                                {course.level && (
                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                                        {course.level}
                                    </span>
                                )}
                            </div>

                            <h1 className="max-w-4xl text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                <span className="bg-gradient-to-r from-white via-white to-purple-300 bg-clip-text text-transparent">
                                    {course.title}
                                </span>
                            </h1>

                            {course.shortDescription && (
                                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                                    {
                                        course.shortDescription
                                    }
                                </p>
                            )}

                            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Clock3
                                            size={15}
                                        />

                                        <span className="text-xs">
                                            Duration
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-white">
                                        {formatCourseDuration(
                                            course.duration
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <BookOpen
                                            size={15}
                                        />

                                        <span className="text-xs">
                                            Lessons
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-white">
                                        {totalLessons}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Layers
                                            size={15}
                                        />

                                        <span className="text-xs">
                                            Modules
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-white">
                                        {
                                            modules.length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}

                        <div className="relative">
                            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-purple-600/30 via-blue-500/20 to-fuchsia-500/20 blur-xl" />

                            <div ref={enrollmentRef} id="enroll" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b10]/90 shadow-2xl shadow-purple-950/20 backdrop-blur-xl">
                                <div className="relative aspect-video overflow-hidden">
                                    {course.thumbnail ? (
                                        <img
                                            src={
                                                course.thumbnail
                                            }
                                            alt={
                                                course.title
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-fuchsia-600/20">
                                            <CourseIcon
                                                size={70}
                                                className="text-purple-300"
                                            />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent" />

                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-md">
                                        <Sparkles
                                            size={13}
                                            className="text-purple-300"
                                        />

                                        Next Level
                                        School
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Course Price
                                            </p>

                                            <p className="mt-1 text-3xl font-black text-white">
                                                ৳
                                                {Number(
                                                    course.price ||
                                                    0
                                                ).toLocaleString(
                                                    "en-BD"
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300">
                                            <CourseIcon
                                                size={24}
                                            />
                                        </div>
                                    </div>

                                    {renderEnrollmentButton()}

                                    {renderEnrollmentMessages()}

                                    <p className="mt-3 text-center text-xs text-zinc-500">
                                        Start learning
                                        and build your
                                        future.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <section className="border-t border-white/[0.06]">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
                        {/* MAIN COLUMN */}

                        <div className="min-w-0">
                            {/* ABOUT */}

                            <section>
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                        <BookOpen
                                            size={20}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-purple-400">
                                            Course Overview
                                        </p>

                                        <h2 className="text-2xl font-bold">
                                            About This
                                            Course
                                        </h2>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-400 sm:text-base">
                                        {course.description ||
                                            course.shortDescription ||
                                            "Course description will be available soon."}
                                    </p>
                                </div>
                            </section>

                            {/* SKILLS */}

                            <section className="mt-12">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                        <CheckCircle2
                                            size={20}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-blue-400">
                                            What
                                            You&apos;ll
                                            Learn
                                        </p>

                                        <h2 className="text-2xl font-bold">
                                            Skills
                                            You&apos;ll
                                            Gain
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <div
                                                key={`${skill}-${index}`}
                                                className="group flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-purple-500/20 hover:bg-purple-500/[0.04]"
                                            >
                                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                                                    <Check
                                                        size={
                                                            14
                                                        }
                                                    />
                                                </div>

                                                <span className="text-sm leading-6 text-zinc-300">
                                                    {
                                                        skill
                                                    }
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* CURRICULUM */}

                            <section className="mt-12">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                                            <Layers
                                                size={
                                                    20
                                                }
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-400">
                                                Curriculum
                                            </p>

                                            <h2 className="text-2xl font-bold">
                                                Course
                                                Content
                                            </h2>
                                        </div>
                                    </div>

                                    {totalLessons >
                                        0 && (
                                            <span className="hidden text-xs text-zinc-500 sm:block">
                                                {
                                                    totalLessons
                                                }{" "}
                                                lessons
                                            </span>
                                        )}
                                </div>

                                {modulesLoading ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(
                                            (
                                                item
                                            ) => (
                                                <div
                                                    key={
                                                        item
                                                    }
                                                    className="h-20 animate-pulse rounded-2xl bg-white/[0.04]"
                                                />
                                            )
                                        )}
                                    </div>
                                ) : modules.length ===
                                    0 ? (
                                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                                            <BookOpen
                                                size={
                                                    25
                                                }
                                            />
                                        </div>

                                        <h3 className="mt-4 font-semibold">
                                            Course content
                                            is coming
                                            soon
                                        </h3>

                                        <p className="mt-2 text-sm text-zinc-500">
                                            Lessons and
                                            modules will
                                            appear here
                                            once they
                                            are
                                            published.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {modules.map(
                                            (
                                                module,
                                                moduleIndex
                                            ) => {
                                                const isOpen =
                                                    Boolean(
                                                        openModules[
                                                        module
                                                            ._id
                                                        ]
                                                    );

                                                const moduleLessons =
                                                    lessonsByModule[
                                                    module
                                                        ._id
                                                    ] ||
                                                    [];

                                                return (
                                                    <div
                                                        key={
                                                            module._id
                                                        }
                                                        className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setOpenModules(
                                                                    (
                                                                        previous
                                                                    ) => ({
                                                                        ...previous,
                                                                        [module._id]:
                                                                            !isOpen,
                                                                    })
                                                                )
                                                            }
                                                            className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-white/[0.03] sm:p-5"
                                                        >
                                                            <div className="flex min-w-0 items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-bold text-purple-300">
                                                                    {String(
                                                                        moduleIndex +
                                                                        1
                                                                    ).padStart(
                                                                        2,
                                                                        "0"
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                                                                        {
                                                                            module.title
                                                                        }
                                                                    </h3>

                                                                    <p className="mt-1 text-xs text-zinc-500">
                                                                        {
                                                                            moduleLessons.length
                                                                        }{" "}
                                                                        lessons
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <ChevronDown
                                                                size={
                                                                    19
                                                                }
                                                                className={`shrink-0 text-zinc-500 transition-transform ${isOpen
                                                                    ? "rotate-180"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </button>

                                                        {isOpen && (
                                                            <div className="border-t border-white/[0.06]">
                                                                {module.description && (
                                                                    <div className="border-b border-white/[0.05] px-5 py-4 text-sm leading-6 text-zinc-500">
                                                                        {
                                                                            module.description
                                                                        }
                                                                    </div>
                                                                )}

                                                                {lessonsLoading ? (
                                                                    <div className="space-y-2 p-4">
                                                                        <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />

                                                                        <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
                                                                    </div>
                                                                ) : moduleLessons.length ===
                                                                    0 ? (
                                                                    <div className="px-5 py-6 text-sm text-zinc-500">
                                                                        No
                                                                        lessons
                                                                        available
                                                                        yet.
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        {moduleLessons.map(
                                                                            (
                                                                                lesson,
                                                                                lessonIndex
                                                                            ) => {
                                                                                const isFree =
                                                                                    lesson.isFree ===
                                                                                    true;

                                                                                const hasVideo =
                                                                                    Boolean(
                                                                                        lesson.videoUrl
                                                                                    );

                                                                                return (
                                                                                    <button
                                                                                        type="button"
                                                                                        key={
                                                                                            lesson._id
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleLessonClick(
                                                                                                lesson
                                                                                            )
                                                                                        }
                                                                                        className="group flex w-full items-center justify-between gap-4 border-b border-white/[0.04] px-4 py-4 text-left transition hover:bg-white/[0.035] last:border-b-0 sm:px-5"
                                                                                    >
                                                                                        <div className="flex min-w-0 items-center gap-3">
                                                                                            <div
                                                                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isFree
                                                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                                                    : "bg-white/[0.05] text-zinc-500"
                                                                                                    }`}
                                                                                            >
                                                                                                {isFree ? (
                                                                                                    <Play
                                                                                                        size={
                                                                                                            14
                                                                                                        }
                                                                                                        fill="currentColor"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <Lock
                                                                                                        size={
                                                                                                            14
                                                                                                        }
                                                                                                    />
                                                                                                )}
                                                                                            </div>

                                                                                            <div className="min-w-0">
                                                                                                <p className="truncate text-sm font-medium text-zinc-300 transition group-hover:text-white">
                                                                                                    {lessonIndex +
                                                                                                        1}
                                                                                                    .{" "}
                                                                                                    {
                                                                                                        lesson.title
                                                                                                    }
                                                                                                </p>

                                                                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                                                                                                    {lesson.duration ? (
                                                                                                        <span>
                                                                                                            {formatLessonDuration(
                                                                                                                lesson.duration
                                                                                                            )}
                                                                                                        </span>
                                                                                                    ) : null}

                                                                                                    {hasVideo && (
                                                                                                        <>
                                                                                                            {lesson.duration ? (
                                                                                                                <span>
                                                                                                                    •
                                                                                                                </span>
                                                                                                            ) : null}

                                                                                                            <span>
                                                                                                                Video
                                                                                                            </span>
                                                                                                        </>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="shrink-0">
                                                                                            {isFree ? (
                                                                                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                                                                                                    Free
                                                                                                    Preview
                                                                                                </span>
                                                                                            ) : (
                                                                                                <Lock
                                                                                                    size={
                                                                                                        15
                                                                                                    }
                                                                                                    className="text-zinc-600"
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                    </button>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* =================================================
                            SIDEBAR
                        ================================================= */}

                        <aside className="lg:sticky lg:top-24 lg:h-fit">
                            <div className="space-y-4">
                                {/* Instructor */}

                                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                        Your Instructor
                                    </p>

                                    <div className="mt-5 flex items-center gap-4">
                                        {course.instructor
                                            ?.avatar ? (
                                            <img
                                                src={
                                                    course
                                                        .instructor
                                                        .avatar
                                                }
                                                alt={
                                                    course
                                                        .instructor
                                                        .name ||
                                                    "Instructor"
                                                }
                                                className="h-14 w-14 rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300">
                                                <UserRound
                                                    size={
                                                        25
                                                    }
                                                />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-white">
                                                {course
                                                    .instructor
                                                    ?.name ||
                                                    "Next Level School"}
                                            </h3>

                                            {course
                                                .instructor
                                                ?.email && (
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                                                        <Mail
                                                            size={
                                                                12
                                                            }
                                                        />

                                                        <span className="truncate">
                                                            {
                                                                course
                                                                    .instructor
                                                                    .email
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                {/* Includes */}

                                <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                                    <h3 className="font-semibold">
                                        This course
                                        includes
                                    </h3>

                                    <div className="mt-5 space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <Clock3
                                                size={
                                                    17
                                                }
                                                className="text-purple-400"
                                            />

                                            {formatCourseDuration(
                                                course.duration
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <BookOpen
                                                size={
                                                    17
                                                }
                                                className="text-blue-400"
                                            />

                                            {totalLessons}{" "}
                                            lessons
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <Layers
                                                size={
                                                    17
                                                }
                                                className="text-fuchsia-400"
                                            />

                                            {modules.length}{" "}
                                            modules
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <Play
                                                size={
                                                    17
                                                }
                                                className="text-cyan-400"
                                            />

                                            Video
                                            lessons
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <GraduationCap
                                                size={
                                                    17
                                                }
                                                className="text-emerald-400"
                                            />

                                            Practical
                                            learning
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}

                                <div className="relative overflow-hidden rounded-3xl border border-purple-500/15 bg-gradient-to-br from-purple-500/[0.12] via-white/[0.03] to-blue-500/[0.08] p-5 sm:p-6">
                                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/20 blur-3xl" />

                                    <div className="relative">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                                            <Sparkles
                                                size={
                                                    20
                                                }
                                            />
                                        </div>

                                        <h3 className="mt-4 text-lg font-bold">
                                            Ready to
                                            level up?
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                                            Start learning
                                            today and
                                            build
                                            practical
                                            skills for
                                            your future.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={
                                                handleEnroll
                                            }
                                            disabled={
                                                enrolling ||
                                                enrollmentLoading
                                            }
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            Start
                                            Learning
                                            <ArrowRight
                                                size={
                                                    16
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* =================================================
                BOTTOM CTA
            ================================================= */}

            <section className="border-t border-white/[0.06]">
                <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-300">
                        <GraduationCap
                            size={28}
                        />
                    </div>

                    <p className="mt-6 text-sm font-medium text-purple-400">
                        BUILD SKILLS. BUILD YOUR
                        FUTURE.
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                        Learn Today. Build Tomorrow.
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
                        Take the next step in your
                        learning journey with Next Level
                        School.
                    </p>

                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                        <div className="min-w-[200px]">
                            {renderEnrollmentButton()}
                            {renderEnrollmentMessages()}
                        </div>

                        <Link
                            href="/courses"
                            className="inline-flex h-fit items-center justify-center gap-2 self-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                            <ArrowLeft
                                size={17}
                            />
                            Explore More Courses
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}