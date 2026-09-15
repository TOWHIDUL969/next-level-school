import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getPaymentsCollection } from "@/lib/payments";

export const runtime = "nodejs";

async function getTransactionId(
  request: NextRequest
) {
  if (request.method === "GET") {
    const { searchParams } =
      new URL(request.url);

    return (
      searchParams.get("tran_id") ||
      ""
    );
  }

  const formData =
    await request.formData();

  return String(
    formData.get("tran_id") || ""
  );
}

export async function POST(
  request: NextRequest
) {
  return handleFail(request);
}

export async function GET(
  request: NextRequest
) {
  return handleFail(request);
}

async function handleFail(
  request: NextRequest
) {
  try {
    const tranId =
      await getTransactionId(
        request
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

    const payments =
      await getPaymentsCollection();

    const payment =
      await payments.findOne({
        transactionId: tranId,
      });

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment record not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Never overwrite a successfully paid payment
     * with failed status.
     */
    if (payment.status !== "paid") {
      await payments.updateOne(
        {
          _id: payment._id,
          status: {
            $ne: "paid",
          },
        },
        {
          $set: {
            status: "failed",
            updatedAt: new Date(),
          },
        }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const redirectUrl =
      new URL(
        `/checkout/${payment.courseId.toString()}`,
        appUrl
      );

    redirectUrl.searchParams.set(
      "payment",
      "failed"
    );

    redirectUrl.searchParams.set(
      "tran_id",
      tranId
    );

    return NextResponse.redirect(
      redirectUrl
    );
  } catch (error) {
    console.error(
      "SSLCOMMERZ fail callback error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed payment callback error.",
      },
      { status: 500 }
    );
  }
}