import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  completeSSLCommerzPayment,
} from "@/lib/sslcommerz";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
) {
  try {
    const formData =
      await request.formData();

    const tranId =
      String(
        formData.get("tran_id") || ""
      );

    const valId =
      String(
        formData.get("val_id") || ""
      );

    const status =
      String(
        formData.get("status") || ""
      )
        .trim()
        .toUpperCase();

    const amount =
      String(
        formData.get("amount") || ""
      );

    const currency =
      String(
        formData.get("currency") || ""
      )
        .trim()
        .toUpperCase();

    console.log(
      "SSLCOMMERZ IPN received:",
      {
        tranId,
        valId,
        status,
        amount,
        currency,
      }
    );

    if (!tranId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Transaction ID is missing.",
        },
        { status: 400 }
      );
    }

    /*
     * For successful IPN:
     * validate with SSLCOMMERZ.
     */
    if (
      status === "SUCCESS" ||
      status === "VALID"
    ) {
      if (!valId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Validation ID is missing.",
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
          message:
            result.alreadyPaid
              ? "Payment was already processed."
              : "Payment validated and completed.",
          transactionId: tranId,
        },
        { status: 200 }
      );
    }

    /*
     * Failed / cancelled / unattempted / expired
     * transactions should NOT activate enrollment.
     *
     * We don't mark anything paid here.
     */
    if (
      status === "FAILED" ||
      status === "CANCELLED" ||
      status === "UNATTEMPTED" ||
      status === "EXPIRED"
    ) {
      console.log(
        `SSLCOMMERZ IPN status: ${status}`,
        tranId
      );

      return NextResponse.json(
        {
          success: true,
          message:
            `Payment status received: ${status}`,
          transactionId: tranId,
        },
        { status: 200 }
      );
    }

    /*
     * Unknown/pending status:
     * keep payment pending.
     */
    return NextResponse.json(
      {
        success: true,
        message:
          "Payment notification received. No final action taken.",
        transactionId: tranId,
        status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "SSLCOMMERZ IPN processing error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "IPN processing failed.",
      },
      { status: 500 }
    );
  }
}