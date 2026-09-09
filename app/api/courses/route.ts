import { NextRequest, NextResponse } from "next/server";
import { getCoursesCollection } from "@/lib/courses";
import cloudinary from "@/lib/cloudinary";
import { ObjectId, DeleteResult, UpdateResult, InsertOneResult } from "mongodb";

// ---------------------------------------------
// Helper: Extract Cloudinary public_id from URL
// ---------------------------------------------
function getCloudinaryPublicId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);
        const parts = parsedUrl.pathname.split("/");
        const uploadIndex = parts.indexOf("upload");

        if (uploadIndex === -1) {
            return null;
        }

        let publicIdParts = parts.slice(uploadIndex + 1);

        // Remove Cloudinary transformation segments
        while (
            publicIdParts.length &&
            (
                publicIdParts[0].startsWith("w_") ||
                publicIdParts[0].startsWith("h_") ||
                publicIdParts[0].startsWith("c_") ||
                publicIdParts[0].startsWith("q_") ||
                publicIdParts[0].startsWith("f_")
            )
        ) {
            publicIdParts.shift();
        }

        // Remove version, e.g. v1757300000
        if (
            publicIdParts[0] &&
            /^v\d+$/.test(publicIdParts[0])
        ) {
            publicIdParts.shift();
        }

        if (!publicIdParts.length) {
            return null;
        }

        const publicId = publicIdParts.join("/");
        return publicId.replace(/\.[^/.]+$/, "");
    } catch (error) {
        console.error("Cloudinary public ID extraction error:", error);
        return null;
    }
}

// ---------------------------------------------
// Helper: Delete Cloudinary image
// ---------------------------------------------
async function deleteCloudinaryImage(thumbnail?: string): Promise<void> {
    if (!thumbnail) return;

    const publicId = getCloudinaryPublicId(thumbnail);
    if (!publicId) {
        console.warn("Could not extract Cloudinary public ID:", thumbnail);
        return;
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image" as "image" | "raw" | "video" | "auto",
        });
        console.log("Cloudinary delete result:", result);
    } catch (error) {
        console.error("Cloudinary image delete error:", error);
    }
}

// =============================================
// GET /api/courses
// =============================================
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const slug = searchParams.get("slug");
        const id = searchParams.get("id");

        const courses = await getCoursesCollection();

        // ✅ Single course by ID - FIXED
        if (id) {
            if (!ObjectId.isValid(id)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid course ID format",
                    },
                    { status: 400 }
                );
            }

            // ✅ FIX: Use 'as any' for ObjectId type issue
            const course = await courses.findOne({
                _id: new ObjectId(id) as any,
            });

            if (!course) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Course not found",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                course: {
                    ...course,
                    _id: course._id?.toString(),
                },
            });
        }

        // Single course by slug
        if (slug) {
            const course = await courses.findOne({
                slug,
            });

            if (!course) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Course not found",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                course: {
                    ...course,
                    _id: course._id?.toString(),
                },
            });
        }

        // All courses with filter
        const filter: Record<string, unknown> = {};
        if (status) {
            filter.status = status;
        }

        const courseList = await courses
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            courses: courseList.map((course) => ({
                ...course,
                _id: course._id?.toString(),
            })),
        });
    } catch (error) {
        console.error("Get Courses Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch courses",
            },
            { status: 500 }
        );
    }
}

// =============================================
// POST /api/courses
// =============================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            title,
            slug,
            description,
            shortDescription,
            thumbnail,
            category,
            level,
            duration,
            price,
            instructor,
            totalLessons,
            status,
        } = body;

        // Required fields validation
        const requiredFields = [
            { field: title, name: "title" },
            { field: slug, name: "slug" },
            { field: description, name: "description" },
            { field: shortDescription, name: "shortDescription" },
            { field: thumbnail, name: "thumbnail" },
            { field: category, name: "category" },
            { field: level, name: "level" },
            { field: duration, name: "duration" },
            { field: price, name: "price" },
            { field: instructor?.name, name: "instructor.name" },
            { field: totalLessons, name: "totalLessons" },
        ];

        const missingFields = requiredFields
            .filter(({ field }) => field === undefined || field === null || field === "")
            .map(({ name }) => name);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Required fields missing: ${missingFields.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Validate level
        const validLevels = ["Beginner", "Intermediate", "Advanced"];
        if (!validLevels.includes(level)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid course level. Must be Beginner, Intermediate, or Advanced.",
                },
                { status: 400 }
            );
        }

        const courseStatus: "draft" | "published" =
            status === "published" ? "published" : "draft";

        const courses = await getCoursesCollection();

        // Normalize slug
        const normalizedSlug = slug
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        if (!normalizedSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid slug format",
                },
                { status: 400 }
            );
        }

        // Check duplicate slug
        const existingCourse = await courses.findOne({
            slug: normalizedSlug,
        });

        if (existingCourse) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A course with this slug already exists",
                },
                { status: 409 }
            );
        }

        // Create course
        const newCourse = {
            title: title.trim(),
            slug: normalizedSlug,
            description: description.trim(),
            shortDescription: shortDescription.trim(),
            thumbnail,
            category: category.trim(),
            level,
            duration: Number(duration),
            price: Number(price),
            instructor: {
                name: instructor.name.trim(),
                email: instructor.email?.trim().toLowerCase() || "",
            },
            totalLessons: Number(totalLessons),
            status: courseStatus,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result: InsertOneResult = await courses.insertOne(newCourse);

        return NextResponse.json(
            {
                success: true,
                message: "Course created successfully",
                course: {
                    ...newCourse,
                    _id: result.insertedId.toString(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Course Error:", error);

        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A course with this slug already exists",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to create course",
            },
            { status: 500 }
        );
    }
}

// =============================================
// PUT /api/courses?id=COURSE_ID
// =============================================
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid course ID is required",
                },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            title,
            slug,
            description,
            shortDescription,
            thumbnail,
            category,
            level,
            duration,
            price,
            instructor,
            totalLessons,
            status,
        } = body;

        // Required fields validation
        const requiredFields = [
            { field: title, name: "title" },
            { field: slug, name: "slug" },
            { field: description, name: "description" },
            { field: shortDescription, name: "shortDescription" },
            { field: thumbnail, name: "thumbnail" },
            { field: category, name: "category" },
            { field: level, name: "level" },
            { field: duration, name: "duration" },
            { field: price, name: "price" },
            { field: instructor?.name, name: "instructor.name" },
            { field: totalLessons, name: "totalLessons" },
        ];

        const missingFields = requiredFields
            .filter(({ field }) => field === undefined || field === null || field === "")
            .map(({ name }) => name);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Required fields missing: ${missingFields.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Validate level
        const validLevels = ["Beginner", "Intermediate", "Advanced"];
        if (!validLevels.includes(level)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid course level",
                },
                { status: 400 }
            );
        }

        const courseStatus: "draft" | "published" =
            status === "published" ? "published" : "draft";

        const courses = await getCoursesCollection();
        const objectId = new ObjectId(id);

        // ✅ FIX: Use 'as any' for ObjectId type issue
        const existingCourse = await courses.findOne({
            _id: objectId as any,
        });

        if (!existingCourse) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        // Normalize slug
        const normalizedSlug = slug
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        if (!normalizedSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid slug format",
                },
                { status: 400 }
            );
        }

        // ✅ FIX: Use 'as any' for ObjectId type issue
        const duplicateSlug = await courses.findOne({
            slug: normalizedSlug,
            _id: { $ne: objectId as any },
        });

        if (duplicateSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A course with this slug already exists",
                },
                { status: 409 }
            );
        }

        // Detect thumbnail change
        const thumbnailChanged = existingCourse.thumbnail !== thumbnail;

        // Update course
        const updatedCourse = {
            title: title.trim(),
            slug: normalizedSlug,
            description: description.trim(),
            shortDescription: shortDescription.trim(),
            thumbnail,
            category: category.trim(),
            level,
            duration: Number(duration),
            price: Number(price),
            instructor: {
                name: instructor.name.trim(),
                email: instructor.email?.trim().toLowerCase() || "",
            },
            totalLessons: Number(totalLessons),
            status: courseStatus,
            updatedAt: new Date(),
        };

        // ✅ FIX: Use 'as any' for ObjectId type issue
        const result: UpdateResult = await courses.updateOne(
            { _id: objectId as any },
            { $set: updatedCourse }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        // Delete old Cloudinary image if thumbnail changed
        if (thumbnailChanged && existingCourse.thumbnail) {
            await deleteCloudinaryImage(existingCourse.thumbnail);
        }

        return NextResponse.json({
            success: true,
            message: "Course updated successfully",
            course: {
                ...updatedCourse,
                _id: id,
            },
        });
    } catch (error) {
        console.error("Update Course Error:", error);

        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A course with this slug already exists",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update course",
            },
            { status: 500 }
        );
    }
}

// =============================================
// DELETE /api/courses?id=COURSE_ID
// =============================================
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid course ID is required",
                },
                { status: 400 }
            );
        }

        const courses = await getCoursesCollection();
        const objectId = new ObjectId(id);

        // ✅ FIX: Use 'as any' for ObjectId type issue
        const course = await courses.findOne({
            _id: objectId as any,
        });

        if (!course) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        // ✅ FIX: Use 'as any' for ObjectId type issue
        const result: DeleteResult = await courses.deleteOne({
            _id: objectId as any,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to delete course",
                },
                { status: 500 }
            );
        }

        // Delete Cloudinary thumbnail
        if (course.thumbnail && typeof course.thumbnail === 'string') {
            await deleteCloudinaryImage(course.thumbnail);
        }

        return NextResponse.json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error("Delete Course Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete course",
            },
            { status: 500 }
        );
    }
}