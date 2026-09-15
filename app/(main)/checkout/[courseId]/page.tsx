"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    CreditCard,
    GraduationCap,
    Lock,
    Mail,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    UserRound,
    WalletCards,
    XCircle,
} from "lucide-react";

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
}

interface Enrollment {
    _id?: string;
    userId?: string;
    courseId?: string;
    status?: "pending" | "active" | "completed" | "cancelled";
    paymentStatus?: "unpaid" | "pending" | "paid" | "failed" | "refunded";
    progress?: number;
    completedLessons?: string[];
    enrolledAt?: string | null;
    completedAt?: string | null;
}

function formatPrice(price?: number) {
    const amount = Number(price || 0);

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDuration(hours?: number) {
    const value = Number(hours || 0);

    if (!value || value <= 0) {
        return "Self-paced";
    }

    return `${value} hours`;
}

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();

    const courseId =
        typeof params?.courseId === "string" ? params.courseId : "";

    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

    const [loading, setLoading] = useState(true);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);

    const [error, setError] = useState("");
    const [paymentMessage, setPaymentMessage] = useState("");

    const [processingPayment, setProcessingPayment] = useState(false);

    /*
     * =========================================================
     * FETCH COURSE
     * =========================================================
     */

    useEffect(() => {
        if (!courseId) return;

        let cancelled = false;

        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/courses?id=${encodeURIComponent(courseId)}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (cancelled) return;

                if (!response.ok || !data?.success) {
                    setError(data?.message || "Failed to load course.");
                    return;
                }

                const fetchedCourse = data?.course;

                if (!fetchedCourse) {
                    setError("Course not found.");
                    return;
                }

                setCourse(fetchedCourse);
            } catch (err) {
                console.error("Checkout course fetch error:", err);

                if (!cancelled) {
                    setError("Something went wrong while loading the course.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchCourse();

        return () => {
            cancelled = true;
        };
    }, [courseId]);

    /*
     * =========================================================
     * CHECK ENROLLMENT
     * =========================================================
     */

    useEffect(() => {
        if (!courseId) return;

        let cancelled = false;

        const checkEnrollment = async () => {
            try {
                setEnrollmentLoading(true);

                const response = await fetch(
                    `/api/enrollments?courseId=${encodeURIComponent(courseId)}`,
                    {
                        cache: "no-store",
                    }
                );

                if (cancelled) return;

                if (response.status === 401) {
                    router.replace(
                        `/login?redirect=/checkout/${encodeURIComponent(courseId)}`
                    );
                    return;
                }

                const data = await response.json();

                if (!response.ok) {
                    setEnrollment(null);
                    return;
                }

                if (data?.enrolled && data?.enrollment) {
                    setEnrollment(data.enrollment);
                } else {
                    setEnrollment(null);
                }
            } catch (err) {
                console.error("Checkout enrollment check error:", err);

                if (!cancelled) {
                    setEnrollment(null);
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
    }, [courseId, router]);

    /*
     * =========================================================
     * PRICE
     * =========================================================
     */

    const coursePrice = useMemo(() => {
        return Number(course?.price || 0);
    }, [course?.price]);

    const isFreeCourse = coursePrice <= 0;

    /*
     * =========================================================
     * PAYMENT STATUS
     * =========================================================
     */

    const paymentStatus = enrollment?.paymentStatus || "unpaid";

    const isAlreadyPaid =
        paymentStatus === "paid" &&
        (enrollment?.status === "active" ||
            enrollment?.status === "completed");

    const isPaymentPending =
        enrollment?.status === "pending" &&
        paymentStatus === "unpaid";

    /*
     * =========================================================
     * PROCEED TO PAYMENT
     * =========================================================
     */

    const handleProceedToPayment = async () => {
        if (
            !course ||
            !enrollment?._id ||
            processingPayment
        ) {
            return;
        }

        try {
            setProcessingPayment(true);
            setPaymentMessage("");

            const response = await fetch(
                "/api/payments/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        courseId: course._id,
                        enrollmentId: enrollment._id,
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                router.push(
                    `/login?redirect=/checkout/${encodeURIComponent(
                        course._id
                    )}`
                );
                return;
            }

            if (!response.ok || !data?.success) {
                setPaymentMessage(
                    data?.message ||
                    "Unable to start payment."
                );
                return;
            }

            if (
                typeof data.gatewayUrl !== "string" ||
                !data.gatewayUrl
            ) {
                setPaymentMessage(
                    "Payment gateway URL was not returned."
                );
                return;
            }

            /*
             * Redirect customer to SSLCOMMERZ
             */
            window.location.href =
                data.gatewayUrl;
        } catch (error) {
            console.error(
                "Payment initialization error:",
                error
            );

            setPaymentMessage(
                "Something went wrong while starting the payment."
            );
        } finally {
            setProcessingPayment(false);
        }
    };
    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading || enrollmentLoading) {
        return (
            <main className="min-h-screen bg-[#05050a] text-white">
                <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
                    <div className="pointer-events-none absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />

                    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-16">
                        <div className="text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
                            </div>

                            <p className="mt-5 text-sm text-zinc-400">
                                Preparing your checkout...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * ERROR
     * =========================================================
     */

    if (error || !course) {
        return (
            <main className="min-h-screen bg-[#05050a] text-white">
                <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-16">
                    <div className="w-full rounded-3xl border border-red-400/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                            <XCircle size={30} />
                        </div>

                        <h1 className="mt-6 text-2xl font-bold">
                            Unable to Load Checkout
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
                            {error || "The requested course could not be found."}
                        </p>

                        <Link
                            href="/courses"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
                        >
                            <ArrowLeft size={16} />
                            Back to Courses
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * USER HAS NO ENROLLMENT
     * =========================================================
     */

    if (!enrollment) {
        return (
            <main className="min-h-screen bg-[#05050a] text-white">
                <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-16">
                    <div className="w-full rounded-3xl border border-amber-400/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
                            <ShoppingBag size={28} />
                        </div>

                        <h1 className="mt-6 text-2xl font-bold">
                            Enrollment Required
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
                            You need to enroll in this course before proceeding to
                            checkout.
                        </p>

                        <Link
                            href={`/courses/${course.slug}`}
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
                        >
                            <ArrowLeft size={16} />
                            Back to Course
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * ALREADY PAID
     * =========================================================
     */

    if (isAlreadyPaid) {
        return (
            <main className="min-h-screen bg-[#05050a] text-white">
                <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
                    <div className="pointer-events-none absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />

                    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-16">
                        <div className="w-full rounded-3xl border border-emerald-400/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                <CheckCircle2 size={30} />
                            </div>

                            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                                Payment Complete
                            </p>

                            <h1 className="mt-3 text-2xl font-bold">
                                You Already Have Access
                            </h1>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
                                Your payment has already been completed for this
                                course. You can continue learning now.
                            </p>

                            <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
                                <p className="text-xs text-zinc-500">
                                    Course
                                </p>

                                <p className="mt-1 font-semibold text-white">
                                    {course.title}
                                </p>
                            </div>

                            <Link
                                href={`/courses/${course.slug}/learn`}
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
                            >
                                <BookOpen size={17} />
                                Continue Course
                                <ArrowRight size={16} />
                            </Link>

                            <Link
                                href={`/courses/${course.slug}`}
                                className="mt-3 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                            >
                                <ArrowLeft size={15} />
                                Back to Course
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    /*
     * =========================================================
     * MAIN CHECKOUT
     * =========================================================
     */

    return (
        <main className="min-h-screen bg-[#05050a] text-white">
            {/* Background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[140px]" />
                <div className="absolute right-[-120px] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
                <div className="absolute bottom-[-180px] left-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/5 blur-[150px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
                {/* Top navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href={`/courses/${course.slug}`}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
                    >
                        <ArrowLeft
                            size={16}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Back to Course
                    </Link>

                    <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
                        <Lock size={13} />
                        Secure Checkout
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-10">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-purple-400">
                        <Sparkles size={14} />
                        Course Checkout
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                        Complete Your{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
                            Enrollment
                        </span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                        Review your course details and complete the payment to
                        unlock your learning journey.
                    </p>
                </div>

                {/* Main grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                    {/* LEFT */}
                    <section className="space-y-6">
                        {/* Course card */}
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <div className="grid md:grid-cols-[260px_1fr]">
                                {/* Thumbnail */}
                                <div className="relative min-h-[220px] overflow-hidden bg-zinc-900">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/40 via-zinc-900 to-blue-900/40">
                                            <GraduationCap
                                                size={60}
                                                className="text-purple-300/50"
                                            />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                    {course.featured && (
                                        <div className="absolute left-4 top-4 rounded-full border border-purple-300/20 bg-purple-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-200 backdrop-blur-md">
                                            Featured
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="p-6 sm:p-7">
                                    <div className="flex flex-wrap gap-2">
                                        {course.category && (
                                            <span className="rounded-full border border-purple-400/15 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-300">
                                                {course.category}
                                            </span>
                                        )}

                                        {course.level && (
                                            <span className="rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300">
                                                {course.level}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold leading-8 sm:text-2xl">
                                        {course.title}
                                    </h2>

                                    {course.shortDescription && (
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                                            {course.shortDescription}
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-zinc-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock3
                                                size={14}
                                                className="text-purple-400"
                                            />
                                            {formatDuration(course.duration)}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <BookOpen
                                                size={14}
                                                className="text-blue-400"
                                            />
                                            {course.totalLessons || 0} lessons
                                        </div>

                                        {course.instructor?.name && (
                                            <div className="flex items-center gap-1.5">
                                                <UserRound
                                                    size={14}
                                                    className="text-fuchsia-400"
                                                />
                                                {course.instructor.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enrollment status */}
                        <div className="rounded-3xl border border-amber-400/10 bg-amber-500/[0.035] p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                                    <WalletCards size={21} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-white">
                                        Payment Required
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                                        Your enrollment has been created successfully.
                                        Complete the payment to activate your course
                                        access.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What you get */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        What You&apos;ll Get
                                    </h3>

                                    <p className="text-xs text-zinc-500">
                                        Everything included with your enrollment
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {[
                                    "Full course access",
                                    "Video lessons",
                                    "Practical learning",
                                    "Progress tracking",
                                    "Course completion",
                                    "Certificate eligibility",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3"
                                    >
                                        <CheckCircle2
                                            size={16}
                                            className="shrink-0 text-emerald-400"
                                        />

                                        <span className="text-sm text-zinc-300">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security */}
                        <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
                            <Lock
                                size={17}
                                className="mt-0.5 shrink-0 text-zinc-500"
                            />

                            <p className="text-xs leading-5 text-zinc-500">
                                Your enrollment information is securely processed.
                                Payment credentials will be handled by the payment
                                gateway and will not be stored directly by Next Level
                                School.
                            </p>
                        </div>
                    </section>

                    {/* RIGHT */}
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/30 backdrop-blur-xl">
                            {/* Summary header */}
                            <div className="border-b border-white/10 px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                        <CreditCard size={19} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold">
                                            Order Summary
                                        </h2>

                                        <p className="text-xs text-zinc-500">
                                            Review before payment
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Course mini info */}
                                <div className="flex gap-4">
                                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <GraduationCap
                                                    size={24}
                                                    className="text-purple-400/50"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="line-clamp-2 text-sm font-semibold leading-5">
                                            {course.title}
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-500">
                                            {course.category || "Online Course"}
                                        </p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="my-6 border-y border-white/[0.07] py-5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">
                                            Course Price
                                        </span>

                                        <span className="font-semibold text-white">
                                            {formatPrice(coursePrice)}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">
                                            Discount
                                        </span>

                                        <span className="font-semibold text-emerald-400">
                                            ৳0
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-bold text-white">
                                            Total
                                        </span>

                                        <span className="text-2xl font-black text-white">
                                            {formatPrice(coursePrice)}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment method placeholder */}
                                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                            <CreditCard size={18} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold">
                                                Online Payment
                                            </p>

                                            <p className="mt-0.5 text-xs text-zinc-500">
                                                Secure payment gateway
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
                                        <ShieldCheck size={13} />
                                        Secure & encrypted payment
                                    </div>
                                </div>

                                {/* Payment button */}
                                {isPaymentPending ? (
                                    <button
                                        type="button"
                                        onClick={handleProceedToPayment}
                                        disabled={processingPayment}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:-translate-y-0.5 hover:shadow-purple-900/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Preparing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={17} />
                                                Proceed to Payment
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-sm font-bold text-zinc-500"
                                    >
                                        <Lock size={16} />
                                        Payment Unavailable
                                    </button>
                                )}

                                {/* Payment message */}
                                {paymentMessage && (
                                    <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-500/10 px-4 py-3">
                                        <p className="text-xs leading-5 text-amber-300">
                                            {paymentMessage}
                                        </p>
                                    </div>
                                )}

                                {/* Terms */}
                                <p className="mt-5 text-center text-[11px] leading-5 text-zinc-600">
                                    By continuing, you agree to our course enrollment
                                    terms and payment policy.
                                </p>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-zinc-500" />

                                <div>
                                    <p className="text-xs font-semibold text-zinc-300">
                                        Need help?
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-zinc-600">
                                        Contact our support team for assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}