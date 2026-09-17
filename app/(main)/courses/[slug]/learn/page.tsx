"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import Link from "next/link";

import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    Loader2,
    Lock,
    PlayCircle,
    ShieldCheck,
    Video,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

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
    instructor?: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    totalLessons?: number;
    skills?: string[];
    icon?: string;
    featured?: boolean;
    status?: string;
}

interface Module {
    _id: string;
    courseId: string;
    title: string;
    description?: string;
    order: number;
    status?: "published" | "draft";
}

interface Lesson {
    _id: string;
    courseId: string;
    moduleId: string;
    title: string;
    description?: string;
    videoUrl?: string;
    videoPublicId?: string;
    duration?: number;
    order: number;
    isFree?: boolean;
    status?: "published" | "draft";
}

interface Enrollment {
    _id: string;
    userId: string;
    courseId: string;

    status?:
        | "pending"
        | "active"
        | "completed"
        | "cancelled";

    paymentStatus?:
        | "unpaid"
        | "pending"
        | "paid"
        | "failed"
        | "refunded";

    progress?: number;

    completedLessons?: string[];

    enrolledAt?: string;

    completedAt?: string | null;
}

// =========================================================
// HELPERS
// =========================================================

function formatDuration(seconds?: number) {
    if (!seconds || seconds <= 0) {
        return "00:00";
    }

    const totalSeconds = Math.floor(seconds);

    const hours = Math.floor(
        totalSeconds / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const remainingSeconds =
        totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(remainingSeconds).padStart(
            2,
            "0"
        )}`;
    }

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}

function getProgress(
    completedLessons: string[],
    totalLessons: number
) {
    if (totalLessons <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round(
            (completedLessons.length /
                totalLessons) *
                100
        )
    );
}

// =========================================================
// PAGE
// =========================================================

export default function CourseLearningPage() {
    const params = useParams();
    const router = useRouter();

    const slug =
        typeof params?.slug === "string"
            ? params.slug
            : "";

    // =====================================================
    // STATE
    // =====================================================

    const [course, setCourse] =
        useState<Course | null>(null);

    const [modules, setModules] =
        useState<Module[]>([]);

    const [lessons, setLessons] =
        useState<Lesson[]>([]);

    const [enrollment, setEnrollment] =
        useState<Enrollment | null>(null);

    const [selectedLesson, setSelectedLesson] =
        useState<Lesson | null>(null);

    const [openModules, setOpenModules] =
        useState<Record<string, boolean>>({});

    const [loading, setLoading] =
        useState(true);

    const [accessChecking, setAccessChecking] =
        useState(true);

    const [error, setError] =
        useState("");

    const [videoEnded, setVideoEnded] =
        useState(false);

    const [completingLesson, setCompletingLesson] =
        useState(false);

    const [completionError, setCompletionError] =
        useState("");

    // =====================================================
    // LOAD COURSE + ACCESS
    // =====================================================

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            if (!slug) {
                return;
            }

            try {
                setLoading(true);
                setAccessChecking(true);
                setError("");

                // =================================================
                // COURSE
                // =================================================

                const courseResponse =
                    await fetch(
                        `/api/courses?slug=${encodeURIComponent(
                            slug
                        )}`,
                        {
                            cache: "no-store",
                        }
                    );

                const courseData =
                    await courseResponse.json();

                if (
                    !courseResponse.ok ||
                    !courseData?.course
                ) {
                    throw new Error(
                        courseData?.message ||
                            "Course not found."
                    );
                }

                const loadedCourse =
                    courseData.course as Course;

                if (cancelled) {
                    return;
                }

                setCourse(loadedCourse);

                // =================================================
                // ENROLLMENT / ACCESS
                // =================================================

                const enrollmentResponse =
                    await fetch(
                        `/api/enrollments?courseId=${loadedCourse._id}`,
                        {
                            cache: "no-store",
                        }
                    );

                const enrollmentData =
                    await enrollmentResponse.json();

                if (
                    enrollmentResponse.status ===
                    401
                ) {
                    router.replace(
                        `/login?redirect=${encodeURIComponent(
                            `/courses/${slug}/learn`
                        )}`
                    );

                    return;
                }

                const loadedEnrollment =
                    enrollmentData?.enrollment;

                const hasAccess =
                    loadedEnrollment &&
                    (
                        (
                            loadedEnrollment.status ===
                                "active" &&
                            loadedEnrollment.paymentStatus ===
                                "paid"
                        ) ||
                        loadedEnrollment.status ===
                            "completed"
                    );

                if (!hasAccess) {
                    router.replace(
                        `/checkout/${loadedCourse._id}`
                    );

                    return;
                }

                if (cancelled) {
                    return;
                }

                setEnrollment(
                    loadedEnrollment
                );

                setAccessChecking(false);

                // =================================================
                // MODULES
                // =================================================

                const modulesResponse =
                    await fetch(
                        `/api/modules?courseId=${loadedCourse._id}`,
                        {
                            cache: "no-store",
                        }
                    );

                const modulesData =
                    await modulesResponse.json();

                if (!modulesResponse.ok) {
                    throw new Error(
                        modulesData?.message ||
                            "Failed to load modules."
                    );
                }

                const loadedModules =
                    Array.isArray(
                        modulesData?.modules
                    )
                        ? modulesData.modules
                        : [];

                // =================================================
                // LESSONS
                // =================================================

                const lessonsResponse =
                    await fetch(
                        `/api/lessons?courseId=${loadedCourse._id}`,
                        {
                            cache: "no-store",
                        }
                    );

                const lessonsData =
                    await lessonsResponse.json();

                if (!lessonsResponse.ok) {
                    throw new Error(
                        lessonsData?.message ||
                            "Failed to load lessons."
                    );
                }

                const loadedLessons =
                    Array.isArray(
                        lessonsData?.lessons
                    )
                        ? lessonsData.lessons
                        : [];

                if (cancelled) {
                    return;
                }

                setModules(
                    loadedModules
                );

                setLessons(
                    loadedLessons
                );

                // =================================================
                // FIRST LESSON
                // =================================================

                if (loadedLessons.length > 0) {
                    const moduleOrderMap =
                        new Map(
                            loadedModules.map(
                                (
                                    module: Module
                                ) => [
                                    module._id,
                                    module.order,
                                ]
                            )
                        );

                    const sortedLessons =
                        [
                            ...loadedLessons,
                        ].sort(
                            (
                                a: Lesson,
                                b: Lesson
                            ) => {
                                const moduleA =
                                    moduleOrderMap.get(
                                        a.moduleId
                                    ) ??
                                    Number.MAX_SAFE_INTEGER;

                                const moduleB =
                                    moduleOrderMap.get(
                                        b.moduleId
                                    ) ??
                                    Number.MAX_SAFE_INTEGER;

                                if (
                                    moduleA !==
                                    moduleB
                                ) {
                                   return Number(moduleA) - Number(moduleB);
                                }

                                return (
                                    a.order -
                                    b.order
                                );
                            }
                        );

                    const completed =
                        loadedEnrollment?.completedLessons ??
                        [];

                    const firstIncomplete =
                        sortedLessons.find(
                            (
                                lesson: Lesson
                            ) =>
                                !completed.includes(
                                    lesson._id
                                )
                        );

                    const firstLesson =
                        firstIncomplete ??
                        sortedLessons[0];

                    setSelectedLesson(
                        firstLesson
                    );

                    setOpenModules({
                        [firstLesson.moduleId]:
                            true,
                    });
                }
            } catch (err) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Course learning page error:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    setAccessChecking(false);
                }
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [slug, router]);

    // =====================================================
    // ORDERED MODULES
    // =====================================================

    const orderedModules = useMemo(() => {
        return [...modules].sort(
            (a, b) => {
                if (
                    a.order !==
                    b.order
                ) {
                    return (
                        a.order -
                        b.order
                    );
                }

                return a._id.localeCompare(
                    b._id
                );
            }
        );
    }, [modules]);

    // =====================================================
    // ORDERED LESSONS
    // MODULE ORDER -> LESSON ORDER
    // =====================================================

    const orderedLessons = useMemo(() => {
    const moduleOrderMap = new Map<string, number>(
        orderedModules.map(
            (module, index): [string, number] => [
                module._id,
                index,
            ]
        )
    );

    return [...lessons].sort(
        (a, b) => {
            const moduleA =
                moduleOrderMap.get(a.moduleId) ??
                Number.MAX_SAFE_INTEGER;

            const moduleB =
                moduleOrderMap.get(b.moduleId) ??
                Number.MAX_SAFE_INTEGER;

            if (moduleA !== moduleB) {
                return moduleA - moduleB;
            }

            if (a.order !== b.order) {
                return a.order - b.order;
            }

            return a._id.localeCompare(b._id);
        }
    );
}, [lessons, orderedModules]);

    // =====================================================
    // LESSONS BY MODULE
    // =====================================================

    const lessonsByModule =
        useMemo(() => {
            const map =
                new Map<
                    string,
                    Lesson[]
                >();

            for (const lesson of orderedLessons) {
                const existing =
                    map.get(
                        lesson.moduleId
                    ) ?? [];

                existing.push(
                    lesson
                );

                map.set(
                    lesson.moduleId,
                    existing
                );
            }

            return map;
        }, [orderedLessons]);

    // =====================================================
    // COMPLETION DATA
    // =====================================================

    const completedLessons =
        enrollment?.completedLessons ??
        [];

    const progress =
        enrollment?.progress ??
        getProgress(
            completedLessons,
            orderedLessons.length
        );

    const currentLessonIndex =
        selectedLesson
            ? orderedLessons.findIndex(
                  (lesson) =>
                      lesson._id ===
                      selectedLesson._id
              )
            : -1;

    const previousLesson =
        currentLessonIndex > 0
            ? orderedLessons[
                  currentLessonIndex - 1
              ]
            : null;

    const nextLesson =
        currentLessonIndex >= 0 &&
        currentLessonIndex <
            orderedLessons.length - 1
            ? orderedLessons[
                  currentLessonIndex + 1
              ]
            : null;

    const currentLessonCompleted =
        selectedLesson
            ? completedLessons.includes(
                  selectedLesson._id
              )
            : false;

    const canGoNext =
        currentLessonCompleted ||
        videoEnded;

    // =====================================================
    // SELECT LESSON
    // =====================================================

    function handleSelectLesson(
        lesson: Lesson
    ) {
        const lessonIndex =
            orderedLessons.findIndex(
                (item) =>
                    item._id ===
                    lesson._id
            );

        if (lessonIndex === -1) {
            return;
        }

        // Already completed lessons
        if (
            completedLessons.includes(
                lesson._id
            )
        ) {
            setSelectedLesson(
                lesson
            );

            setVideoEnded(false);

            setCompletionError("");

            setOpenModules(
                (previous) => ({
                    ...previous,
                    [lesson.moduleId]:
                        true,
                })
            );

            return;
        }

        // First lesson
        if (lessonIndex === 0) {
            setSelectedLesson(
                lesson
            );

            setVideoEnded(false);

            setCompletionError("");

            setOpenModules(
                (previous) => ({
                    ...previous,
                    [lesson.moduleId]:
                        true,
                })
            );

            return;
        }

        // Previous lesson must be completed
        const previous =
            orderedLessons[
                lessonIndex - 1
            ];

        const previousCompleted =
            completedLessons.includes(
                previous._id
            );

        if (!previousCompleted) {
            return;
        }

        setSelectedLesson(
            lesson
        );

        setVideoEnded(false);

        setCompletionError("");

        setOpenModules(
            (previousState) => ({
                ...previousState,
                [lesson.moduleId]:
                    true,
            })
        );
    }

    // =====================================================
    // VIDEO ENDED
    // =====================================================

    function handleVideoEnded() {
        setVideoEnded(true);
    }

    // =====================================================
    // COMPLETE CURRENT LESSON
    // =====================================================

    async function completeCurrentLesson() {
        if (
            !course ||
            !selectedLesson
        ) {
            return false;
        }

        if (
            completingLesson
        ) {
            return false;
        }

        if (
            completedLessons.includes(
                selectedLesson._id
            )
        ) {
            return true;
        }

        try {
            setCompletingLesson(
                true
            );

            setCompletionError("");

            const response =
                await fetch(
                    "/api/enrollments",
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            courseId:
                                course._id,

                            lessonId:
                                selectedLesson._id,

                            action:
                                "complete",
                        }),
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data?.success
            ) {
                throw new Error(
                    data?.message ||
                        "Failed to complete lesson."
                );
            }

            // =================================================
            // IMPORTANT:
            // USE SERVER RESPONSE AS SOURCE OF TRUTH
            // =================================================

            const updatedCompletedLessons =
                Array.isArray(
                    data.completedLessons
                )
                    ? data.completedLessons
                    : completedLessons;

            const updatedProgress =
                typeof data.progress ===
                "number"
                    ? data.progress
                    : progress;

            const updatedEnrollment =
                data.enrollment;

            setEnrollment(
                (previous) => ({
                    ...(previous ?? {}),
                    ...(updatedEnrollment ??
                        {}),

                    completedLessons:
                        updatedCompletedLessons,

                    progress:
                        updatedProgress,

                    status:
                        data.courseCompleted
                            ? "completed"
                            : "active",

                    completedAt:
                        data.courseCompleted
                            ? new Date().toISOString()
                            : previous?.completedAt ??
                              null,
                })
            );

            setVideoEnded(true);

            return true;
        } catch (err) {
            console.error(
                "Complete lesson error:",
                err
            );

            setCompletionError(
                err instanceof Error
                    ? err.message
                    : "Failed to complete lesson."
            );

            return false;
        } finally {
            setCompletingLesson(
                false
            );
        }
    }

    // =====================================================
    // NEXT LESSON
    // =====================================================

    async function handleNextLesson() {
        if (!selectedLesson) {
            return;
        }

        if (!canGoNext) {
            return;
        }

        const completed =
            await completeCurrentLesson();

        if (!completed) {
            return;
        }

        if (!nextLesson) {
            return;
        }

        setSelectedLesson(
            nextLesson
        );

        setVideoEnded(false);

        setCompletionError("");

        setOpenModules(
            (previous) => ({
                ...previous,
                [nextLesson.moduleId]:
                    true,
            })
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // =====================================================
    // PREVIOUS LESSON
    // =====================================================

    function handlePreviousLesson() {
        if (!previousLesson) {
            return;
        }

        setSelectedLesson(
            previousLesson
        );

        setVideoEnded(false);

        setCompletionError("");

        setOpenModules(
            (previous) => ({
                ...previous,
                [previousLesson.moduleId]:
                    true,
            })
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // =====================================================
    // MODULE TOGGLE
    // =====================================================

    function toggleModule(
        moduleId: string
    ) {
        setOpenModules(
            (previous) => ({
                ...previous,
                [moduleId]:
                    !previous[moduleId],
            })
        );
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading ||
        accessChecking
    ) {
        return (
            <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-white/70">
                    <Loader2 className="w-8 h-8 animate-spin" />

                    <p className="text-sm">
                        Loading course...
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !course) {
        return (
            <div className="min-h-screen bg-[#08080c] text-white flex items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7 text-red-400" />
                    </div>

                    <h1 className="text-xl font-semibold">
                        Unable to load course
                    </h1>

                    <p className="mt-2 text-sm text-white/50">
                        {error ||
                            "Course not found."}
                    </p>

                    <Link
                        href="/dashboard/courses"
                        className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Courses
                    </Link>
                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-[#08080c] text-white">
            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08080c]/90 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <Link
                            href="/dashboard/courses"
                            className="shrink-0 w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:bg-white/[0.07] transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>

                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                Learning
                            </p>

                            <h1 className="text-sm sm:text-base font-semibold truncate">
                                {course.title}
                            </h1>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[11px] text-white/35">
                                Course Progress
                            </p>

                            <p className="text-sm font-semibold">
                                {progress}%
                            </p>
                        </div>

                        <div className="w-32 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* =================================================
                MAIN
            ================================================= */}

            <div className="max-w-[1600px] mx-auto flex">
                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="hidden lg:block w-[340px] shrink-0 border-r border-white/[0.06] min-h-[calc(100vh-72px)] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
                    <div className="p-5">
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-purple-400" />

                                    <span className="text-sm font-semibold">
                                        Course Content
                                    </span>
                                </div>

                                <span className="text-xs text-white/35">
                                    {
                                        completedLessons.length
                                    }{" "}
                                    /{" "}
                                    {
                                        orderedLessons.length
                                    }
                                </span>
                            </div>

                            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-500"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {orderedModules.map(
                                (
                                    module
                                ) => {
                                    const moduleLessons =
                                        lessonsByModule.get(
                                            module._id
                                        ) ??
                                        [];

                                    const isOpen =
                                        openModules[
                                            module._id
                                        ];

                                    return (
                                        <div
                                            key={
                                                module._id
                                            }
                                            className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.015]"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleModule(
                                                        module._id
                                                    )
                                                }
                                                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-white/[0.035] transition"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {module.title}
                                                    </p>

                                                    <p className="text-[11px] text-white/35 mt-1">
                                                        {
                                                            moduleLessons.length
                                                        }{" "}
                                                        lessons
                                                    </p>
                                                </div>

                                                <ChevronDown
                                                    className={`w-4 h-4 text-white/35 shrink-0 transition-transform ${
                                                        isOpen
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>

                                            {isOpen && (
                                                <div className="border-t border-white/[0.05]">
                                                    {moduleLessons.map(
                                                        (
                                                            lesson
                                                        ) => {
                                                            const isCompleted =
                                                                completedLessons.includes(
                                                                    lesson._id
                                                                );

                                                            const isSelected =
                                                                selectedLesson?._id ===
                                                                lesson._id;

                                                            const lessonIndex =
                                                                orderedLessons.findIndex(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item._id ===
                                                                        lesson._id
                                                                );

                                                            const previous =
                                                                lessonIndex >
                                                                0
                                                                    ? orderedLessons[
                                                                          lessonIndex -
                                                                              1
                                                                      ]
                                                                    : null;

                                                            const isLocked =
                                                                lessonIndex >
                                                                    0 &&
                                                                !isCompleted &&
                                                                !!previous &&
                                                                !completedLessons.includes(
                                                                    previous._id
                                                                );

                                                            return (
                                                                <button
                                                                    key={
                                                                        lesson._id
                                                                    }
                                                                    type="button"
                                                                    disabled={
                                                                        isLocked
                                                                    }
                                                                    onClick={() =>
                                                                        handleSelectLesson(
                                                                            lesson
                                                                        )
                                                                    }
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                                                                        isSelected
                                                                            ? "bg-purple-500/[0.12]"
                                                                            : "hover:bg-white/[0.025]"
                                                                    } ${
                                                                        isLocked
                                                                            ? "opacity-45 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                                            isCompleted
                                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                                : isSelected
                                                                                ? "bg-purple-500/15 text-purple-300"
                                                                                : "bg-white/[0.04] text-white/35"
                                                                        }`}
                                                                    >
                                                                        {isCompleted ? (
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                        ) : isLocked ? (
                                                                            <Lock className="w-3.5 h-3.5" />
                                                                        ) : (
                                                                            <PlayCircle className="w-4 h-4" />
                                                                        )}
                                                                    </div>

                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-medium truncate">
                                                                            {lesson.title}
                                                                        </p>

                                                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/30">
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock3 className="w-3 h-3" />
                                                                                {formatDuration(
                                                                                    lesson.duration
                                                                                )}
                                                                            </span>

                                                                            {lesson.isFree && (
                                                                                <span className="text-emerald-400">
                                                                                    Free
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </aside>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="flex-1 min-w-0">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                        {selectedLesson ? (
                            <>
                                {/* VIDEO */}

                                <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-black shadow-2xl">
                                    <div className="aspect-video">
                                        {selectedLesson.videoUrl ? (
                                            <video
                                                key={
                                                    selectedLesson._id
                                                }
                                                src={
                                                    selectedLesson.videoUrl
                                                }
                                                controls
                                                playsInline
                                                className="w-full h-full object-contain bg-black"
                                                onEnded={
                                                    handleVideoEnded
                                                }
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/40">
                                                <div className="text-center">
                                                    <Video className="w-10 h-10 mx-auto mb-3" />

                                                    <p className="text-sm">
                                                        Video not available
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* LESSON HEADER */}

                                <div className="mt-7">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/15 text-purple-300 text-[11px]">
                                            <PlayCircle className="w-3.5 h-3.5" />
                                            Lesson{" "}
                                            {currentLessonIndex +
                                                1}
                                        </span>

                                        {currentLessonCompleted && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-300 text-[11px]">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Completed
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                        {
                                            selectedLesson.title
                                        }
                                    </h2>

                                    {selectedLesson.description && (
                                        <p className="mt-3 text-sm leading-7 text-white/50 max-w-3xl">
                                            {
                                                selectedLesson.description
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* NAVIGATION */}

                                <div className="mt-8 flex items-center justify-between gap-3 border-y border-white/[0.06] py-5">
                                    <button
                                        type="button"
                                        onClick={
                                            handlePreviousLesson
                                        }
                                        disabled={
                                            !previousLesson
                                        }
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="w-4 h-4" />

                                        <span className="hidden sm:inline">
                                            Previous
                                        </span>
                                    </button>

                                    <div className="flex items-center gap-2 text-xs text-white/30">
                                        <span>
                                            {Math.max(
                                                currentLessonIndex +
                                                    1,
                                                1
                                            )}
                                        </span>

                                        <span>
                                            /
                                        </span>

                                        <span>
                                            {
                                                orderedLessons.length
                                            }
                                        </span>
                                    </div>

                                    {nextLesson ? (
                                        <button
                                            type="button"
                                            onClick={
                                                handleNextLesson
                                            }
                                            disabled={
                                                !canGoNext ||
                                                completingLesson
                                            }
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 disabled:opacity-35 disabled:cursor-not-allowed transition"
                                        >
                                            {completingLesson ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>
                                                        Completing...
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="hidden sm:inline">
                                                        Next Lesson
                                                    </span>

                                                    <ChevronRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={
                                                completeCurrentLesson
                                            }
                                            disabled={
                                                currentLessonCompleted ||
                                                !canGoNext ||
                                                completingLesson
                                            }
                                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                                                currentLessonCompleted
                                                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                                    : "bg-white text-black hover:bg-white/90"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {completingLesson ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Completing...
                                                </>
                                            ) : currentLessonCompleted ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Course Completed
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Complete Course
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* VIDEO COMPLETION NOTICE */}

                                {!currentLessonCompleted &&
                                    !videoEnded && (
                                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.04] px-4 py-3">
                                            <PlayCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                                            <p className="text-xs leading-5 text-white/45">
                                                Watch the lesson video until the end to unlock the next lesson.
                                            </p>
                                        </div>
                                    )}

                                {videoEnded &&
                                    !currentLessonCompleted && (
                                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] px-4 py-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />

                                            <p className="text-xs leading-5 text-white/45">
                                                Lesson completed. You can continue to the next lesson.
                                            </p>
                                        </div>
                                    )}

                                {completionError && (
                                    <div className="mt-5 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-4 py-3 text-sm text-red-300">
                                        {
                                            completionError
                                        }
                                    </div>
                                )}

                                {/* LESSON INFORMATION */}

                                <section className="mt-10">
                                    <div className="flex items-center gap-2 mb-5">
                                        <FileText className="w-4 h-4 text-purple-400" />

                                        <h3 className="text-base font-semibold">
                                            Lesson Information
                                        </h3>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                            <p className="text-[11px] text-white/30 uppercase tracking-wider">
                                                Duration
                                            </p>

                                            <p className="mt-1 text-sm font-medium">
                                                {formatDuration(
                                                    selectedLesson.duration
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                            <p className="text-[11px] text-white/30 uppercase tracking-wider">
                                                Status
                                            </p>

                                            <p className="mt-1 text-sm font-medium">
                                                {currentLessonCompleted
                                                    ? "Completed"
                                                    : videoEnded
                                                    ? "Ready to complete"
                                                    : "In progress"}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* COURSE INFORMATION */}

                                <section className="mt-10 mb-10">
                                    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-purple-500/[0.06] to-transparent p-5 sm:p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0">
                                                <BookOpen className="w-5 h-5 text-purple-400" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs text-white/35 uppercase tracking-wider">
                                                    Current Course
                                                </p>

                                                <h3 className="mt-1 text-lg font-semibold">
                                                    {
                                                        course.title
                                                    }
                                                </h3>

                                                {course.shortDescription && (
                                                    <p className="mt-2 text-sm leading-6 text-white/45">
                                                        {
                                                            course.shortDescription
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="min-h-[60vh] flex items-center justify-center">
                                <div className="text-center text-white/40">
                                    <BookOpen className="w-10 h-10 mx-auto mb-3" />

                                    <p className="text-sm">
                                        No lesson available.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}