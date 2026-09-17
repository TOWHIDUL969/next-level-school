
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Loader2,
    PlayCircle,
    RefreshCw,
    Search,
    Sparkles,
} from "lucide-react";

interface Enrollment {
    _id: string;
    userId: string;
    courseId: string;
    status?: "pending" | "active" | "completed" | "cancelled";
    paymentStatus?: "unpaid" | "pending" | "paid" | "failed" | "refunded";
    progress?: number;
    completedLessons?: string[];
    enrolledAt?: string;
    completedAt?: string | null;
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
    instructor?: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    totalLessons?: number;
    skills?: string[];
    icon?: string;
    featured?: boolean;
}

interface MyCourse {
    course: Course;
    enrollment: Enrollment;
}

function formatDuration(hours?: number) {
    if (!hours || hours <= 0) {
        return "Self-paced";
    }

    return `${hours} hours`;
}

function clampProgress(progress?: number) {
    if (typeof progress !== "number" || Number.isNaN(progress)) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round(progress)));
}

export default function MyCoursesPage() {
    const [myCourses, setMyCourses] = useState<MyCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const loadMyCourses = async () => {
        try {
            setLoading(true);
            setError("");

            const enrollmentResponse = await fetch("/api/enrollments", {
                method: "GET",
                cache: "no-store",
            });

            if (enrollmentResponse.status === 401) {
                window.location.href =
                    "/login?redirect=/dashboard/courses";
                return;
            }

            const enrollmentData = await enrollmentResponse.json();

            if (
                !enrollmentResponse.ok ||
                !enrollmentData?.success
            ) {
                throw new Error(
                    enrollmentData?.message ||
                        "Failed to load your enrollments."
                );
            }

            const enrollments: Enrollment[] = Array.isArray(
                enrollmentData.enrollments
            )
                ? enrollmentData.enrollments
                : [];

            // Only courses that the user can actually access.
            const accessibleEnrollments = enrollments.filter(
                (enrollment) =>
                    (enrollment.status === "active" &&
                        enrollment.paymentStatus === "paid") ||
                    enrollment.status === "completed"
            );

            if (accessibleEnrollments.length === 0) {
                setMyCourses([]);
                return;
            }

            const courseResults = await Promise.all(
                accessibleEnrollments.map(async (enrollment) => {
                    try {
                        const response = await fetch(
                            `/api/courses?id=${encodeURIComponent(
                                enrollment.courseId
                            )}`,
                            {
                                cache: "no-store",
                            }
                        );

                        if (!response.ok) {
                            return null;
                        }

                        const data = await response.json();

                        if (!data?.success || !data?.course) {
                            return null;
                        }

                        return {
                            course: data.course as Course,
                            enrollment,
                        };
                    } catch (courseError) {
                        console.error(
                            "Course loading error:",
                            courseError
                        );

                        return null;
                    }
                })
            );

            const validCourses = courseResults.filter(
                (item): item is MyCourse => item !== null
            );

            setMyCourses(validCourses);
        } catch (loadError) {
            console.error(
                "My Courses loading error:",
                loadError
            );

            setMyCourses([]);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load your courses."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return myCourses;
        }

        return myCourses.filter(({ course }) => {
            return (
                course.title.toLowerCase().includes(query) ||
                course.category
                    ?.toLowerCase()
                    .includes(query) ||
                course.level
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [myCourses, searchQuery]);

    const completedCourses = myCourses.filter(
        ({ enrollment }) => enrollment.status === "completed"
    ).length;

    const inProgressCourses = myCourses.filter(
        ({ enrollment }) =>
            enrollment.status === "active" &&
            clampProgress(enrollment.progress) < 100
    ).length;

    const totalLessonsCompleted = myCourses.reduce(
        (total, { enrollment }) =>
            total +
            (Array.isArray(enrollment.completedLessons)
                ? enrollment.completedLessons.length
                : 0),
        0
    );

    return (
        <main className="min-h-screen bg-[#050507] text-white">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                {/* Header */}
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.03] to-blue-500/10 p-6 shadow-2xl shadow-purple-950/10 sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

                    <div className="relative z-10">
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-purple-300">
                            <GraduationCap className="h-4 w-4" />
                            <span>Learning Dashboard</span>
                        </div>

                        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div className="max-w-3xl">
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                    My Courses
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                                    Continue your learning journey,
                                    track your progress, and build the
                                    skills that move you forward.
                                </p>
                            </div>

                            <Link
                                href="/courses"
                                className="group inline-flex w-fit items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-200 transition hover:border-purple-400/40 hover:bg-purple-500/20"
                            >
                                Browse Courses
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                {!loading && !error && myCourses.length > 0 && (
                    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Enrolled Courses
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {myCourses.length}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        In Progress
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {inProgressCourses}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                                    <PlayCircle className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Completed
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {completedCourses}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        Lessons Completed
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {totalLessonsCompleted}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-amber-500/10 p-3 text-amber-300">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Search */}
                {!loading && !error && myCourses.length > 0 && (
                    <section className="mt-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Your Learning
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Pick a course and continue where
                                    you left off.
                                </p>
                            </div>

                            <div className="relative w-full sm:max-w-xs">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search your courses..."
                                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/50 focus:bg-white/[0.06]"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Loading */}
                {loading && (
                    <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                            >
                                <div className="aspect-video animate-pulse bg-white/[0.05]" />

                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                                    <div className="h-4 w-full animate-pulse rounded bg-white/[0.05]" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.05]" />
                                    <div className="h-10 w-full animate-pulse rounded-xl bg-white/[0.06]" />
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Error */}
                {!loading && error && (
                    <section className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                            <RefreshCw className="h-5 w-5" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold">
                            Unable to load your courses
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadMyCourses}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </button>
                    </section>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    myCourses.length === 0 && (
                        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                                <BookOpen className="h-7 w-7" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold">
                                No courses yet
                            </h2>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                                You don't have any active courses
                                yet. Explore our available courses
                                and start learning today.
                            </p>

                            <Link
                                href="/courses"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                            >
                                Explore Courses
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </section>
                    )}

                {/* Course Grid */}
                {!loading &&
                    !error &&
                    filteredCourses.length > 0 && (
                        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredCourses.map(
                                ({ course, enrollment }) => {
                                    const progress =
                                        clampProgress(
                                            enrollment.progress
                                        );

                                    const isCompleted =
                                        enrollment.status ===
                                        "completed";

                                    return (
                                        <article
                                            key={
                                                enrollment._id
                                            }
                                            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-white/[0.045]"
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-950/60 via-zinc-900 to-blue-950/40">
                                                {course.thumbnail ? (
                                                    <img
                                                        src={
                                                            course.thumbnail
                                                        }
                                                        alt={
                                                            course.title
                                                        }
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <BookOpen className="h-12 w-12 text-white/20" />
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                                {isCompleted && (
                                                    <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Completed
                                                    </div>
                                                )}

                                                {!isCompleted &&
                                                    progress > 0 && (
                                                        <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                                                            {progress}%
                                                            complete
                                                        </div>
                                                    )}

                                                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                                                    {course.category && (
                                                        <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-zinc-200 backdrop-blur-md">
                                                            {
                                                                course.category
                                                            }
                                                        </span>
                                                    )}

                                                    {course.level && (
                                                        <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
                                                            {
                                                                course.level
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-white">
                                                    {
                                                        course.title
                                                    }
                                                </h3>

                                                <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-5 text-zinc-500">
                                                    {course.shortDescription ||
                                                        "Continue learning and build your skills."}
                                                </p>

                                                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        {formatDuration(
                                                            course.duration
                                                        )}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5">
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                        {course.totalLessons ??
                                                            0}{" "}
                                                        lessons
                                                    </span>
                                                </div>

                                                {/* Progress */}
                                                <div className="mt-5">
                                                    <div className="mb-2 flex items-center justify-between text-xs">
                                                        <span className="text-zinc-500">
                                                            Progress
                                                        </span>

                                                        <span className="font-medium text-zinc-300">
                                                            {progress}%
                                                        </span>
                                                    </div>

                                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Continue */}
                                                <Link
                                                    href={`/courses/${encodeURIComponent(
                                                        course.slug
                                                    )}/learn`}
                                                    className="group/button mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-purple-200 transition hover:border-purple-500/40 hover:bg-purple-500/20"
                                                >
                                                    {isCompleted
                                                        ? "Review Course"
                                                        : progress > 0
                                                          ? "Continue Learning"
                                                          : "Start Learning"}

                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </section>
                    )}

                {/* Search empty */}
                {!loading &&
                    !error &&
                    myCourses.length > 0 &&
                    filteredCourses.length === 0 && (
                        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                            <Search className="mx-auto h-8 w-8 text-zinc-600" />

                            <h2 className="mt-4 text-lg font-semibold">
                                No matching course
                            </h2>

                            <p className="mt-2 text-sm text-zinc-500">
                                Try a different search term.
                            </p>
                        </section>
                    )}
            </div>
        </main>
    );
}

