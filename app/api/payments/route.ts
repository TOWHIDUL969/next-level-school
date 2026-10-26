
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("next-auth");

    const payments = db.collection("payments");
    const params = request.nextUrl.searchParams;
    const status = params.get("status");
    const search = params.get("search")?.trim() ?? "";

    const match: Record<string, unknown> = {};

    if (
      status &&
      ["paid", "pending", "failed", "unpaid"].includes(status)
    ) {
      match.status = status;
    }

    const records = await payments
      .aggregate([
        { $match: match },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            transactionId: 1,
            amount: 1,
            currency: 1,
            status: 1,
            gateway: 1,
            createdAt: 1,
            paidAt: 1,
            studentName: {
              $ifNull: ["$student.name", "Unknown Student"],
            },
            studentEmail: {
              $ifNull: ["$student.email", ""],
            },
            courseName: {
              $ifNull: ["$course.title", "Unknown Course"],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 200 },
      ])
      .toArray();

    const filteredRecords = search
      ? records.filter((record) => {
          const query = search.toLowerCase();

          return [
            record.transactionId,
            record.studentName,
            record.studentEmail,
            record.courseName,
          ].some((value) =>
            String(value ?? "").toLowerCase().includes(query)
          );
        })
      : records;

    const [totalPayments, paidCount, pendingCount, failedCount, revenue] =
      await Promise.all([
        payments.countDocuments(),
        payments.countDocuments({ status: "paid" }),
        payments.countDocuments({ status: "pending" }),
        payments.countDocuments({ status: "failed" }),
        payments
          .aggregate([
            { $match: { status: "paid" } },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ])
          .toArray(),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalPayments,
        paidCount,
        pendingCount,
        failedCount,
        revenue: revenue[0]?.total ?? 0,
      },
      payments: filteredRecords,
    });
  } catch (error) {
    console.error("Admin payments API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load payments." },
      { status: 500 }
    );
  }
}
