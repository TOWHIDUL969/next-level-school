import { NextRequest, NextResponse } from "next/server";
import { getCoursesCollection } from "@/lib/courses";
import { ObjectId } from "mongodb";

// GET /api/courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const slug = searchParams.get("slug");

    const courses = await getCoursesCollection();

    // Single course by slug
    if (slug) {
      const course = await courses.findOne({ slug });

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

    // Course filter
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
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}


// POST /api/courses
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

    // Required fields
    if (
      !title ||
      !slug ||
      !description ||
      !shortDescription ||
      !thumbnail ||
      !category ||
      !level ||
      duration === undefined ||
      price === undefined ||
      !instructor?.name ||
      totalLessons === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required course information is missing",
        },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    if (!validLevels.includes(level)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid course level",
        },
        { status: 400 }
      );
    }

    // Validate status
    const courseStatus =
      status === "published" ? "published" : "draft";

    const courses = await getCoursesCollection();

    // Normalize slug
    const normalizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

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
        email: instructor.email?.trim().toLowerCase(),
      },
      totalLessons: Number(totalLessons),
      status: courseStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await courses.insertOne(newCourse);

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

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create course",
      },
      { status: 500 }
    );
  }
}