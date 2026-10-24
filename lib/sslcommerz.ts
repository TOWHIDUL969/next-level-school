
import "server-only";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getPaymentsCollection } from "@/lib/payments";

interface SSLValidationResponse {
    status?: string;
    tran_id?: string;
    val_id?: string;
    amount?: string;
    currency?: string;
    bank_tran_id?: string;
    card_type?: string;
    card_brand?: string;
    card_issuer?: string;
    risk_level?: string | number;
    risk_title?: string;
    validated_on?: string;
    APIConnect?: string;
    [key: string]: unknown;
}

function getSSLValidationUrl(): string {
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
            "SSLCOMMERZ store credentials are missing."
        );
    }

    return { storeId, storePassword };
}

export async function validateSSLCommerzTransaction(
    valId: string
): Promise<SSLValidationResponse> {
    const cleanValId = valId.trim();

    if (!cleanValId) {
        throw new Error(
            "SSLCOMMERZ validation ID is missing."
        );
    }

    const { storeId, storePassword } =
        getStoreCredentials();

    const url = new URL(getSSLValidationUrl());

    url.searchParams.set("val_id", cleanValId);
    url.searchParams.set("store_id", storeId);
    url.searchParams.set("store_passwd", storePassword);
    url.searchParams.set("format", "json");
    url.searchParams.set("v", "1");

    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        throw new Error(
            `SSLCOMMERZ validation API returned HTTP ${response.status}.`
        );
    }

    const data =
        (await response.json()) as SSLValidationResponse;

    return data;
}

function normalizeAmount(value: unknown): number | null {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return null;
    }

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount < 0) {
        return null;
    }

    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function toObjectId(value: unknown): ObjectId | null {
    if (value instanceof ObjectId) {
        return value;
    }

    if (
        typeof value === "string" &&
        ObjectId.isValid(value)
    ) {
        return new ObjectId(value);
    }

    return null;
}

async function activateVerifiedEnrollment(
    payment: Record<string, unknown>
) {
    const enrollmentId = toObjectId(payment.enrollmentId);
    const userId = toObjectId(payment.userId);
    const courseId = toObjectId(payment.courseId);

    if (!enrollmentId || !userId || !courseId) {
        throw new Error(
            "Payment has invalid enrollment, user, or course references."
        );
    }

    const client = await clientPromise;
    const db = client.db("next-auth");

    const result = await db.collection("enrollments").updateOne(
        {
            _id: enrollmentId,
            userId,
            courseId,
        },
        {
            $set: {
                status: "active",
                paymentStatus: "paid",
                updatedAt: new Date(),
            },
        }
    );

    if (result.matchedCount !== 1) {
        throw new Error(
            "The matching enrollment was not found. Payment requires reconciliation."
        );
    }
}

export async function completeSSLCommerzPayment(
    tranId: string,
    valId: string
) {
    const cleanTranId = tranId.trim();
    const cleanValId = valId.trim();

    if (!cleanTranId || !cleanValId) {
        throw new Error(
            "Transaction ID and validation ID are required."
        );
    }

    const payments = await getPaymentsCollection();

    const payment = await payments.findOne({
        transactionId: cleanTranId,
    });

    if (!payment) {
        throw new Error("Payment record was not found.");
    }

    // A previous callback may have marked the payment paid
    // before enrollment activation completed. Repair enrollment too.
    if (payment.status === "paid") {
        await activateVerifiedEnrollment(
            payment as Record<string, unknown>
        );

        return {
            success: true,
            alreadyPaid: true,
            status: "paid",
            payment,
        };
    }

    if (payment.status !== "pending") {
        throw new Error(
            `Payment cannot be completed from status "${payment.status}".`
        );
    }

    const validation =
        await validateSSLCommerzTransaction(cleanValId);

    const validationStatus =
        String(validation.status ?? "")
            .trim()
            .toUpperCase();

    if (
        validationStatus !== "VALID" &&
        validationStatus !== "VALIDATED"
    ) {
        throw new Error(
            `SSLCOMMERZ validation was unsuccessful: ${validationStatus || "UNKNOWN"}.`
        );
    }

    if (
        String(validation.tran_id ?? "") !== cleanTranId
    ) {
        throw new Error("Transaction ID mismatch.");
    }

    if (
        String(validation.val_id ?? "") !== cleanValId
    ) {
        throw new Error("Validation ID mismatch.");
    }

    const gatewayAmount = normalizeAmount(validation.amount);
    const databaseAmount = normalizeAmount(payment.amount);

    if (
        gatewayAmount === null ||
        databaseAmount === null ||
        gatewayAmount !== databaseAmount
    ) {
        throw new Error("Payment amount verification failed.");
    }

    const gatewayCurrency =
        String(validation.currency ?? "")
            .trim()
            .toUpperCase();

    const databaseCurrency =
        String(payment.currency ?? "BDT")
            .trim()
            .toUpperCase();

    if (
        !gatewayCurrency ||
        gatewayCurrency !== databaseCurrency
    ) {
        throw new Error("Payment currency verification failed.");
    }

    const riskLevel =
        String(validation.risk_level ?? "").trim();

    // Hold any unknown risk value as well as explicitly risky payments.
    if (riskLevel !== "0") {
        await payments.updateOne(
            {
                _id: payment._id,
                status: "pending",
            },
            {
                $set: {
                    validationId: cleanValId,
                    riskLevel: riskLevel || "unknown",
                    riskTitle: validation.risk_title ?? null,
                    updatedAt: new Date(),
                },
            }
        );

        throw new Error(
            "Payment is awaiting manual risk verification. Course access has not been granted."
        );
    }

    const now = new Date();

    // Only one concurrent callback can transition pending -> paid.
    const updateResult = await payments.updateOne(
        {
            _id: payment._id,
            status: "pending",
        },
        {
            $set: {
                status: "paid",
                validationId: cleanValId,
                bankTransactionId:
                    validation.bank_tran_id ?? null,
                cardType: validation.card_type ?? null,
                cardBrand: validation.card_brand ?? null,
                cardIssuer: validation.card_issuer ?? null,
                riskLevel,
                riskTitle: validation.risk_title ?? null,
                validatedAt: validation.validated_on
                    ? new Date(validation.validated_on)
                    : now,
                paidAt: now,
                updatedAt: now,
            },
        }
    );

    // If another callback already completed the transition,
    // confirm the stored state before repairing enrollment.
    if (updateResult.modifiedCount !== 1) {
        const latestPayment = await payments.findOne({
            _id: payment._id,
        });

        if (latestPayment?.status !== "paid") {
            throw new Error(
                "Payment state changed during verification. Please retry reconciliation."
            );
        }
    }

    // Do not grant access until the verified payment is stored.
    // If this fails, a subsequent callback can retry activation.
    await activateVerifiedEnrollment(
        payment as Record<string, unknown>
    );

    return {
        success: true,
        alreadyPaid: false,
        status: "paid",
        payment: {
            _id: payment._id,
            transactionId: cleanTranId,
            amount: databaseAmount,
            currency: databaseCurrency,
            status: "paid",
        },
    };
}
