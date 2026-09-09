import { NextRequest, NextResponse } from "next/server";

import crypto from "crypto";

import { requireAdminApi } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // ADMIN AUTHORIZATION
    // ==========================================
    const admin = await requireAdminApi();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // CLOUDINARY ENV VALIDATION
    // ==========================================
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary configuration is missing.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // TIMESTAMP
    // ==========================================
    const timestamp = Math.floor(Date.now() / 1000);

    // ==========================================
    // UPLOAD PARAMETERS
    // ==========================================
    const folder = "next-level-school/course-videos";

    const paramsToSign = {
      folder,
      timestamp,
    };

    // ==========================================
    // CREATE CLOUDINARY SIGNATURE
    // ==========================================
    const signatureString = Object.keys(paramsToSign)
      .sort()
      .map(
        (key) =>
          `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`
      )
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(signatureString + apiSecret)
      .digest("hex");

    // ==========================================
    // SUCCESS
    // ==========================================
    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate Cloudinary signature.",
      },
      { status: 500 }
    );
  }
}