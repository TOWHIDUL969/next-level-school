"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  RefreshCw,
  Clock,
  GraduationCap,
  DollarSign,
  Layers,
} from "lucide-react";

// ✅ Course interface
// components/admin/courses/coursesTable.tsx

interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string; // ← এটা যোগ করুন
  thumbnail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  price: number;
  instructor: {
    name: string;
    email?: string;
  };
  totalLessons: number;
  status: "draft" | "published";
  createdAt: string;
}

// ✅ Import CourseForm
import CourseForm from "./coursesForm";

export default function CourseTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch courses
  const fetchCourses = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await fetch("/api/courses", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      setCourses(Array.isArray(data.courses) ? data.courses : []);
    } catch (error) {
      console.error("Fetch courses error:", error);
      setError(error instanceof Error ? error.message : "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Delete course
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/courses?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete course");
      }

      setCourses((prev) =>
        prev.filter((course) => course._id !== id)
      );
    } catch (error) {
      console.error("Delete course error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete course."
      );
    }
  };

  // ✅ Filter courses
  const filteredCourses = courses.filter((course) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      (course.title?.toLowerCase().includes(query) || false) ||
      (course.category?.toLowerCase().includes(query) || false) ||
      (course.level?.toLowerCase().includes(query) || false)
    );
  });

  // ✅ Stats
  const totalLessons = courses.reduce(
    (total, course) => total + (course.totalLessons || 0),
    0
  );

  const publishedCourses = courses.filter(
    (course) => course.status === "published"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "draft"
  ).length;

  // ✅ Form handlers
  const handleFormClose = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleFormSuccess = () => {
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-[#09090b] p-5 text-white lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2.5 text-purple-400">
              <BookOpen size={21} />
            </div>
            <span className="text-sm font-medium text-purple-400">
              Admin Panel / Courses
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Course Management
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            Create, manage, publish and organize all courses
            available on Next Level School.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchCourses}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold shadow-xl shadow-purple-500/10 transition hover:scale-[1.02]"
          >
            <Plus size={18} />
            Add New Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<BookOpen size={20} />} title="Total Courses" value={courses.length} />
        <StatCard icon={<GraduationCap size={20} />} title="Published" value={publishedCourses} />
        <StatCard icon={<Clock size={20} />} title="Draft Courses" value={draftCourses} />
        <StatCard icon={<DollarSign size={20} />} title="Total Lessons" value={totalLessons} />
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/20">

        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">All Courses</h2>
            <p className="mt-1 text-xs text-zinc-600">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/50"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="m-5 rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertCircleIcon size={24} />
            </div>
            <p className="mt-3 text-sm text-red-400">{error}</p>
            <button
              onClick={fetchCourses}
              className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={30} className="animate-spin text-purple-400" />
              <p className="text-sm text-zinc-500">Loading courses...</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-zinc-700">
              <BookOpen size={40} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-300">
              {search ? "No matching courses" : "No courses yet"}
            </h3>
            <p className="mt-2 max-w-md text-sm text-zinc-600">
              {search
                ? "Try searching with a different keyword."
                : "Create your first course to start building your online learning platform."}
            </p>
            {!search && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-purple-500"
              >
                <Plus size={17} />
                Create Course
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.015] text-[11px] uppercase tracking-wider text-zinc-600">
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Level</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-white/5 transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-800/50">
                              <BookOpen size={20} className="text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[300px] truncate font-semibold text-zinc-200">
                            {course.title || "Untitled Course"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-600">
                            {course.totalLessons || 0} Lessons •{" "}
                            {course.duration || 0} Hours
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className="text-sm text-zinc-400">
                        {course.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                          course.level === "Beginner"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : course.level === "Intermediate"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-purple-500/10 text-purple-400"
                        }`}
                      >
                        {course.level || "Beginner"}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span className="font-semibold text-zinc-200">
                        ৳{(course.price || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
                          course.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            course.status === "published"
                              ? "bg-emerald-400"
                              : "bg-amber-400"
                          }`}
                        />
                        {course.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Manage Course Content"
                          onClick={() => {
                            window.open(
                              `/dashboard/admin/courses/${course._id}/content`,
                              "_self"
                            );
                          }}
                          className="rounded-lg border border-purple-500/10 bg-purple-500/[0.03] p-2 text-purple-400 transition hover:bg-purple-500/10 hover:text-purple-300"
                        >
                          <Layers size={16} />
                        </button>
                        <button
                          type="button"
                          title="View Course"
                          onClick={() => {
                            window.open(`/courses/${course.slug || course._id}`, "_blank");
                          }}
                          className="rounded-lg border border-white/10 bg-white/[0.02] p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          title="Edit Course"
                          onClick={() => {
                            setEditingCourse(course);
                            setShowForm(true);
                          }}
                          className="rounded-lg border border-white/10 bg-white/[0.02] p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete Course"
                          onClick={() => handleDelete(course._id)}
                          className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-2 text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Course Form Modal - FIXED */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111113] shadow-2xl shadow-black/50">
            <div className="p-6 lg:p-8">
              <CourseForm
                course={editingCourse}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Stat Card Component
function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-purple-500/20 hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-purple-400">
          {icon}
        </div>
      </div>
      <p className="mt-5 text-sm text-zinc-500">{title}</p>
      <h3 className="mt-1 text-3xl font-bold tracking-tight text-white">
        {value.toLocaleString()}
      </h3>
    </div>
  );
}

// ✅ AlertCircle Icon Component (renamed to avoid conflict)
function AlertCircleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}