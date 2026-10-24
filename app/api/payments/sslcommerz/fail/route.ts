
import {
    NextRequest,
    NextResponse,
} from "next/server";

import { getPaymentsCollection } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getTransactionId(
    request: NextRequest
): Promise<string> {
    if (request.method === "GET") {
        const { searchParams } = new URL(request.url);

        return (searchParams.get("tran_id") ?? "").trim();
    }

    const formData = await request.formData();

    return String(formData.get("tran_id") ?? "").trim();
}

export async function POST(request: NextRequest) {
    return handleFail(request);
}

export async function GET(request: NextRequest) {
    return handleFail(request);
}

async function handleFail(request: NextRequest) {
    try {
        const tranId = await getTransactionId(request);

        if (!tranId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Transaction ID is missing.",
                },
                { status: 400 }
            );
        }

        const payments = await getPaymentsCollection();

        const payment = await payments.findOne({
            transactionId: tranId,
        });

        if (!payment) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment record not found.",
                },
                { status: 404 }
            );
        }

        // Never downgrade a paid payment.
        // Only change a currently pending payment.
        if (payment.status === "pending") {
            await payments.updateOne(
                {
                    _id: payment._id,
                    status: "pending",
                },
                {
                    $set: {
                        status: "failed",
                        updatedAt: new Date(),
                    },
                }
            );
        }

        // Read the latest status to handle concurrent callbacks.
        const latestPayment = await payments.findOne({
            _id: payment._id,
        });

        const finalStatus =
            latestPayment?.status ?? payment.status;

        const appUrl =
            process.env.NEXT_PUBLIC_APP_URL?.trim() ||
            "http://localhost:3000";

        const redirectUrl = new URL(
            `/checkout/${payment.courseId.toString()}`,
            appUrl
        );

        // A delayed failure callback must not display failure
        // if another callback already confirmed the payment.
        redirectUrl.searchParams.set(
            "payment",
            finalStatus === "paid"
                ? "success"
                : finalStatus === "failed"
                    ? "failed"
                    : "pending"
        );

        redirectUrl.searchParams.set(
            "tran_id",
            tranId
        );

        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error(
            "SSLCOMMERZ fail callback error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed payment callback processing error.",
            },
            { status: 500 }
        );
    }
}
