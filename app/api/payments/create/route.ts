
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { getCoursesCollection } from "@/lib/courses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSSLCommerzConfig() {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

    if (!storeId || !storePassword) {
        throw new Error("SSLCOMMERZ credentials are not configured.");
    }

    return {
        storeId,
        storePassword,
        isLive,
        gatewayUrl: isLive
            ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
            : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        allowedHost: isLive
            ? "securepay.sslcommerz.com"
            : "sandbox.sslcommerz.com",
    };
}

function getAppUrl() {
    const value = process.env.NEXT_PUBLIC_APP_URL;

    if (!value) {
        throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
    }

    const url = new URL(value);

    if (
        url.protocol !== "https:" &&
        process.env.NODE_ENV === "production"
    ) {
        throw new Error("Production application URL must use HTTPS.");
    }

    if (url.username || url.password) {
        throw new Error("Invalid application URL configuration.");
    }

    return url.origin;
}

function jsonError(message: string, status: number) {
    return NextResponse.json(
        { success: false, message },
        { status }
    );
}

export async function POST(request: NextRequest) {
    let paymentId: ObjectId | null = null;
    let enrollmentObjectId: ObjectId | null = null;
    let userObjectId: ObjectId | null = null;
    let payments: ReturnType<
        Awaited<typeof clientPromise>["db"]
    > extends never ? never : any = null;

    try {
        // 1. Authenticate user
        const user = await getCurrentUser();

        if (!user) {
            return jsonError("Authentication required.", 401);
        }

        if (!user.id || !ObjectId.isValid(user.id)) {
            return jsonError("Invalid user account.", 401);
        }

        userObjectId = new ObjectId(user.id);

        // 2. Validate request body
        let body: {
            courseId?: unknown;
            enrollmentId?: unknown;
        };

        try {
            body = await request.json();
        } catch {
            return jsonError("Invalid request body.", 400);
        }

        const courseId =
            typeof body.courseId === "string"
                ? body.courseId.trim()
                : "";

        const enrollmentId =
            typeof body.enrollmentId === "string"
                ? body.enrollmentId.trim()
                : "";

        if (!ObjectId.isValid(courseId)) {
            return jsonError("Invalid course ID.", 400);
        }

        if (!ObjectId.isValid(enrollmentId)) {
            return jsonError("Invalid enrollment ID.", 400);
        }

        const courseObjectId = new ObjectId(courseId);
        enrollmentObjectId = new ObjectId(enrollmentId);

        // 3. Connect to database
        const client = await clientPromise;
        const db = client.db("next-auth");

        const paymentCollection = db.collection("payments");
        payments = paymentCollection;

        const enrollmentCollection = db.collection("enrollments");
        const courses = await getCoursesCollection();

        // 4. Fetch published course
        const course = await courses.findOne({
            _id: courseObjectId,
        });

        if (!course || course.status !== "published") {
            return jsonError(
                "This course is not available for enrollment.",
                404
            );
        }

        // 5. Use the database course price, not a client-supplied amount
        const amount = Number(course.price ?? 0);

        if (
            !Number.isFinite(amount) ||
            amount < 10 ||
            amount > 500000
        ) {
            return jsonError(
                "The course price is outside the supported payment range.",
                400
            );
        }

        const normalizedAmount = Number(amount.toFixed(2));

        // 6. Verify enrollment belongs to this user and course
        const enrollment = await enrollmentCollection.findOne({
            _id: enrollmentObjectId,
            userId: userObjectId,
            courseId: courseObjectId,
        });

        if (!enrollment) {
            return jsonError("Enrollment not found.", 404);
        }

        if (enrollment.paymentStatus === "paid") {
            return jsonError(
                "This enrollment has already been paid.",
                409
            );
        }

        // 7. Check existing payment attempts
        const existingPayment = await paymentCollection.findOne({
            enrollmentId: enrollmentObjectId,
            userId: userObjectId,
            courseId: courseObjectId,
            status: { $in: ["pending", "paid"] },
        });

        if (existingPayment?.status === "paid") {
            return jsonError(
                "This enrollment has already been paid.",
                409
            );
        }

        if (existingPayment?.status === "pending") {
            const createdAt = existingPayment.createdAt;
            const age =
                createdAt instanceof Date
                    ? Date.now() - createdAt.getTime()
                    : Number.POSITIVE_INFINITY;

            // Do not create multiple active attempts for a recent payment.
            if (age < 30 * 60 * 1000) {
                return jsonError(
                    "A payment attempt is already pending. Please wait for its status to resolve before trying again.",
                    409
                );
            }

            // Mark an old attempt as expired before allowing a retry.
            // The callback handlers must also refuse to activate an
            // enrollment from an expired/failed payment record.
            await paymentCollection.updateOne(
                {
                    _id: existingPayment._id,
                    status: "pending",
                    createdAt,
                },
                {
                    $set: {
                        status: "failed",
                        failureReason: "Payment attempt expired.",
                        updatedAt: new Date(),
                    },
                }
            );
        }

        // 8. Validate customer information
        const customerName =
            typeof user.name === "string" && user.name.trim()
                ? user.name.trim().slice(0, 50)
                : "";

        const customerEmail =
            typeof user.email === "string"
                ? user.email.trim().toLowerCase()
                : "";

        const customerPhone =
            typeof user.phone === "string"
                ? user.phone.trim()
                : "";

        if (
            !customerName ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
            !/^\+?[0-9][0-9\s-]{8,18}$/.test(customerPhone)
        ) {
            return jsonError(
                "Please update your profile with a valid name, email, and phone number before paying.",
                400
            );
        }

        // 9. Gateway configuration
        const config = getSSLCommerzConfig();
        const appUrl = getAppUrl();

        const transactionId =
            `NLS_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;

        const now = new Date();

        // 10. Create pending payment record
        const paymentDocument = {
            userId: userObjectId,
            courseId: courseObjectId,
            enrollmentId: enrollmentObjectId,

            transactionId,
            amount: normalizedAmount,
            currency: "BDT",

            status: "pending",
            gateway: "sslcommerz",

            sessionKey: null as string | null,
            validationId: null as string | null,

            bankTransactionId: null as string | null,
            cardType: null as string | null,
            cardBrand: null as string | null,
            cardIssuer: null as string | null,

            riskLevel: null as string | null,
            riskTitle: null as string | null,

            createdAt: now,
            updatedAt: now,
            paidAt: null as Date | null,
        };

        const inserted = await paymentCollection.insertOne(
            paymentDocument
        );

        paymentId = inserted.insertedId;

        // 11. Prepare gateway request
        const formData = new URLSearchParams();

        formData.set("store_id", config.storeId);
        formData.set("store_passwd", config.storePassword);

        formData.set("total_amount", normalizedAmount.toFixed(2));
        formData.set("currency", "BDT");
        formData.set("tran_id", transactionId);

        formData.set(
            "success_url",
            `${appUrl}/api/payments/sslcommerz/success`
        );
        formData.set(
            "fail_url",
            `${appUrl}/api/payments/sslcommerz/fail`
        );
        formData.set(
            "cancel_url",
            `${appUrl}/api/payments/sslcommerz/cancel`
        );
        formData.set(
            "ipn_url",
            `${appUrl}/api/payments/sslcommerz/ipn`
        );

        formData.set("cus_name", customerName);
        formData.set("cus_email", customerEmail);
        formData.set("cus_add1", "Bangladesh");
        formData.set("cus_city", "Melandaha");
        formData.set("cus_postcode", "2000");
        formData.set("cus_country", "Bangladesh");
        formData.set("cus_phone", customerPhone);

        formData.set("shipping_method", "NO");
        formData.set("num_of_item", "1");
        formData.set(
            "product_name",
            String(course.title || "NLS Course").slice(0, 255)
        );
        formData.set("product_category", "Education");
        formData.set("product_profile", "non-physical-goods");

        formData.set("product_amount", normalizedAmount.toFixed(2));
        formData.set("vat", "0");
        formData.set("discount_amount", "0");
        formData.set("emi_option", "0");

        // 12. Create SSLCOMMERZ session
        let response: Response;

        try {
            response = await fetch(config.gatewayUrl, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
                cache: "no-store",
                signal: AbortSignal.timeout(20000),
            });
        } catch {
            await paymentCollection.updateOne(
                { _id: paymentId, status: "pending" },
                {
                    $set: {
                        status: "failed",
                        failureReason: "Gateway connection failed.",
                        updatedAt: new Date(),
                    },
                }
            );

            await enrollmentCollection.updateOne(
                {
                    _id: enrollmentObjectId,
                    userId: userObjectId,
                    courseId: courseObjectId,
                    paymentStatus: "pending",
                },
                {
                    $set: {
                        paymentStatus: "unpaid",
                        updatedAt: new Date(),
                    },
                }
            );

            return jsonError(
                "Unable to connect to the payment gateway. Please try again.",
                502
            );
        }

        if (!response.ok) {
            throw new Error("SSLCOMMERZ returned an HTTP error.");
        }

        let sslData: Record<string, unknown>;

        try {
            sslData = await response.json();
        } catch {
            throw new Error("Invalid gateway response.");
        }

        const status =
            typeof sslData.status === "string"
                ? sslData.status
                : "";

        const sessionKey =
            typeof sslData.sessionkey === "string"
                ? sslData.sessionkey
                : "";

        const gatewayPageURL =
            typeof sslData.GatewayPageURL === "string"
                ? sslData.GatewayPageURL
                : typeof sslData.redirectGatewayURL === "string"
                    ? sslData.redirectGatewayURL
                    : "";

        if (status !== "SUCCESS" || !sessionKey || !gatewayPageURL) {
            await paymentCollection.updateOne(
                { _id: paymentId, status: "pending" },
                {
                    $set: {
                        status: "failed",
                        failureReason: "Session initialization failed.",
                        updatedAt: new Date(),
                    },
                }
            );

            await enrollmentCollection.updateOne(
                {
                    _id: enrollmentObjectId,
                    userId: userObjectId,
                    courseId: courseObjectId,
                    paymentStatus: "pending",
                },
                {
                    $set: {
                        paymentStatus: "unpaid",
                        updatedAt: new Date(),
                    },
                }
            );

            return jsonError(
                "Unable to initialize payment. Please try again.",
                502
            );
        }

        // 13. Only accept the expected official gateway host
        let parsedGatewayURL: URL;

        try {
            parsedGatewayURL = new URL(gatewayPageURL);
        } catch {
            throw new Error("Invalid gateway URL.");
        }

        if (
            parsedGatewayURL.protocol !== "https:" ||
            parsedGatewayURL.hostname !== config.allowedHost ||
            parsedGatewayURL.username ||
            parsedGatewayURL.password
        ) {
            throw new Error("Unexpected gateway URL.");
        }

        // 14. Save session and mark enrollment pending
        await paymentCollection.updateOne(
            { _id: paymentId, status: "pending" },
            {
                $set: {
                    sessionKey,
                    updatedAt: new Date(),
                },
            }
        );

        await enrollmentCollection.updateOne(
            {
                _id: enrollmentObjectId,
                userId: userObjectId,
                courseId: courseObjectId,
                paymentStatus: { $ne: "paid" },
            },
            {
                $set: {
                    paymentStatus: "pending",
                    updatedAt: new Date(),
                },
            }
        );

        // 15. Return the hosted payment URL
        return NextResponse.json({
            success: true,
            message: "Payment initialized successfully.",
            paymentId: paymentId.toString(),
            transactionId,
            sessionKey,
            gatewayUrl: parsedGatewayURL.toString(),
        });
    } catch (error) {
        console.error(
            "SSLCOMMERZ payment initialization failed:",
            error instanceof Error ? error.message : "Unknown error"
        );

        // Avoid leaving a failed initialization marked as pending.
        if (paymentId && payments) {
            try {
                await payments.updateOne(
                    { _id: paymentId, status: "pending" },
                    {
                        $set: {
                            status: "failed",
                            failureReason: "Payment initialization failed.",
                            updatedAt: new Date(),
                        },
                    }
                );

                if (enrollmentObjectId && userObjectId) {
                    const client = await clientPromise;
                    const db = client.db("next-auth");

                    await db.collection("enrollments").updateOne(
                        {
                            _id: enrollmentObjectId,
                            userId: userObjectId,
                            paymentStatus: "pending",
                        },
                        {
                            $set: {
                                paymentStatus: "unpaid",
                                updatedAt: new Date(),
                            },
                        }
                    );
                }
            } catch (cleanupError) {
                console.error(
                    "Payment failure cleanup failed:",
                    cleanupError instanceof Error
                        ? cleanupError.message
                        : "Unknown cleanup error"
                );
            }
        }

        return jsonError(
            "Unable to create payment. Please try again.",
            500
        );
    }
}
