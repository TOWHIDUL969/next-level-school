
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
    return handleCancel(request);
}

export async function GET(request: NextRequest) {
    return handleCancel(request);
}

async function handleCancel(request: NextRequest) {
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

        // Only transition pending payments to cancelled.
        // Never overwrite paid or another final status.
        if (payment.status === "pending") {
            await payments.updateOne(
                {
                    _id: payment._id,
                    status: "pending",
                },
                {
                    $set: {
                        status: "cancelled",
                        updatedAt: new Date(),
                    },
                }
            );
        }

        // Check the latest database status in case another
        // callback processed this transaction concurrently.
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

        let displayStatus: string;

        if (finalStatus === "paid") {
            displayStatus = "success";
        } else if (finalStatus === "cancelled") {
            displayStatus = "cancelled";
        } else if (finalStatus === "failed") {
            displayStatus = "failed";
        } else {
            displayStatus = "pending";
        }

        redirectUrl.searchParams.set(
            "payment",
            displayStatus
        );

        redirectUrl.searchParams.set(
            "tran_id",
            tranId
        );

        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error(
            "SSLCOMMERZ cancel callback error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Cancelled payment callback processing error.",
            },
            { status: 500 }
        );
    }
}
