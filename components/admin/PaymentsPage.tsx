
"use client";


import Link from "next/link";
import { useEffect, useState } from "react";

type Payment = {
    transactionId?: string;
    amount?: number;
    currency?: string;
    status?: string;
    gateway?: string;
    createdAt?: string;
    paidAt?: string;
    studentName?: string;
    studentEmail?: string;
    courseName?: string;
};

type PaymentStats = {
    totalPayments: number;
    paidCount: number;
    pendingCount: number;
    failedCount: number;
    unpaidCount: number;
    revenue: number;
};

type Pagination = {
    page: number;
    pageSize: number;
    totalFiltered: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

const initialStats: PaymentStats = {
    totalPayments: 0,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
    unpaidCount: 0,
    revenue: 0,
};

const initialPagination: Pagination = {
    page: 1,
    pageSize: 20,
    totalFiltered: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
};

function formatMoney(amount = 0, currency = "BDT") {
    try {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString("en-BD")}`;
    }
}

function formatDate(value?: string) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function statusClass(status = "") {
    switch (status.toLowerCase()) {
        case "paid":
            return "badge-success";
        case "pending":
            return "badge-warning";
        case "failed":
            return "badge-error";
        default:
            return "badge-ghost";
    }
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: string;
}) {
    return (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-base-content/65">{title}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {icon}
                </span>
            </div>
            <p className="mt-4 break-words text-2xl font-bold">{value}</p>
        </div>
    );
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState(initialStats);
    const [pagination, setPagination] = useState(initialPagination);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Debounce search input.
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadPayments() {
            setLoading(true);
            setError("");

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    pageSize: String(pageSize),
                    status,
                });

                if (search) params.set("search", search);

                const response = await fetch(
                    `/api/admin/payments?${params.toString()}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                const contentType = response.headers.get("content-type") ?? "";

                if (!contentType.includes("application/json")) {
                    throw new Error(
                        `API returned a non-JSON response (HTTP ${response.status}). Check the API route and authentication.`
                    );
                }

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to load payments.");
                }

                setPayments(data.payments ?? []);
                setStats(data.stats ?? initialStats);
                setPagination(data.pagination ?? initialPagination);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadPayments();

        return () => controller.abort();
    }, [page, pageSize, search, status]);

    const firstRecord =
        pagination.totalFiltered === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const lastRecord = Math.min(
        page * pageSize,
        pagination.totalFiltered
    );

    function changeStatus(value: string) {
        setPage(1);
        setStatus(value);
    }

    function changePageSize(value: number) {
        setPage(1);
        setPageSize(value);
    }

    return (
        <main className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                    <div>
                        <Link
                            href="/dashboard/admin"
                            className="btn btn-outline btn-sm gap-2"
                        >
                            <span aria-hidden="true">←</span>
                            Back to Dashboard
                        </Link>
                    </div>

                    


                        <header>
                            <p className="text-sm font-semibold tracking-widest text-primary">
                                ADMINISTRATION
                            </p>
                            <h1 className="mt-1 text-3xl font-bold">
                                Payments Management
                            </h1>
                            <p className="mt-2 text-sm text-base-content/65">
                                Monitor transactions and student payments.
                            </p>


                        </header>




                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                title="Total Payments"
                                value={stats.totalPayments.toLocaleString()}
                                icon="↗"
                            />
                            <StatCard
                                title="Total Revenue"
                                value={formatMoney(stats.revenue)}
                                icon="৳"
                            />
                            <StatCard
                                title="Successful Payments"
                                value={stats.paidCount.toLocaleString()}
                                icon="✓"
                            />
                            <StatCard
                                title="Pending Payments"
                                value={stats.pendingCount.toLocaleString()}
                                icon="◷"
                            />
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                            <div className="flex flex-col gap-4 border-b border-base-300 p-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Transaction History
                                    </h2>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        Search and manage all payment records.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        type="search"
                                        className="input input-bordered w-full sm:w-72"
                                        placeholder="Search transaction, student, course..."
                                        aria-label="Search payments"
                                        value={searchInput}
                                        onChange={(event) => setSearchInput(event.target.value)}
                                    />

                                    <select
                                        className="select select-bordered"
                                        aria-label="Filter payment status"
                                        value={status}
                                        onChange={(event) => changeStatus(event.target.value)}
                                    >
                                        <option value="all">All statuses</option>
                                        <option value="paid">Paid</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="unpaid">Unpaid</option>
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <div className="m-4 rounded-xl border border-error/30 bg-error/10 p-4 text-error">
                                    <p className="font-semibold">Unable to load payments</p>
                                    <p className="mt-1 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Transaction</th>
                                            <th>Student</th>
                                            <th>Course</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Gateway</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="py-12 text-center">
                                                    <span className="loading loading-spinner loading-md" />
                                                    <p className="mt-2">Loading payments...</p>
                                                </td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan={7} className="py-10 text-center">
                                                    Payment records could not be loaded.
                                                </td>
                                            </tr>
                                        ) : payments.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="py-12 text-center text-base-content/60"
                                                >
                                                    No payment records found.
                                                </td>
                                            </tr>
                                        ) : (
                                            payments.map((payment, index) => (
                                                <tr
                                                    key={`${payment.transactionId ?? "payment"}-${index}`}
                                                    className="hover"
                                                >
                                                    <td>
                                                        <span className="font-mono text-xs">
                                                            {payment.transactionId || "—"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="font-medium">
                                                            {payment.studentName || "Unknown Student"}
                                                        </div>
                                                        <div className="text-xs text-base-content/60">
                                                            {payment.studentEmail}
                                                        </div>
                                                    </td>

                                                    <td>{payment.courseName || "Unknown Course"}</td>

                                                    <td className="whitespace-nowrap font-semibold">
                                                        {formatMoney(
                                                            payment.amount,
                                                            payment.currency || "BDT"
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`badge ${statusClass(payment.status)}`}
                                                        >
                                                            {payment.status || "unknown"}
                                                        </span>
                                                    </td>

                                                    <td className="uppercase">
                                                        {payment.gateway || "—"}
                                                    </td>

                                                    <td className="whitespace-nowrap text-sm">
                                                        {formatDate(payment.paidAt || payment.createdAt)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <footer className="flex flex-col gap-4 border-t border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
                                    <span>
                                        Showing <strong>{firstRecord}–{lastRecord}</strong> of{" "}
                                        <strong>{pagination.totalFiltered}</strong>
                                    </span>

                                    <label className="flex items-center gap-2">
                                        Rows:
                                        <select
                                            className="select select-bordered select-sm"
                                            value={pageSize}
                                            onChange={(event) =>
                                                changePageSize(Number(event.target.value))
                                            }
                                            aria-label="Rows per page"
                                        >
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        disabled={loading || page <= 1}
                                        onClick={() => setPage((current) => current - 1)}
                                    >
                                        Previous
                                    </button>

                                    <span className="px-2 text-sm">
                                        Page {page} of {Math.max(1, pagination.totalPages)}
                                    </span>

                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        disabled={
                                            loading ||
                                            !pagination.hasNextPage ||
                                            page >= pagination.totalPages
                                        }
                                        onClick={() => setPage((current) => current + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </footer>
                        </section>
                </div>
        </main>
    );
}
