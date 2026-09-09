// app/api/modules/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getCoursesCollection } from "@/lib/courses";
import { requireAdminApi } from "@/lib/auth";

/* =========================================================
   GET MODULES
   GET /api/modules?courseId=COURSE_ID
========================================================= */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const courseId = searchParams.get("courseId");
    const id = searchParams.get("id");

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;
    const modulesCollection = db.collection("modules");

    // ----------------------------------------------------------
    // Get single module by ID
    // ----------------------------------------------------------
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: "Invalid module ID." },
          { status: 400 }
        );
      }

      const module = await modulesCollection.findOne({
        _id: new ObjectId(id) as any,
      });

      if (!module) {
        return NextResponse.json(
          { success: false, message: "Module not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        module: {
          ...module,
          _id: module._id.toString(),
          courseId: module.courseId?.toString(),
        },
      });
    }

    // ----------------------------------------------------------
    // Get all modules for a course
    // ----------------------------------------------------------
    if (!courseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Course ID is required.",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course ID.",
        },
        { status: 400 }
      );
    }

    const modules = await modulesCollection
      .find({
        courseId: new ObjectId(courseId) as any,
      })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .toArray();

    const formattedModules = modules.map((module) => ({
      ...module,
      _id: module._id.toString(),
      courseId: module.courseId.toString(),
      createdAt: module.createdAt
        ? new Date(module.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: module.updatedAt
        ? new Date(module.updatedAt).toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      modules: formattedModules,
    });
  } catch (error) {
    console.error("GET Modules Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch modules.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST MODULE
   POST /api/modules
========================================================= */

export async function POST(request: NextRequest) {
  try {
    /* -------------------------
       Admin Authentication
    ------------------------- */

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

    /* -------------------------
       Request Body
    ------------------------- */

    const body = await request.json();

    const {
      courseId,
      title,
      description = "",
      status = "draft",
    } = body;

    /* -------------------------
       Validation
    ------------------------- */

    if (!courseId || !ObjectId.isValid(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid course ID is required.",
        },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Module title is required.",
        },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Module title cannot be empty.",
        },
        { status: 400 }
      );
    }

    /* -------------------------
       Database
    ------------------------- */

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;

    const courses = db.collection("courses");
    const modulesCollection = db.collection("modules");

    /* -------------------------
       Check Course
    ------------------------- */

    const course = await courses.findOne({
      _id: new ObjectId(courseId) as any,
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

    /* -------------------------
       Find Last Module Order
    ------------------------- */

    const lastModule = await modulesCollection.findOne(
      {
        courseId: new ObjectId(courseId) as any,
      },
      {
        sort: { order: -1 },
      }
    );

    const order = lastModule ? Number(lastModule.order || 0) + 1 : 1;

    /* -------------------------
       Prepare Module
    ------------------------- */

    const now = new Date();

    const moduleData = {
      courseId: new ObjectId(courseId),
      title: cleanTitle,
      description: typeof description === "string" ? description.trim() : "",
      order,
      status: status === "published" ? "published" : "draft",
      createdAt: now,
      updatedAt: now,
    };

    /* -------------------------
       Insert Module
    ------------------------- */

    const result = await modulesCollection.insertOne(moduleData);

    return NextResponse.json(
      {
        success: true,
        message: "Module created successfully.",
        module: {
          ...moduleData,
          _id: result.insertedId.toString(),
          courseId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Module Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create module.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PUT MODULE
   PUT /api/modules?id=MODULE_ID
========================================================= */

export async function PUT(request: NextRequest) {
  try {
    /* -------------------------
       Admin Authentication
    ------------------------- */

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

    /* -------------------------
       Module ID
    ------------------------- */

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("id");

    if (!moduleId || !ObjectId.isValid(moduleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid module ID is required.",
        },
        { status: 400 }
      );
    }

    /* -------------------------
       Request Body
    ------------------------- */

    const body = await request.json();

    const {
      title,
      description = "",
      status = "draft",
    } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Module title is required.",
        },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return NextResponse.json(
        {
          success: false,
          message: "Module title cannot be empty.",
        },
        { status: 400 }
      );
    }

    /* -------------------------
       Database
    ------------------------- */

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;
    const modulesCollection = db.collection("modules");

    /* -------------------------
       Check Module
    ------------------------- */

    const existingModule = await modulesCollection.findOne({
      _id: new ObjectId(moduleId) as any,
    });

    if (!existingModule) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found.",
        },
        { status: 404 }
      );
    }

    /* -------------------------
       Update Module
    ------------------------- */

    const updatedAt = new Date();

    await modulesCollection.updateOne(
      {
        _id: new ObjectId(moduleId) as any,
      },
      {
        $set: {
          title: cleanTitle,
          description: typeof description === "string" ? description.trim() : "",
          status: status === "published" ? "published" : "draft",
          updatedAt,
        },
      }
    );

    /* -------------------------
       Get Updated Module
    ------------------------- */

    const updatedModule = await modulesCollection.findOne({
      _id: new ObjectId(moduleId) as any,
    });

    if (!updatedModule) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve updated module.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module updated successfully.",
      module: {
        ...updatedModule,
        _id: updatedModule._id.toString(),
        courseId: updatedModule.courseId.toString(),
        createdAt: updatedModule.createdAt instanceof Date
          ? updatedModule.createdAt.toISOString()
          : updatedModule.createdAt,
        updatedAt: updatedModule.updatedAt instanceof Date
          ? updatedModule.updatedAt.toISOString()
          : updatedModule.updatedAt,
      },
    });
  } catch (error) {
    console.error("PUT Module Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update module.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE MODULE
   DELETE /api/modules?id=MODULE_ID
========================================================= */

export async function DELETE(request: NextRequest) {
  try {
    /* -------------------------
       Admin Authentication
    ------------------------- */

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

    /* -------------------------
       Module ID
    ------------------------- */

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("id");

    if (!moduleId || !ObjectId.isValid(moduleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid module ID is required.",
        },
        { status: 400 }
      );
    }

    /* -------------------------
       Database
    ------------------------- */

    const coursesCollection = await getCoursesCollection();
    const db = coursesCollection.db;

    const modulesCollection = db.collection("modules");
    const lessonsCollection = db.collection("lessons");

    const objectId = new ObjectId(moduleId);

    /* -------------------------
       Check Module
    ------------------------- */

    const module = await modulesCollection.findOne({
      _id: objectId as any,
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

    /* -------------------------
       Delete Lessons
    ------------------------- */

    const lessonsDeleteResult = await lessonsCollection.deleteMany({
      moduleId: objectId as any,
    });

    /* -------------------------
       Delete Module
    ------------------------- */

    const moduleDeleteResult = await modulesCollection.deleteOne({
      _id: objectId as any,
    });

    if (moduleDeleteResult.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete module.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully.",
      deletedLessons: lessonsDeleteResult.deletedCount,
    });
  } catch (error) {
    console.error("DELETE Module Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete module.",
      },
      { status: 500 }
    );
  }
}