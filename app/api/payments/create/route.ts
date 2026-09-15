
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { getCoursesCollection } from "@/lib/courses";

export const runtime = "nodejs";

function getSSLCommerzConfig() {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

    if (!storeId || !storePassword) {
        throw new Error(
            "SSLCOMMERZ_STORE_ID or SSLCOMMERZ_STORE_PASSWORD is missing."
        );
    }

    const gatewayUrl = isLive
        ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
        : "https://sandbox-gw.sslcommerz.com/gwprocess/v4/api.php";

    return {
        storeId,
        storePassword,
        gatewayUrl,
    };
}

function getAppUrl() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
        throw new Error("NEXT_PUBLIC_APP_URL is missing.");
    }

    return appUrl.replace(/\/+$/, "");
}

export async function POST(request: NextRequest) {
    try {
        // =========================================================
        // 1. AUTHENTICATION
        // =========================================================

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required.",
                },
                {
                    status: 401,
                }
            );
        }

        // =========================================================
        // 2. READ REQUEST BODY
        // =========================================================

        const body = await request.json();

        const courseId =
            typeof body?.courseId === "string"
                ? body.courseId.trim()
                : "";

        const enrollmentId =
            typeof body?.enrollmentId === "string"
                ? body.enrollmentId.trim()
                : "";

        if (!courseId || !ObjectId.isValid(courseId)) {
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

        if (!enrollmentId || !ObjectId.isValid(enrollmentId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid enrollment ID.",
                },
                {
                    status: 400,
                }
            );
        }

        // =========================================================
        // 3. DATABASE
        // =========================================================

        const client = await clientPromise;
        const db = client.db("next-auth");

        const courses = await getCoursesCollection();

        const course = await courses.findOne({
            _id: new ObjectId(courseId),
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

        // =========================================================
        // 4. CHECK COURSE STATUS
        // =========================================================

        if (course.status !== "published") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This course is not available for enrollment.",
                },
                {
                    status: 400,
                }
            );
        }

        // =========================================================
        // 5. CHECK COURSE PRICE
        // =========================================================

        const amount = Number(course.price ?? 0);

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This course does not have a valid payment amount.",
                },
                {
                    status: 400,
                }
            );
        }

        // =========================================================
        // 6. FIND ENROLLMENT
        // =========================================================

        const enrollment = await db.collection("enrollments").findOne({
            _id: new ObjectId(enrollmentId),
            userId: new ObjectId(user.id),
            courseId: new ObjectId(courseId),
        });

        if (!enrollment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Enrollment not found.",
                },
                {
                    status: 404,
                }
            );
        }

        // =========================================================
        // 7. CHECK EXISTING PAYMENT
        // =========================================================

        const payments = db.collection("payments");

        const existingPayment = await payments.findOne({
            enrollmentId: new ObjectId(enrollmentId),
            userId: new ObjectId(user.id),
            courseId: new ObjectId(courseId),
            status: {
                $in: ["pending", "paid"],
            },
        });

        if (existingPayment?.status === "paid") {
            return NextResponse.json(
                {
                    success: false,
                    message: "This enrollment has already been paid.",
                },
                {
                    status: 409,
                }
            );
        }

        // =========================================================
        // 8. SSL COMMERZ CONFIG
        // =========================================================

        const {
            storeId,
            storePassword,
            gatewayUrl,
        } = getSSLCommerzConfig();

        const appUrl = getAppUrl();

        // =========================================================
        // 9. GENERATE TRANSACTION ID
        // =========================================================

        const transactionId =
            `NLS_${Date.now()}_` +
            crypto.randomBytes(5).toString("hex");

        const now = new Date();

        // =========================================================
        // 10. CREATE PAYMENT RECORD
        // =========================================================

        const paymentDocument = {
            userId: new ObjectId(user.id),
            courseId: new ObjectId(courseId),
            enrollmentId: new ObjectId(enrollmentId),

            transactionId,

            amount,
            currency: "BDT",

            status: "pending",
            gateway: "sslcommerz",

            sessionKey: null,
            validationId: null,

            bankTransactionId: null,
            cardType: null,
            cardBrand: null,
            cardIssuer: null,

            riskLevel: null,
            riskTitle: null,

            createdAt: now,
            updatedAt: now,
            paidAt: null,
        };

        const paymentResult = await payments.insertOne(
            paymentDocument
        );

        // =========================================================
        // 11. UPDATE ENROLLMENT PAYMENT STATUS
        // =========================================================

        await db.collection("enrollments").updateOne(
            {
                _id: new ObjectId(enrollmentId),
                userId: new ObjectId(user.id),
                courseId: new ObjectId(courseId),
            },
            {
                $set: {
                    paymentStatus: "pending",
                    updatedAt: now,
                },
            }
        );

        // =========================================================
        // 12. SSL COMMERZ CALLBACK URLS
        // =========================================================

        const successUrl =
            `${appUrl}/api/payments/sslcommerz/success`;

        const failUrl =
            `${appUrl}/api/payments/sslcommerz/fail`;

        const cancelUrl =
            `${appUrl}/api/payments/sslcommerz/cancel`;

        const ipnUrl =
            `${appUrl}/api/payments/sslcommerz/ipn`;

        // =========================================================
        // 13. CUSTOMER INFORMATION
        // =========================================================

        const customerName =
            typeof user.name === "string" && user.name.trim()
                ? user.name.trim()
                : "NLS Student";

        const customerEmail =
            typeof user.email === "string" && user.email.trim()
                ? user.email.trim()
                : "customer@example.com";

        const customerPhone =
            typeof user.phone === "string" && user.phone.trim()
                ? user.phone.trim()
                : "01700000000";

        // =========================================================
        // 14. PREPARE SSL COMMERZ REQUEST
        // =========================================================

        const formData = new URLSearchParams();

        formData.set("store_id", storeId);
        formData.set("store_passwd", storePassword);

        formData.set("total_amount", amount.toFixed(2));
        formData.set("currency", "BDT");

        formData.set("tran_id", transactionId);

        formData.set("success_url", successUrl);
        formData.set("fail_url", failUrl);
        formData.set("cancel_url", cancelUrl);
        formData.set("ipn_url", ipnUrl);

        formData.set("cus_name", customerName);
        formData.set("cus_email", customerEmail);
        formData.set("cus_add1", "Bangladesh");
        formData.set("cus_city", "Dhaka");
        formData.set("cus_state", "Dhaka");
        formData.set("cus_postcode", "1200");
        formData.set("cus_country", "Bangladesh");
        formData.set("cus_phone", customerPhone);

        formData.set("shipping_method", "NO");
        formData.set("num_of_item", "1");

        formData.set("product_name", course.title);
        formData.set("product_category", "Education");
        formData.set("product_profile", "non-physical-goods");

        formData.set("product_amount", amount.toFixed(2));
        formData.set("vat", "0");
        formData.set("discount_amount", "0");
        formData.set("emi_option", "0");

        // =========================================================
        // 15. SEND REQUEST TO SSL COMMERZ
        // =========================================================

        const sslResponse = await fetch(gatewayUrl, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
            cache: "no-store",
        });

        const responseText = await sslResponse.text();

        let sslData: Record<string, unknown>;

        try {
            sslData = JSON.parse(responseText);
        } catch {
            console.error(
                "Invalid SSLCommerz response:",
                responseText
            );

            await payments.updateOne(
                {
                    _id: paymentResult.insertedId,
                },
                {
                    $set: {
                        status: "failed",
                        updatedAt: new Date(),
                    },
                }
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid response received from payment gateway.",
                },
                {
                    status: 502,
                }
            );
        }

        // =========================================================
        // 16. CHECK SSL COMMERZ RESPONSE
        // =========================================================

        const status =
            typeof sslData.status === "string"
                ? sslData.status
                : "";

        const sessionKey =
            typeof sslData.sessionkey === "string"
                ? sslData.sessionkey
                : "";

        const gatewayUrlFromResponse =
            typeof sslData.GatewayPageURL === "string"
                ? sslData.GatewayPageURL
                : "";

        const gatewayUrlLower =
            typeof sslData.GatewayPageURL === "string"
                ? sslData.GatewayPageURL
                : "";

        if (
            status !== "SUCCESS" ||
            !sessionKey ||
            !gatewayUrlLower
        ) {
            console.error(
                "SSLCommerz payment initialization failed:",
                sslData
            );

            await payments.updateOne(
                {
                    _id: paymentResult.insertedId,
                },
                {
                    $set: {
                        status: "failed",
                        updatedAt: new Date(),
                    },
                }
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        typeof sslData.failedreason === "string"
                            ? sslData.failedreason
                            : "Unable to initialize SSLCommerz payment.",
                },
                {
                    status: 502,
                }
            );
        }

        // =========================================================
        // 17. SAVE SESSION KEY
        // =========================================================

        await payments.updateOne(
            {
                _id: paymentResult.insertedId,
            },
            {
                $set: {
                    sessionKey,
                    updatedAt: new Date(),
                },
            }
        );

        // =========================================================
        // 18. RETURN GATEWAY URL
        // =========================================================

        return NextResponse.json(
            {
                success: true,
                message: "Payment initialized successfully.",
                paymentId: paymentResult.insertedId.toString(),
                transactionId,
                sessionKey,
                gatewayUrl: gatewayUrlFromResponse,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "SSLCommerz payment creation error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to create payment.",
            },
            {
                status: 500,
            }
        );
    }
}

