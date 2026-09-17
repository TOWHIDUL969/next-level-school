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
    updatedAt?: Date;
}

interface LessonDoc {
    _id: ObjectId;
    courseId: ObjectId;
    moduleId: ObjectId;
    title: string;
    status?: "published" | "draft";
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
                enrollment:
                    serializeEnrollment(enrollment),
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

        if (
            !courseId ||
            !ObjectId.isValid(courseId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Valid course ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const courseObjectId =
            new ObjectId(courseId);

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
                ) => Promise<
                    WithId<CourseDoc> | null
                >;
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
            // FALLBACK
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

        const price = Number(
            course.price ?? 0
        );

        const isFree = price <= 0;

        // =====================================================
        // CREATE NEW ENROLLMENT
        // =====================================================

        const now = new Date();

        const enrollment: EnrollmentDoc = {
            userId:
                new ObjectId(user.id),

            courseId:
                courseObjectId,

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

                requiresPayment:
                    !isFree,

                alreadyEnrolled: false,

                message: isFree
                    ? "Successfully enrolled in the course."
                    : "Enrollment created. Payment is required to access the course.",

                enrollment: {
                    _id:
                        result.insertedId.toString(),

                    userId:
                        user.id,

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

// =========================================================
// PATCH - COMPLETE LESSON / UPDATE COURSE PROGRESS
// =========================================================

export async function PATCH(
    request: NextRequest
) {
    try {
        // =====================================================
        // AUTHENTICATED USER
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
        // REQUEST BODY
        // =====================================================

        const body = await request.json();

        const courseId =
            typeof body?.courseId === "string"
                ? body.courseId.trim()
                : "";

        const lessonId =
            typeof body?.lessonId === "string"
                ? body.lessonId.trim()
                : "";

        const action =
            typeof body?.action === "string"
                ? body.action.trim()
                : "";

        if (
            !courseId ||
            !ObjectId.isValid(courseId) ||
            !lessonId ||
            !ObjectId.isValid(lessonId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Valid course ID and lesson ID are required.",
                },
                {
                    status: 400,
                }
            );
        }

        if (action !== "complete") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid enrollment action.",
                },
                {
                    status: 400,
                }
            );
        }

        const courseObjectId =
            new ObjectId(courseId);

        const lessonObjectId =
            new ObjectId(lessonId);

        const userObjectId =
            new ObjectId(user.id);

        // =====================================================
        // DATABASE
        // =====================================================

        const client = await clientPromise;
        const db = client.db("next-auth");

        const enrollments =
            db.collection<EnrollmentDoc>(
                "enrollments"
            );

        const lessons =
            db.collection<LessonDoc>(
                "lessons"
            );

        // =====================================================
        // VERIFY LESSON BELONGS TO COURSE
        // ONLY PUBLISHED LESSONS CAN BE COMPLETED
        // =====================================================

        const lesson =
            await lessons.findOne({
                _id: lessonObjectId,
                courseId: courseObjectId,
                status: "published",
            });

        if (!lesson) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Published lesson does not belong to this course.",
                },
                {
                    status: 404,
                }
            );
        }

        // =====================================================
        // FIND USER ENROLLMENT
        // =====================================================

        const enrollment =
            await enrollments.findOne({
                userId: userObjectId,
                courseId: courseObjectId,
            });

        if (!enrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You are not enrolled in this course.",
                },
                {
                    status: 403,
                }
            );
        }

        // =====================================================
        // VERIFY PAYMENT / ACCESS
        // =====================================================

        const hasAccess =
            (
                enrollment.status === "active" &&
                enrollment.paymentStatus === "paid"
            ) ||
            enrollment.status === "completed";

        if (!hasAccess) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "You do not have access to this course.",
                },
                {
                    status: 403,
                }
            );
        }

        // =====================================================
        // TOTAL PUBLISHED COURSE LESSONS
        // =====================================================

        const totalLessons =
            await lessons.countDocuments({
                courseId: courseObjectId,
                status: "published",
            });

        if (totalLessons <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "No published lessons were found for this course.",
                },
                {
                    status: 400,
                }
            );
        }

        // =====================================================
        // CURRENT COMPLETED LESSONS
        // =====================================================

        const currentCompletedLessons =
            enrollment.completedLessons ?? [];

        const completedSet =
            new Set(
                currentCompletedLessons.map(
                    (id) => id.toString()
                )
            );

        // =====================================================
        // ALREADY COMPLETED
        // =====================================================

        if (
            completedSet.has(
                lessonObjectId.toString()
            )
        ) {
            const completedCount =
                completedSet.size;

            const progress =
                Math.min(
                    100,
                    Math.round(
                        (completedCount /
                            totalLessons) *
                            100
                    )
                );

            const courseCompleted =
                completedCount >=
                totalLessons;

            // Make sure database status is correct
            if (
                courseCompleted &&
                enrollment.status !== "completed"
            ) {
                const now = new Date();

                await enrollments.updateOne(
                    {
                        _id: enrollment._id,
                        userId: userObjectId,
                        courseId: courseObjectId,
                    },
                    {
                        $set: {
                            progress: 100,
                            status: "completed",
                            completedAt: now,
                            updatedAt: now,
                        },
                    }
                );
            }

            const finalEnrollment =
                await enrollments.findOne({
                    _id: enrollment._id,
                });

            if (!finalEnrollment) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Failed to fetch enrollment.",
                    },
                    {
                        status: 500,
                    }
                );
            }

            return NextResponse.json({
                success: true,
                alreadyCompleted: true,
                lessonCompleted: true,
                progress,
                courseCompleted,

                completedLessons:
                    (
                        finalEnrollment.completedLessons ??
                        []
                    ).map((id) =>
                        id.toString()
                    ),

                enrollment:
                    serializeEnrollment(
                        finalEnrollment
                    ),
            });
        }

        // =====================================================
        // ADD LESSON TO COMPLETED LESSONS
        // =====================================================

        const now = new Date();

        await enrollments.updateOne(
            {
                _id: enrollment._id,
                userId: userObjectId,
                courseId: courseObjectId,
            },
            {
                $addToSet: {
                    completedLessons:
                        lessonObjectId,
                },
                $set: {
                    updatedAt: now,
                },
            }
        );

        // =====================================================
        // GET UPDATED ENROLLMENT
        // =====================================================

        const updatedEnrollment =
            await enrollments.findOne({
                _id: enrollment._id,
            });

        if (!updatedEnrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to update enrollment.",
                },
                {
                    status: 500,
                }
            );
        }

        // =====================================================
        // CALCULATE PROGRESS
        // =====================================================

        const uniqueCompletedLessons =
            new Set(
                (
                    updatedEnrollment.completedLessons ??
                    []
                ).map((id) =>
                    id.toString()
                )
            );

        const completedCount =
            uniqueCompletedLessons.size;

        const progress =
            Math.min(
                100,
                Math.round(
                    (completedCount /
                        totalLessons) *
                        100
                )
            );

        const courseCompleted =
            completedCount >=
            totalLessons;

        // =====================================================
        // UPDATE COURSE STATUS
        // =====================================================

        await enrollments.updateOne(
            {
                _id: enrollment._id,
                userId: userObjectId,
                courseId: courseObjectId,
            },
            {
                $set: {
                    progress,

                    status:
                        courseCompleted
                            ? "completed"
                            : "active",

                    completedAt:
                        courseCompleted
                            ? now
                            : null,

                    updatedAt: now,
                },
            }
        );

        // =====================================================
        // FINAL ENROLLMENT
        // =====================================================

        const finalEnrollment =
            await enrollments.findOne({
                _id: enrollment._id,
            });

        if (!finalEnrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to fetch updated enrollment.",
                },
                {
                    status: 500,
                }
            );
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,

            message: courseCompleted
                ? "Congratulations! You have completed the course."
                : "Lesson completed successfully.",

            lessonCompleted: true,

            courseCompleted,

            progress,

            completedLessons:
                (
                    finalEnrollment.completedLessons ??
                    []
                ).map((id) =>
                    id.toString()
                ),

            enrollment:
                serializeEnrollment(
                    finalEnrollment
                ),
        });
    } catch (error) {
        console.error(
            "PATCH /api/enrollments error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update lesson progress.",
            },
            {
                status: 500,
            }
        );
    }
}