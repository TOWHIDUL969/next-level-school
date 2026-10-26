
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = [
  "paid",
  "pending",
  "failed",
  "unpaid",
] as const;

const ALLOWED_PAGE_SIZES = [20, 50, 100];

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = request.nextUrl.searchParams;

    const page = Math.max(
      1,
      Math.min(1_000_000, Number(params.get("page")) || 1)
    );

    const requestedSize = Number(params.get("pageSize")) || 20;
    const pageSize = ALLOWED_PAGE_SIZES.includes(
      requestedSize as (typeof ALLOWED_PAGE_SIZES)[number]
    )
      ? requestedSize
      : 20;

    const search = (params.get("search") ?? "").trim().slice(0, 100);
    const requestedStatus = params.get("status");

    const status =
      requestedStatus &&
      ALLOWED_STATUSES.includes(
        requestedStatus as (typeof ALLOWED_STATUSES)[number]
      )
        ? requestedStatus
        : "all";

    const client = await clientPromise;
    const db = client.db("next-auth");

    const paymentsCollection = db.collection("payments");

    const baseMatch =
      status === "all" ? {} : { status };

    // Escape user-provided text before using it in a regex.
    const escapedSearch = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const searchMatch = search
      ? {
          $or: [
            { transactionId: { $regex: escapedSearch, $options: "i" } },
            { studentName: { $regex: escapedSearch, $options: "i" } },
            { studentEmail: { $regex: escapedSearch, $options: "i" } },
            { courseName: { $regex: escapedSearch, $options: "i" } },
          ],
        }
      : {};

    const joinStages = [
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
        $addFields: {
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
    ];

    const [result, statsResult] = await Promise.all([
      paymentsCollection
        .aggregate([
          { $match: baseMatch },
          ...joinStages,
          ...(search ? [{ $match: searchMatch }] : []),
          { $sort: { createdAt: -1, _id: -1 } },
          {
            $facet: {
              records: [
                { $skip: (page - 1) * pageSize },
                { $limit: pageSize },
                {
                  $project: {
                    transactionId: 1,
                    amount: 1,
                    currency: 1,
                    status: 1,
                    gateway: 1,
                    createdAt: 1,
                    paidAt: 1,
                    studentName: 1,
                    studentEmail: 1,
                    courseName: 1,
                  },
                },
              ],
              count: [{ $count: "total" }],
            },
          },
        ])
        .toArray(),

      Promise.all([
        paymentsCollection.countDocuments(),
        paymentsCollection.countDocuments({ status: "paid" }),
        paymentsCollection.countDocuments({ status: "pending" }),
        paymentsCollection.countDocuments({ status: "failed" }),
        paymentsCollection.countDocuments({ status: "unpaid" }),
        paymentsCollection
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
      ]),
    ]);

    const [totalPayments, paidCount, pendingCount, failedCount, unpaidCount, revenueResult] =
      statsResult;

    const facet = result[0] ?? { records: [], count: [] };
    const totalFiltered = facet.count[0]?.total ?? 0;
    const totalPages = Math.ceil(totalFiltered / pageSize);

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalPayments,
          paidCount,
          pendingCount,
          failedCount,
          unpaidCount,
          revenue: revenueResult[0]?.total ?? 0,
        },
        pagination: {
          page,
          pageSize,
          totalFiltered,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
        payments: facet.records,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Admin payments API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load payments." },
      { status: 500 }
    );
  }
}
