import { NextRequest, NextResponse } from "next/server";

import { ObjectId } from "mongodb";

import { getCurrentUser } from "@/lib/auth";

import {
    getCertificatesCollection,
    serializeCertificate,
} from "@/lib/certificates";

export const runtime = "nodejs";

// =========================================================
// GET - CURRENT USER CERTIFICATES
// =========================================================

export async function GET(
    _request: NextRequest
) {
    try {
        // =====================================================
        // CHECK AUTHENTICATED USER
        // =====================================================

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                {
                    status: 401,
                }
            );
        }

        // =====================================================
        // VALIDATE USER ID
        // =====================================================

        if (!ObjectId.isValid(user.id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid user ID.",
                },
                {
                    status: 400,
                }
            );
        }

        const userObjectId =
            new ObjectId(user.id);

        // =====================================================
        // GET CERTIFICATES COLLECTION
        // =====================================================

        const certificates =
            await getCertificatesCollection();

        // =====================================================
        // FIND USER CERTIFICATES
        // =====================================================

        const userCertificates =
            await certificates
                .find({
                    userId: userObjectId,
                })
                .sort({
                    issuedAt: -1,
                })
                .toArray();

        // =====================================================
        // SERIALIZE CERTIFICATES
        // =====================================================

        const serializedCertificates =
            userCertificates.map(
                (certificate) =>
                    serializeCertificate(
                        certificate
                    )
            );

        // =====================================================
        // RESPONSE
        // =====================================================

        return NextResponse.json({
            success: true,

            certificates:
                serializedCertificates,

            total:
                serializedCertificates.length,
        });
    } catch (error) {
        console.error(
            "GET /api/certificates error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch certificates.",
            },
            {
                status: 500,
            }
        );
    }
}