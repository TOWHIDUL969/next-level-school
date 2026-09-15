
import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type WithId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { getCoursesCollection } from "@/lib/courses";

export const runtime = "nodejs";

// =========================================================
// TYPES
// =========================================================

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
    createdAt?: Date;
    updatedAt?: Date;
}

interface EnrollmentDoc {
    _id?: ObjectId;
    userId: ObjectId;
    courseId: ObjectId;
    status: "active" | "pending" | "completed";
    paymentStatus: "paid" | "unpaid" | "pending";
    progress: number;
    completedLessons: ObjectId[];
    enrolledAt: Date;
    completedAt: Date | null;
}

// =========================================================
// HELPERS
// =========================================================

function serializeEnrollment(
    enrollment: WithId<EnrollmentDoc>
) {
    return {
        _id: enrollment._id.toString(),

        userId: enrollment.userId.toString(),

        courseId: enrollment.courseId.toString(),

        status: enrollment.status,

        paymentStatus: enrollment.paymentStatus,

        progress: enrollment.progress ?? 0,

        completedLessons: (
            enrollment.completedLessons ?? []
        ).map((id) => id.toString()),

        enrolledAt:
            enrollment.enrolledAt?.toISOString?.() ?? null,

        completedAt:
            enrollment.completedAt?.toISOString?.() ?? null,
    };
}

// =========================================================
// GET
// =========================================================

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                {
                    status: 401,
                }
            );
        }

        const { searchParams } = new URL(request.url);

        const courseId = searchParams.get("courseId");

        const client = await clientPromise;

        const db = client.db("next-auth");

        const enrollments =
            db.collection<EnrollmentDoc>("enrollments");

        // =====================================================
        // SINGLE COURSE ENROLLMENT
        // =====================================================

        if (courseId) {
            if (!ObjectId.isValid(courseId)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid course ID.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const enrollment = await enrollments.findOne({
                userId: new ObjectId(user.id),
                courseId: new ObjectId(courseId),
            });

            if (!enrollment) {
                return NextResponse.json({
                    success: true,
                    enrolled: false,
                    enrollment: null,
                });
            }

            return NextResponse.json({
                success: true,
                enrolled: true,
                enrollment: serializeEnrollment(enrollment),
            });
        }

        // =====================================================
        // ALL ENROLLMENTS OF CURRENT USER
        // =====================================================

        const userEnrollments = await enrollments
            .find({
                userId: new ObjectId(user.id),
            })
            .sort({
                enrolledAt: -1,
            })
            .toArray();

        return NextResponse.json({
            success: true,
            enrollments:
                userEnrollments.map(serializeEnrollment),
        });
    } catch (error) {
        console.error(
            "GET /api/enrollments error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch enrollments.",
            },
            {
                status: 500,
            }
        );
    }
}

// =========================================================
// POST
// =========================================================

export async function POST(request: NextRequest) {
    try {
        // =====================================================
        // CHECK AUTHENTICATED USER
        // =====================================================

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                {
                    status: 401,
                }
            );
        }

        // =====================================================
        // READ REQUEST BODY
        // =====================================================

        const body = await request.json();

        const courseId =
            typeof body?.courseId === "string"
                ? body.courseId.trim()
                : "";

        if (!courseId || !ObjectId.isValid(courseId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid course ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const courseObjectId = new ObjectId(courseId);

        // =====================================================
        // FIND COURSE
        // =====================================================

        const courses = await getCoursesCollection();

        const course = await (
            courses as unknown as {
                findOne: (
                    filter: {
                        _id: ObjectId;
                    }
                ) => Promise<WithId<CourseDoc> | null>;
            }
        ).findOne({
            _id: courseObjectId,
        });

        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // =====================================================
        // COURSE MUST BE PUBLISHED
        // =====================================================

        if (course.status !== "published") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This course is not available for enrollment.",
                },
                {
                    status: 400,
                }
            );
        }

        // =====================================================
        // DATABASE
        // =====================================================

        const client = await clientPromise;

        const db = client.db("next-auth");

        const enrollments =
            db.collection<EnrollmentDoc>("enrollments");

        // =====================================================
        // CHECK EXISTING ENROLLMENT
        // =====================================================

        const existingEnrollment =
            await enrollments.findOne({
                userId: new ObjectId(user.id),
                courseId: courseObjectId,
            });

        if (existingEnrollment) {
            const existingStatus =
                existingEnrollment.status;

            const existingPaymentStatus =
                existingEnrollment.paymentStatus;

            // =================================================
            // PENDING + UNPAID
            //
            // This is NOT a new enrollment.
            // The user should continue to payment.
            // =================================================

            if (
                existingStatus === "pending" &&
                existingPaymentStatus === "unpaid"
            ) {
                return NextResponse.json(
                    {
                        success: true,

                        requiresPayment: true,

                        alreadyEnrolled: true,

                        message:
                            "Enrollment already exists. Payment is required to continue.",

                        enrollment: {
                            _id:
                                existingEnrollment._id?.toString(),

                            userId:
                                existingEnrollment.userId.toString(),

                            courseId:
                                existingEnrollment.courseId.toString(),

                            status:
                                existingEnrollment.status,

                            paymentStatus:
                                existingEnrollment.paymentStatus,

                            progress:
                                existingEnrollment.progress ?? 0,

                            completedLessons:
                                (
                                    existingEnrollment.completedLessons ??
                                    []
                                ).map((id) =>
                                    id.toString()
                                ),
                        },
                    },
                    {
                        status: 200,
                    }
                );
            }

            // =================================================
            // PENDING + PAYMENT PENDING
            // =================================================

            if (
                existingStatus === "pending" &&
                existingPaymentStatus === "pending"
            ) {
                return NextResponse.json(
                    {
                        success: true,

                        requiresPayment: true,

                        alreadyEnrolled: true,

                        paymentProcessing: true,

                        message:
                            "A payment is already being processed for this enrollment.",

                        enrollment:
                            serializeEnrollment(
                                existingEnrollment
                            ),
                    },
                    {
                        status: 200,
                    }
                );
            }

            // =================================================
            // ACTIVE + PAID
            // =================================================

            if (
                existingStatus === "active" &&
                existingPaymentStatus === "paid"
            ) {
                return NextResponse.json(
                    {
                        success: true,

                        alreadyEnrolled: true,

                        message:
                            "You are already enrolled in this course.",

                        enrollment:
                            serializeEnrollment(
                                existingEnrollment
                            ),
                    },
                    {
                        status: 200,
                    }
                );
            }

            // =================================================
            // COMPLETED
            // =================================================

            if (
                existingStatus === "completed"
            ) {
                return NextResponse.json(
                    {
                        success: true,

                        alreadyEnrolled: true,

                        completed: true,

                        message:
                            "You have already completed this course.",

                        enrollment:
                            serializeEnrollment(
                                existingEnrollment
                            ),
                    },
                    {
                        status: 200,
                    }
                );
            }

            // =================================================
            // FALLBACK FOR ANY OTHER EXISTING RECORD
            // =================================================

            return NextResponse.json(
                {
                    success: true,

                    alreadyEnrolled: true,

                    message:
                        "You are already enrolled in this course.",

                    enrollment:
                        serializeEnrollment(
                            existingEnrollment
                        ),
                },
                {
                    status: 200,
                }
            );
        }

        // =====================================================
        // COURSE PRICE
        // =====================================================

        const price = Number(course.price ?? 0);

        const isFree = price <= 0;

        // =====================================================
        // CREATE NEW ENROLLMENT
        // =====================================================

        const now = new Date();

        const enrollment: EnrollmentDoc = {
            userId: new ObjectId(user.id),

            courseId: courseObjectId,

            status: isFree
                ? "active"
                : "pending",

            paymentStatus: isFree
                ? "paid"
                : "unpaid",

            progress: 0,

            completedLessons: [],

            enrolledAt: now,

            completedAt: null,
        };

        const result =
            await enrollments.insertOne(
                enrollment
            );

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json(
            {
                success: true,

                requiresPayment: !isFree,

                alreadyEnrolled: false,

                message: isFree
                    ? "Successfully enrolled in the course."
                    : "Enrollment created. Payment is required to access the course.",

                enrollment: {
                    _id:
                        result.insertedId.toString(),

                    userId: user.id,

                    courseId,

                    status:
                        enrollment.status,

                    paymentStatus:
                        enrollment.paymentStatus,

                    progress: 0,

                    completedLessons: [],

                    enrolledAt:
                        now.toISOString(),

                    completedAt: null,
                },
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/enrollments error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create enrollment.",
            },
            {
                status: 500,
            }
        );
    }
}

