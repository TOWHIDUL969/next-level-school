
import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    completeSSLCommerzPayment,
} from "@/lib/sslcommerz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const tranId = String(
            formData.get("tran_id") ?? ""
        ).trim();

        const valId = String(
            formData.get("val_id") ?? ""
        ).trim();

        const status = String(
            formData.get("status") ?? ""
        ).trim().toUpperCase();

        if (!tranId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Transaction ID is missing.",
                },
                { status: 400 }
            );
        }

        console.info("SSLCOMMERZ IPN received", {
            transactionId: tranId,
            status,
            hasValidationId: Boolean(valId),
        });

        // Only attempt completion for potentially successful
        // transactions. The server-side validation API remains
        // the authority for payment status and amount.
        if (
            status === "SUCCESS" ||
            status === "VALID" ||
            status === "VALIDATED"
        ) {
            if (!valId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Validation ID is missing.",
                    },
                    { status: 400 }
                );
            }

            const result =
                await completeSSLCommerzPayment(
                    tranId,
                    valId
                );

            return NextResponse.json(
                {
                    success: true,
                    message: result.alreadyPaid
                        ? "Payment was already processed."
                        : "Payment verified and processed.",
                    transactionId: tranId,
                    status: "paid",
                },
                { status: 200 }
            );
        }

        // A negative or pending IPN is not proof that a payment
        // should be marked failed. It must not activate enrollment.
        if (
            status === "FAILED" ||
            status === "CANCELLED" ||
            status === "UNATTEMPTED" ||
            status === "EXPIRED" ||
            status === "PENDING"
        ) {
            console.info("SSLCOMMERZ non-success IPN received", {
                transactionId: tranId,
                status,
            });

            return NextResponse.json(
                {
                    success: true,
                    message: "Notification received; no payment activation performed.",
                    transactionId: tranId,
                    status,
                },
                { status: 200 }
            );
        }

        // Unknown statuses are acknowledged but never treated as paid.
        console.warn("Unknown SSLCOMMERZ IPN status", {
            transactionId: tranId,
            status: status || "EMPTY",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Notification received; no final action taken.",
                transactionId: tranId,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("SSLCOMMERZ IPN processing failed", error);

        return NextResponse.json(
            {
                success: false,
                message: "IPN processing failed. Please retry notification processing.",
            },
            { status: 500 }
        );
    }
}
