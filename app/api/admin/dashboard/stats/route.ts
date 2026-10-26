import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function validObjectId(value: unknown): ObjectId | null {
  if (value instanceof ObjectId) return value;
  if (typeof value === "string" && ObjectId.isValid(value)) {
    return new ObjectId(value);
  }
  return null;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "S";
}

function idString(value: unknown): string {
  if (value instanceof ObjectId) return value.toHexString();
  return typeof value === "string" ? value : "";
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required." },
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("next-auth");

    const usersCollection = db.collection("users");
    const coursesCollection = db.collection("courses");
    const enrollmentsCollection = db.collection("enrollments");
    const paymentsCollection = db.collection("payments");

    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);

    const [
      totalStudents,
      courses,
      allEnrollments,
      paidPayments,
      recentEnrollmentDocs,
    ] = await Promise.all([
      usersCollection.countDocuments({ role: { $in: ["user", "student"] } }),
      coursesCollection.find(
        {},
        {
          projection: {
            title: 1,
            category: 1,
            status: 1,
            totalLessons: 1,
            createdAt: 1,
          },
        }
      ).toArray(),
      enrollmentsCollection.find(
        {},
        {
          projection: {
            userId: 1,
            courseId: 1,
            status: 1,
            paymentStatus: 1,
            progress: 1,
            completedLessons: 1,
            enrolledAt: 1,
            createdAt: 1,
          },
        }
      ).toArray(),
      paymentsCollection.find(
        { status: "paid" },
        {
          projection: {
            userId: 1,
            courseId: 1,
            enrollmentId: 1,
            amount: 1,
            status: 1,
            paidAt: 1,
            createdAt: 1,
          },
        }
      ).toArray(),
      enrollmentsCollection.find(
        {},
        {
          projection: {
            userId: 1,
            courseId: 1,
            status: 1,
            paymentStatus: 1,
            enrolledAt: 1,
            createdAt: 1,
          },
        }
      ).sort({ enrolledAt: -1, createdAt: -1 }).limit(5).toArray(),
    ]);

    const activeCourses = courses.filter((course) => course.status === "published").length;

    const totalRevenue = paidPayments.reduce((sum, payment) => {
      const amount = Number(payment.amount ?? 0);
      return Number.isFinite(amount) && amount > 0 ? sum + amount : sum;
    }, 0);

    const enrollmentData = MONTHS.map((month, monthIndex) => {
      const count = allEnrollments.filter((enrollment) => {
        const date = toDate(enrollment.enrolledAt) ?? toDate(enrollment.createdAt);
        return date !== null &&
          date >= yearStart &&
          date < nextYearStart &&
          date.getMonth() === monthIndex;
      }).length;
      return { month, students: count };
    });

    const revenueData = MONTHS.map((month, monthIndex) => {
      const revenue = paidPayments.reduce((sum, payment) => {
        const date = toDate(payment.paidAt) ?? toDate(payment.createdAt);
        const amount = Number(payment.amount ?? 0);
        if (
          date &&
          date >= yearStart &&
          date < nextYearStart &&
          date.getMonth() === monthIndex &&
          Number.isFinite(amount)
        ) {
          return sum + amount;
        }
        return sum;
      }, 0);
      return { month, revenue };
    });

    const categoryCounts = new Map<string, number>();
    for (const course of courses) {
      const category =
        typeof course.category === "string" && course.category.trim()
          ? course.category.trim()
          : "Uncategorized";
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }

    const totalCoursesForDistribution = courses.length;
    const courseData = Array.from(categoryCounts.entries())
      .map(([name, count]) => ({
        name,
        value: totalCoursesForDistribution
          ? Math.round((count / totalCoursesForDistribution) * 100)
          : 0,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
      .map(({ name, value }) => ({ name, value }));

    const completionRate = allEnrollments.length
      ? (allEnrollments.filter((enrollment) => enrollment.status === "completed").length /
          allEnrollments.length) * 100
      : 0;

    const coursePerformance = courses
      .map((course) => {
        const courseId = idString(course._id);
        const relatedEnrollments = allEnrollments.filter(
          (enrollment) => idString(enrollment.courseId) === courseId
        );
        const progressValuesForCourse = relatedEnrollments.map((enrollment) => {
          if (enrollment.status === "completed") return 100;
          const progress = Number(enrollment.progress ?? 0);
          return Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
        });
        const progress = progressValuesForCourse.length
          ? Math.round(
              progressValuesForCourse.reduce((sum, value) => sum + value, 0) /
                progressValuesForCourse.length
            )
          : 0;

        return {
          title: typeof course.title === "string" ? course.title : "Untitled course",
          students: relatedEnrollments.length,
          progress,
          category:
            typeof course.category === "string" && course.category.trim()
              ? course.category
              : "Uncategorized",
          createdAt: toDate(course.createdAt)?.getTime() ?? 0,
        };
      })
      .sort((a, b) => b.students - a.students || b.createdAt - a.createdAt)
      .slice(0, 4)
      .map(({ title, students, progress, category }) => ({
        title,
        students,
        progress,
        category,
      }));

    const userIds = recentEnrollmentDocs
      .map((item) => validObjectId(item.userId))
      .filter((id): id is ObjectId => id !== null);
    const courseIds = recentEnrollmentDocs
      .map((item) => validObjectId(item.courseId))
      .filter((id): id is ObjectId => id !== null);

    const [recentUsers, recentCourses] = await Promise.all([
      userIds.length
        ? usersCollection.find(
            { _id: { $in: userIds } },
            { projection: { name: 1, email: 1 } }
          ).toArray()
        : Promise.resolve([]),
      courseIds.length
        ? coursesCollection.find(
            { _id: { $in: courseIds } },
            { projection: { title: 1, price: 1 } }
          ).toArray()
        : Promise.resolve([]),
    ]);

    const userMap = new Map(recentUsers.map((item) => [idString(item._id), item]));
    const courseMap = new Map(recentCourses.map((item) => [idString(item._id), item]));
    const paymentByEnrollment = new Map<string, (typeof paidPayments)[number]>();
    for (const payment of paidPayments) {
      const enrollmentKey = idString(payment.enrollmentId);
      if (enrollmentKey) {
        const previous = paymentByEnrollment.get(enrollmentKey);
        const paymentDate = toDate(payment.paidAt) ?? toDate(payment.createdAt);
        const previousDate = previous
          ? toDate(previous.paidAt) ?? toDate(previous.createdAt)
          : null;
        if (!previous || (paymentDate && (!previousDate || paymentDate > previousDate))) {
          paymentByEnrollment.set(enrollmentKey, payment);
        }
      }
    }

    const recentEnrollments = recentEnrollmentDocs.map((enrollment) => {
      const student = userMap.get(idString(enrollment.userId));
      const course = courseMap.get(idString(enrollment.courseId));
      const payment = paymentByEnrollment.get(idString(enrollment._id));
      const studentName =
        typeof student?.name === "string" && student.name.trim()
          ? student.name.trim()
          : typeof student?.email === "string"
            ? student.email
            : "Student";
      const courseName =
        typeof course?.title === "string" && course.title.trim()
          ? course.title.trim()
          : "Course";
      const paymentAmount = Number(payment?.amount);
      const coursePrice = Number(course?.price ?? 0);
      const amount = Number.isFinite(paymentAmount) && paymentAmount > 0
        ? paymentAmount
        : Number.isFinite(coursePrice) && coursePrice > 0
          ? coursePrice
          : 0;
      const rawStatus = String(enrollment.status ?? "pending").toLowerCase();
      const status = rawStatus === "active"
        ? "Active"
        : rawStatus === "completed"
          ? "Completed"
          : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

      return {
        id: idString(enrollment._id),
        name: studentName,
        course: courseName,
        status,
        amount: `৳${amount.toLocaleString("en-BD")}`,
        initials: initials(studentName),
      };
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalStudents,
          activeCourses,
          totalRevenue,
          completionRate,
          enrollmentData,
          revenueData,
          courseData,
          coursePerformance,
          recentEnrollments,
        },
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Admin dashboard stats error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
