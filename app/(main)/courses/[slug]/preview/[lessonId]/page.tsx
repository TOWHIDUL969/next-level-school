import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock3,
    Lock,
    PlayCircle,
    ShieldCheck,
} from "lucide-react";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

interface CourseDoc {
    _id: ObjectId;
    title: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    thumbnail?: string;
    category?: string;
    level?: string;
    duration?: number;
}

interface LessonDoc {
    _id: ObjectId;
    courseId: ObjectId;
    moduleId: ObjectId;
    title: string;
    description?: string;
    videoUrl?: string;
    videoPublicId?: string;
    duration?: number;
    order?: number;
    isFree?: boolean;
    status?: string;
}

interface ModuleDoc {
    _id: ObjectId;
    courseId: ObjectId;
    title: string;
    description?: string;
    order?: number;
    status?: string;
}

interface PageProps {
    params: Promise<{
        slug: string;
        lessonId: string;
    }>;
}

function formatDuration(seconds?: number) {
    if (!seconds || seconds <= 0) {
        return "Preview lesson";
    }

    const totalSeconds = Math.round(seconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }

    return `${remainingSeconds}s`;
}

async function getPreviewData(
    slug: string,
    lessonId: string
) {
    if (!ObjectId.isValid(lessonId)) {
        return null;
    }

    const client = await clientPromise;
    const db = client.db("next-auth");

    const courses = db.collection<CourseDoc>("courses");
    const lessons = db.collection<LessonDoc>("lessons");
    const modules = db.collection<ModuleDoc>("modules");

    const course = await courses.findOne({
        slug,
    });

    if (!course) {
        return null;
    }

    const lesson = await lessons.findOne({
        _id: new ObjectId(lessonId),
        courseId: course._id,
    });

    if (!lesson) {
        return null;
    }

    // Only published free lessons can be publicly previewed.
    if (
        lesson.status !== "published" ||
        lesson.isFree !== true
    ) {
        return {
            course,
            lesson,
            module: null,
            canPreview: false,
        };
    }

    const module = await modules.findOne({
        _id: lesson.moduleId,
        courseId: course._id,
    });

    return {
        course,
        lesson,
        module,
        canPreview: true,
    };
}

export default async function FreeLessonPreviewPage({
    params,
}: PageProps) {
    const { slug, lessonId } = await params;

    const data = await getPreviewData(
        decodeURIComponent(slug),
        decodeURIComponent(lessonId)
    );

    if (!data) {
        notFound();
    }

    const {
        course,
        lesson,
        module,
        canPreview,
    } = data;

    // Paid lesson / unpublished lesson cannot be accessed
    // through the public preview URL.
    if (!canPreview) {
        redirect(
            `/courses/${encodeURIComponent(
                course.slug
            )}`
        );
    }

    const videoUrl = lesson.videoUrl;

    if (!videoUrl) {
        return (
            <main className="min-h-screen bg-[#050505] text-white">
                <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
                    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
                        <PlayCircle className="mx-auto mb-5 h-12 w-12 text-purple-400" />

                        <h1 className="text-2xl font-bold">
                            Video Not Available
                        </h1>

                        <p className="mt-3 text-sm text-white/50">
                            This preview lesson does not have a
                            video available yet.
                        </p>

                        <Link
                            href={`/courses/${encodeURIComponent(
                                course.slug
                            )}`}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Course
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/courses/${encodeURIComponent(
                            course.slug
                        )}`}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] transition group-hover:border-purple-500/40 group-hover:bg-purple-500/10">
                            <ArrowLeft className="h-4 w-4 text-white/70 transition group-hover:text-purple-300" />
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-xs text-white/40">
                                Back to course
                            </p>

                            <p className="max-w-[300px] truncate text-sm font-semibold text-white/90">
                                {course.title}
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />

                        <span className="text-xs font-semibold text-emerald-300">
                            Free Preview
                        </span>
                    </div>
                </div>
            </header>

            {/* Main */}
            <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    {/* Video + Lesson info */}
                    <section>
                        {/* Breadcrumb */}
                        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/40">
                            <Link
                                href={`/courses/${encodeURIComponent(
                                    course.slug
                                )}`}
                                className="transition hover:text-white"
                            >
                                {course.title}
                            </Link>

                            <span>/</span>

                            {module && (
                                <>
                                    <span>
                                        {module.title}
                                    </span>

                                    <span>/</span>
                                </>
                            )}

                            <span className="text-white/70">
                                {lesson.title}
                            </span>
                        </div>

                        {/* Video */}
                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-2xl shadow-purple-950/10">
                            <div className="relative aspect-video w-full bg-black">
                                <video
                                    className="h-full w-full object-contain"
                                    controls
                                    controlsList="nodownload"
                                    playsInline
                                    preload="metadata"
                                    poster={
                                        course.thumbnail ||
                                        undefined
                                    }
                                >
                                    <source
                                        src={videoUrl}
                                        type="video/mp4"
                                    />

                                    Your browser does not support
                                    the video player.
                                </video>
                            </div>
                        </div>

                        {/* Lesson details */}
                        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                                            <PlayCircle className="h-3.5 w-3.5" />
                                            Free Preview
                                        </span>

                                        {module && (
                                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/50">
                                                {module.title}
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        {lesson.title}
                                    </h1>

                                    {lesson.description && (
                                        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
                                            {lesson.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2">
                                    <Clock3 className="h-4 w-4 text-purple-300" />

                                    <span className="text-xs text-white/60">
                                        {formatDuration(
                                            lesson.duration
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sidebar */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                            {/* Course */}
                            <div className="border-b border-white/[0.07] p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                                        <BookOpen className="h-5 w-5 text-purple-300" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-white/40">
                                            Course
                                        </p>

                                        <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">
                                            {course.title}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* Preview information */}
                            <div className="p-5">
                                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                                    <div className="flex gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                                        <div>
                                            <p className="text-sm font-semibold text-emerald-300">
                                                Free lesson
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-white/45">
                                                You can watch this
                                                lesson without
                                                purchasing or
                                                enrolling in the
                                                course.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                                    <div className="flex gap-3">
                                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />

                                        <p className="text-xs leading-5 text-white/45">
                                            Other lessons may
                                            require course
                                            enrollment and
                                            payment.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={`/courses/${encodeURIComponent(
                                        course.slug
                                    )}`}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    View Full Course
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}