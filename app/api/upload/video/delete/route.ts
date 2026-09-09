import { NextRequest, NextResponse } from "next/server";

import { deleteCloudinaryVideo } from "@/lib/cloudinary";
import { requireAdminApi } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(
    request: NextRequest
) {
    try {
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

        const body = await request.json();

        const publicId =
            typeof body.publicId === "string"
                ? body.publicId.trim()
                : "";

        if (!publicId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Cloudinary public ID is required.",
                },
                { status: 400 }
            );
        }

        const result =
            await deleteCloudinaryVideo(
                publicId
            );

        return NextResponse.json({
            success: true,
            message:
                "Cloudinary video deleted successfully.",
            result,
        });
    } catch (error) {
        console.error(
            "Cloudinary video delete API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to delete Cloudinary video.",
            },
            { status: 500 }
        );
    }
}