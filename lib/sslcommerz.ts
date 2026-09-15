import "server-only";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getPaymentsCollection } from "@/lib/payments";

interface SSLValidationResponse {
  status?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  currency?: string;
  bank_tran_id?: string;
  card_type?: string;
  card_brand?: string;
  card_issuer?: string;
  risk_level?: string;
  risk_title?: string;
  validated_on?: string;
  APIConnect?: string;

  [key: string]: unknown;
}

function getSSLValidationUrl() {
  const isLive =
    process.env.SSLCOMMERZ_IS_LIVE === "true";

  return isLive
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
}

function getStoreCredentials() {
  const storeId =
    process.env.SSLCOMMERZ_STORE_ID?.trim();

  const storePassword =
    process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();

  if (!storeId || !storePassword) {
    throw new Error(
      "SSLCOMMERZ_STORE_ID or SSLCOMMERZ_STORE_PASSWORD is missing."
    );
  }

  return {
    storeId,
    storePassword,
  };
}

export async function validateSSLCommerzTransaction(
  valId: string
): Promise<SSLValidationResponse> {
  const cleanValId = valId.trim();

  if (!cleanValId) {
    throw new Error("SSLCOMMERZ validation ID is missing.");
  }

  const {
    storeId,
    storePassword,
  } = getStoreCredentials();

  const validationUrl =
    getSSLValidationUrl();

  const url = new URL(validationUrl);

  url.searchParams.set(
    "val_id",
    cleanValId
  );

  url.searchParams.set(
    "store_id",
    storeId
  );

  url.searchParams.set(
    "store_passwd",
    storePassword
  );

  url.searchParams.set(
    "format",
    "json"
  );

  url.searchParams.set(
    "v",
    "1"
  );

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `SSLCOMMERZ validation API returned HTTP ${response.status}.`
    );
  }

  const data =
    (await response.json()) as SSLValidationResponse;

  return data;
}

function normalizeAmount(
  value: unknown
) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return Number(amount.toFixed(2));
}

export async function completeSSLCommerzPayment(
  tranId: string,
  valId: string
) {
  const cleanTranId = tranId.trim();
  const cleanValId = valId.trim();

  if (!cleanTranId) {
    throw new Error(
      "Transaction ID is missing."
    );
  }

  if (!cleanValId) {
    throw new Error(
      "Validation ID is missing."
    );
  }

  const payments =
    await getPaymentsCollection();

  const payment =
    await payments.findOne({
      transactionId: cleanTranId,
    });

  if (!payment) {
    throw new Error(
      "Payment record was not found."
    );
  }

  /*
   * Already paid:
   * IPN এবং success callback একই transaction-এর জন্য
   * একাধিকবার আসতে পারে।
   *
   * তাই আবার gateway call না করেও success return করা যায়।
   */
  if (payment.status === "paid") {
    return {
      success: true,
      alreadyPaid: true,
      payment,
    };
  }

  const validation =
    await validateSSLCommerzTransaction(
      cleanValId
    );

  const validationStatus =
    String(validation.status || "")
      .trim()
      .toUpperCase();

  /*
   * SSLCOMMERZ documentation অনুযায়ী:
   * VALID = successful
   * VALIDATED = already validated
   */
  if (
    validationStatus !== "VALID" &&
    validationStatus !== "VALIDATED"
  ) {
    await payments.updateOne(
      {
        _id: payment._id,
      },
      {
        $set: {
          status:
            validationStatus === "FAILED"
              ? "failed"
              : "pending",

          validationId:
            validation.val_id ||
            cleanValId,

          updatedAt: new Date(),
        },
      }
    );

    throw new Error(
      `SSLCOMMERZ validation failed. Status: ${validationStatus || "UNKNOWN"}`
    );
  }

  /*
   * 1. Transaction ID verify
   */
  if (
    String(validation.tran_id || "") !==
    cleanTranId
  ) {
    throw new Error(
      "Transaction ID mismatch."
    );
  }

  /*
   * 2. Validation ID verify
   */
  if (
    validation.val_id &&
    String(validation.val_id) !==
      cleanValId
  ) {
    throw new Error(
      "Validation ID mismatch."
    );
  }

  /*
   * 3. Amount verify
   */
  const gatewayAmount =
    normalizeAmount(validation.amount);

  const databaseAmount =
    normalizeAmount(payment.amount);

  if (
    gatewayAmount === null ||
    databaseAmount === null
  ) {
    throw new Error(
      "Invalid payment amount."
    );
  }

  if (
    gatewayAmount !== databaseAmount
  ) {
    throw new Error(
      `Payment amount mismatch. Expected ${databaseAmount}, received ${gatewayAmount}.`
    );
  }

  /*
   * 4. Currency verify
   */
  const gatewayCurrency =
    String(validation.currency || "")
      .trim()
      .toUpperCase();

  const databaseCurrency =
    String(payment.currency || "BDT")
      .trim()
      .toUpperCase();

  if (
    gatewayCurrency !== databaseCurrency
  ) {
    throw new Error(
      `Payment currency mismatch. Expected ${databaseCurrency}, received ${gatewayCurrency}.`
    );
  }

  /*
   * 5. Risk payment
   *
   * SSLCOMMERZ recommends holding risky
   * transactions for verification.
   */
  const riskLevel =
    String(
      validation.risk_level ?? "0"
    );

  if (riskLevel === "1") {
    await payments.updateOne(
      {
        _id: payment._id,
      },
      {
        $set: {
          status: "pending",
          validationId:
            validation.val_id ||
            cleanValId,
          updatedAt: new Date(),
        },
      }
    );

    throw new Error(
      "Payment is marked as a risky transaction and requires manual verification."
    );
  }

  const client =
    await clientPromise;

  const db =
    client.db("next-auth");

  const enrollments =
    db.collection("enrollments");

  const now = new Date();

  /*
   * 6. Mark payment as paid
   */
  await payments.updateOne(
    {
      _id: payment._id,
    },
    {
      $set: {
        status: "paid",

        validationId:
          validation.val_id ||
          cleanValId,

        bankTransactionId:
          validation.bank_tran_id || null,

        cardType:
          validation.card_type || null,

        cardBrand:
          validation.card_brand || null,

        cardIssuer:
          validation.card_issuer || null,

        riskLevel:
          riskLevel,

        riskTitle:
          validation.risk_title || null,

        validatedAt:
          validation.validated_on
            ? new Date(validation.validated_on)
            : now,

        paidAt: now,

        updatedAt: now,
      },
    }
  );

  /*
   * 7. Activate enrollment
   *
   * Payment paid হওয়ার পরই course active হবে।
   */
  if (
    payment.enrollmentId &&
    ObjectId.isValid(
      payment.enrollmentId
    )
  ) {
    await enrollments.updateOne(
      {
        _id:
          payment.enrollmentId,
      },
      {
        $set: {
          status: "active",
          paymentStatus: "paid",
          updatedAt: now,
        },
      }
    );
  } else {
    /*
     * Fallback:
     * যদি enrollmentId ObjectId না হয়,
     * userId + courseId দিয়ে enrollment খুঁজবে।
     */
    await enrollments.updateOne(
      {
        userId:
          payment.userId,
        courseId:
          payment.courseId,
      },
      {
        $set: {
          status: "active",
          paymentStatus: "paid",
          updatedAt: now,
        },
      }
    );
  }

  return {
    success: true,
    alreadyPaid: false,
    payment: {
      _id: payment._id,
      transactionId:
        cleanTranId,
      amount:
        databaseAmount,
      currency:
        databaseCurrency,
      status: "paid",
    },
    validation,
  };
}