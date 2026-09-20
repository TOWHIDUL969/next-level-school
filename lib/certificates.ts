import { ObjectId } from "mongodb";

import clientPromise from "./mongodb";

/* =========================================================
   CERTIFICATE DOCUMENT
========================================================= */

export interface CertificateDoc {
    _id?: ObjectId;

    certificateId: string;

    userId: ObjectId;

    courseId: ObjectId;

    enrollmentId: ObjectId;

    studentName: string;

    courseName: string;

    courseDuration: number;

    durationUnit: "Hours";

    issuedAt: Date;

    createdAt: Date;
}

/* =========================================================
   SERIALIZED CERTIFICATE
========================================================= */

export interface Certificate {
    _id: string;

    certificateId: string;

    userId: string;

    courseId: string;

    enrollmentId: string;

    studentName: string;

    courseName: string;

    courseDuration: number;

    durationUnit: "Hours";

    issuedAt: string;

    createdAt: string;
}

/* =========================================================
   COLLECTION
========================================================= */

export async function getCertificatesCollection() {
    const client = await clientPromise;

    const db = client.db("next-auth");

    return db.collection<CertificateDoc>(
        "certificates"
    );
}

/* =========================================================
   SERIALIZER
========================================================= */

export function serializeCertificate(
    certificate: CertificateDoc & {
        _id: ObjectId;
    }
): Certificate {
    return {
        _id: certificate._id.toString(),

        certificateId:
            certificate.certificateId,

        userId:
            certificate.userId.toString(),

        courseId:
            certificate.courseId.toString(),

        enrollmentId:
            certificate.enrollmentId.toString(),

        studentName:
            certificate.studentName,

        courseName:
            certificate.courseName,

        courseDuration:
            certificate.courseDuration,

        durationUnit:
            certificate.durationUnit,

        issuedAt:
            certificate.issuedAt.toISOString(),

        createdAt:
            certificate.createdAt.toISOString(),
    };
}

/* =========================================================
   CERTIFICATE ID GENERATOR

   Example:
   NLS-2026-X7K9P2QM
========================================================= */

export function generateCertificateId(
    year = new Date().getFullYear()
): string {
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let randomPart = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(
            Math.random() * characters.length
        );

        randomPart +=
            characters[randomIndex];
    }

    return `NLS-${year}-${randomPart}`;
}

/* =========================================================
   FIND OR CREATE CERTIFICATE

   Prevents duplicate certificates for the same
   user + course + enrollment.
========================================================= */

export async function findOrCreateCertificate({
    userId,
    courseId,
    enrollmentId,
    studentName,
    courseName,
    courseDuration,
    issuedAt = new Date(),
}: {
    userId: ObjectId;
    courseId: ObjectId;
    enrollmentId: ObjectId;
    studentName: string;
    courseName: string;
    courseDuration: number;
    issuedAt?: Date;
}) {
    const certificates =
        await getCertificatesCollection();

    /* =====================================================
       FIND EXISTING CERTIFICATE
    ===================================================== */

    const existingCertificate =
        await certificates.findOne({
            userId,
            courseId,
            enrollmentId,
        });

    if (existingCertificate?._id) {
        return serializeCertificate(
            existingCertificate as CertificateDoc & {
                _id: ObjectId;
            }
        );
    }

    /* =====================================================
       CREATE NEW CERTIFICATE
    ===================================================== */

    const certificateId =
        generateCertificateId(
            issuedAt.getFullYear()
        );

    const certificate: CertificateDoc = {
        certificateId,

        userId,

        courseId,

        enrollmentId,

        studentName,

        courseName,

        courseDuration:
            Number(courseDuration) || 0,

        durationUnit: "Hours",

        issuedAt,

        createdAt: issuedAt,
    };

    const result =
        await certificates.insertOne(
            certificate
        );

    return serializeCertificate({
        ...certificate,
        _id: result.insertedId,
    });
}