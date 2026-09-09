// app/api/lessons/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getCoursesCollection } from "@/lib/courses";
import { requireAdminApi } from "@/lib/auth";
import { deleteCloudinaryVideo } from "@/lib/cloudinary";

// ============================================================
// GET
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const courseId = searchParams.get("courseId");
    const moduleId = searchParams.get("moduleId");
    const id = searchParams.get("id");

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;
    const lessonsCollection = db.collection("lessons");

    // ----------------------------------------------------------
    // Get single lesson by ID
    // ----------------------------------------------------------
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid lesson ID." },
          { status: 400 }
        );
      }

      const lesson = await lessonsCollection.findOne({
        _id: new ObjectId(id) as any,
      });

      if (!lesson) {
        return NextResponse.json(
          { success: false, message: "Lesson not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        lesson: {
          ...lesson,
          _id: lesson._id.toString(),
          courseId: lesson.courseId?.toString(),
          moduleId: lesson.moduleId?.toString(),
        },
      });
    }

    // ----------------------------------------------------------
    // At least one filter is required
    // ----------------------------------------------------------

    if (!courseId && !moduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Course ID or Module ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Build query with proper ObjectId handling
    // ----------------------------------------------------------

    const query: Record<string, unknown> = {};

    if (courseId) {
      if (!ObjectId.isValid(courseId)) {
        return NextResponse.json(
          { success: false, message: "Invalid course ID." },
          { status: 400 }
        );
      }
      query.courseId = new ObjectId(courseId) as any;
    }

    if (moduleId) {
      if (!ObjectId.isValid(moduleId)) {
        return NextResponse.json(
          { success: false, message: "Invalid module ID." },
          { status: 400 }
        );
      }
      query.moduleId = new ObjectId(moduleId) as any;
    }

    // ----------------------------------------------------------
    // Fetch lessons
    // ----------------------------------------------------------

    const lessons = await lessonsCollection
      .find(query)
      .sort({
        order: 1,
        createdAt: 1,
      })
      .toArray();

    // ----------------------------------------------------------
    // Format response
    // ----------------------------------------------------------

    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      _id: lesson._id.toString(),
      courseId: lesson.courseId?.toString(),
      moduleId: lesson.moduleId?.toString(),
      createdAt: lesson.createdAt instanceof Date
        ? lesson.createdAt.toISOString()
        : lesson.createdAt,
      updatedAt: lesson.updatedAt instanceof Date
        ? lesson.updatedAt.toISOString()
        : lesson.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      lessons: formattedLessons,
    });
  } catch (error) {
    console.error("GET Lessons Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch lessons.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // ----------------------------------------------------------
    // Admin protection
    // ----------------------------------------------------------

    const admin = await requireAdminApi();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Request body
    // ----------------------------------------------------------

    const body = await request.json();

    const {
      courseId,
      moduleId,
      title,
      description = "",
      videoUrl = "",
      videoPublicId = "",
      duration = 0,
      isFree = false,
      status = "draft",
    } = body;

    // ----------------------------------------------------------
    // Validate courseId
    // ----------------------------------------------------------

    if (!courseId || !ObjectId.isValid(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid course ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Validate moduleId
    // ----------------------------------------------------------

    if (!moduleId || !ObjectId.isValid(moduleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid module ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Validate title
    // ----------------------------------------------------------

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson title is required.",
        },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson title cannot be empty.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Database
    // ----------------------------------------------------------

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;

    const coursesCollectionDb = db.collection("courses");
    const modulesCollection = db.collection("modules");
    const lessonsCollection = db.collection("lessons");

    const courseObjectId = new ObjectId(courseId);
    const moduleObjectId = new ObjectId(moduleId);

    // ----------------------------------------------------------
    // Check course
    // ----------------------------------------------------------

    const course = await coursesCollectionDb.findOne({
      _id: courseObjectId as any,
    });

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Check module
    // ----------------------------------------------------------

    const module = await modulesCollection.findOne({
      _id: moduleObjectId as any,
    });

    if (!module) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Make sure module belongs to this course
    // ----------------------------------------------------------

    if (module.courseId.toString() !== courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Module does not belong to this course.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Find last lesson order
    // ----------------------------------------------------------

    const lastLesson = await lessonsCollection.findOne(
      {
        moduleId: moduleObjectId as any,
      },
      {
        sort: { order: -1 },
      }
    );

    const order = lastLesson ? Number(lastLesson.order || 0) + 1 : 1;

    // ----------------------------------------------------------
    // Normalize values
    // ----------------------------------------------------------

    const cleanDuration = typeof duration === "number" && duration >= 0 ? duration : 0;
    const cleanIsFree = Boolean(isFree);
    const cleanStatus = status === "published" ? "published" : "draft";

    // ----------------------------------------------------------
    // Create lesson
    // ----------------------------------------------------------

    const now = new Date();

    const lessonData = {
      courseId: courseObjectId,
      moduleId: moduleObjectId,
      title: cleanTitle,
      description: typeof description === "string" ? description.trim() : "",
      videoUrl: typeof videoUrl === "string" ? videoUrl.trim() : "",
      videoPublicId: typeof videoPublicId === "string" ? videoPublicId.trim() : "",
      duration: cleanDuration,
      order,
      isFree: cleanIsFree,
      status: cleanStatus,
      createdAt: now,
      updatedAt: now,
    };

    // ----------------------------------------------------------
    // Insert
    // ----------------------------------------------------------

    const result = await lessonsCollection.insertOne(lessonData);

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Lesson created successfully.",
        lesson: {
          ...lessonData,
          _id: result.insertedId.toString(),
          courseId,
          moduleId,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Lesson Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lesson.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT
// ============================================================

export async function PUT(request: NextRequest) {
  try {
    // ----------------------------------------------------------
    // Admin protection
    // ----------------------------------------------------------

    const admin = await requireAdminApi();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Lesson ID
    // ----------------------------------------------------------

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("id");

    if (!lessonId || !ObjectId.isValid(lessonId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid lesson ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Body
    // ----------------------------------------------------------

    const body = await request.json();

    const {
      title,
      description = "",
      videoUrl = "",
      videoPublicId = "",
      duration = 0,
      isFree = false,
      status = "draft",
    } = body;

    // ----------------------------------------------------------
    // Validate title
    // ----------------------------------------------------------

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson title is required.",
        },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson title cannot be empty.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Database
    // ----------------------------------------------------------

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;
    const lessonsCollection = db.collection("lessons");

    const lessonObjectId = new ObjectId(lessonId);

    // ----------------------------------------------------------
    // Find existing lesson
    // ----------------------------------------------------------

    const existingLesson = await lessonsCollection.findOne({
      _id: lessonObjectId as any,
    });

    if (!existingLesson) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Normalize values
    // ----------------------------------------------------------

    const cleanVideoUrl = typeof videoUrl === "string" ? videoUrl.trim() : "";
    const cleanVideoPublicId = typeof videoPublicId === "string" ? videoPublicId.trim() : "";
    const cleanDuration = typeof duration === "number" && duration >= 0 ? duration : 0;
    const cleanIsFree = Boolean(isFree);
    const cleanStatus = status === "published" ? "published" : "draft";

    const oldVideoPublicId = typeof existingLesson.videoPublicId === "string"
      ? existingLesson.videoPublicId.trim()
      : "";

    // ----------------------------------------------------------
    // Detect video replacement
    // ----------------------------------------------------------

    const videoChanged = Boolean(oldVideoPublicId) &&
      Boolean(cleanVideoPublicId) &&
      oldVideoPublicId !== cleanVideoPublicId;

    // ----------------------------------------------------------
    // Update MongoDB
    // ----------------------------------------------------------

    const updatedAt = new Date();

    const updateResult = await lessonsCollection.updateOne(
      { _id: lessonObjectId as any },
      {
        $set: {
          title: cleanTitle,
          description: typeof description === "string" ? description.trim() : "",
          videoUrl: cleanVideoUrl,
          videoPublicId: cleanVideoPublicId,
          duration: cleanDuration,
          isFree: cleanIsFree,
          status: cleanStatus,
          updatedAt,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No changes were made.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Delete OLD Cloudinary video
    // ----------------------------------------------------------

    let cloudinaryCleanup = null;

    if (videoChanged) {
      try {
        cloudinaryCleanup = await deleteCloudinaryVideo(oldVideoPublicId);
      } catch (error) {
        console.error("Old Cloudinary video cleanup failed:", error);
      }
    }

    // ----------------------------------------------------------
    // Get updated lesson
    // ----------------------------------------------------------

    const updatedLesson = await lessonsCollection.findOne({
      _id: lessonObjectId as any,
    });

    if (!updatedLesson) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve updated lesson.",
        },
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: videoChanged
        ? "Lesson updated and old video cleaned up successfully."
        : "Lesson updated successfully.",
      cloudinaryCleanup,
      lesson: {
        ...updatedLesson,
        _id: updatedLesson._id.toString(),
        courseId: updatedLesson.courseId?.toString(),
        moduleId: updatedLesson.moduleId?.toString(),
        createdAt: updatedLesson.createdAt instanceof Date
          ? updatedLesson.createdAt.toISOString()
          : updatedLesson.createdAt,
        updatedAt: updatedLesson.updatedAt instanceof Date
          ? updatedLesson.updatedAt.toISOString()
          : updatedLesson.updatedAt,
      },
    });
  } catch (error) {
    console.error("PUT Lesson Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update lesson.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    // ----------------------------------------------------------
    // Admin protection
    // ----------------------------------------------------------

    const admin = await requireAdminApi();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Lesson ID
    // ----------------------------------------------------------

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("id");

    if (!lessonId || !ObjectId.isValid(lessonId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid lesson ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Database
    // ----------------------------------------------------------

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;
    const lessonsCollection = db.collection("lessons");

    const lessonObjectId = new ObjectId(lessonId);

    // ----------------------------------------------------------
    // Find lesson
    // ----------------------------------------------------------

    const lesson = await lessonsCollection.findOne({
      _id: lessonObjectId as any,
    });

    if (!lesson) {
      return NextResponse.json(
        {
          success: false,
          message: "Lesson not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Cloudinary video cleanup
    // ----------------------------------------------------------

    let cloudinaryCleanup = null;

    if (typeof lesson.videoPublicId === "string" && lesson.videoPublicId.trim()) {
      try {
        cloudinaryCleanup = await deleteCloudinaryVideo(lesson.videoPublicId);
      } catch (error) {
        console.error("Cloudinary video cleanup failed:", error);
      }
    }

    // ----------------------------------------------------------
    // Delete lesson
    // ----------------------------------------------------------

    const deleteResult = await lessonsCollection.deleteOne({
      _id: lessonObjectId as any,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete lesson.",
        },
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "Lesson deleted successfully.",
      cloudinaryCleanup,
      deletedLesson: {
        _id: lesson._id.toString(),
        courseId: lesson.courseId?.toString(),
        moduleId: lesson.moduleId?.toString(),
        videoUrl: lesson.videoUrl || "",
        videoPublicId: lesson.videoPublicId || "",
      },
    });
  } catch (error) {
    console.error("DELETE Lesson Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete lesson.",
      },
      { status: 500 }
    );
  }
}