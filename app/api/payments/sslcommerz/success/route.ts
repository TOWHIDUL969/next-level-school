import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  completeSSLCommerzPayment,
} from "@/lib/sslcommerz";

import { getPaymentsCollection } from "@/lib/payments";

export const runtime = "nodejs";

async function getCallbackData(
  request: NextRequest
) {
  if (request.method === "GET") {
    const { searchParams } =
      new URL(request.url);

    return {
      tranId:
        searchParams.get("tran_id") ||
        "",
      valId:
        searchParams.get("val_id") ||
        "",
    };
  }

  const formData =
    await request.formData();

  return {
    tranId:
      String(
        formData.get("tran_id") || ""
      ),
    valId:
      String(
        formData.get("val_id") || ""
      ),
  };
}

export async function POST(
  request: NextRequest
) {
  return handleSuccess(request);
}

export async function GET(
  request: NextRequest
) {
  return handleSuccess(request);
}

async function handleSuccess(
  request: NextRequest
) {
  try {
    const {
      tranId,
      valId,
    } = await getCallbackData(
      request
    );

    if (!tranId || !valId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing transaction or validation ID.",
        },
        { status: 400 }
      );
    }

    const result =
      await completeSSLCommerzPayment(
        tranId,
        valId
      );

    /*
     * Payment record থেকে courseId বের করে
     * existing checkout page-এ ফেরত পাঠানো হচ্ছে।
     */
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
            "Payment record not found after validation.",
        },
        { status: 404 }
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
      "success"
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
      "SSLCOMMERZ success callback error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Payment validation failed.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}