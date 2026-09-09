
"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Save,
  Send,
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
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

interface CourseFormProps {
  course?: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CourseForm({
  course,
  onClose,
  onSuccess,
}: CourseFormProps) {
  const isEditMode = Boolean(course);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: "",
    instructorName: "",
    instructorEmail: "",
    totalLessons: "",
  });

  // Load existing course data in Edit mode
  useEffect(() => {
    if (!course) {
      setForm({
        title: "",
        slug: "",
        shortDescription: "",
        description: "",
        category: "",
        level: "Beginner",
        duration: "",
        price: "",
        instructorName: "",
        instructorEmail: "",
        totalLessons: "",
      });

      setThumbnail("");
      return;
    }

    setForm({
      title: course.title || "",
      slug: course.slug || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "Beginner",
      duration: String(course.duration ?? ""),
      price: String(course.price ?? ""),
      instructorName: course.instructor?.name || "",
      instructorEmail: course.instructor?.email || "",
      totalLessons: String(course.totalLessons ?? ""),
    });

    setThumbnail(course.thumbnail || "");
  }, [course]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto generate slug only when title changes
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setForm((prev) => ({
        ...prev,
        title: value,
        slug,
      }));
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || "Upload failed");
      }

      setThumbnail(data.url);

      console.log("Cloudinary upload successful:", data.url);
    } catch (error) {
      console.error("Thumbnail upload error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload thumbnail."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    status: "draft" | "published"
  ) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("Please upload a course thumbnail.");
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter course title.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter course category.");
      return;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      alert("Please enter a valid course duration.");
      return;
    }

    if (!form.totalLessons || Number(form.totalLessons) <= 0) {
      alert("Please enter total lessons.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        thumbnail,
        category: form.category.trim(),
        level: form.level,
        duration: Number(form.duration),
        price: Number(form.price),
        instructor: {
          name: form.instructorName.trim(),
          email: form.instructorEmail.trim() || undefined,
        },
        totalLessons: Number(form.totalLessons),
        status,
      };

      const url = isEditMode
        ? `/api/courses?id=${course?._id}`
        : "/api/courses";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isEditMode
              ? "Failed to update course"
              : "Failed to create course")
        );
      }

      alert(
        isEditMode
          ? status === "published"
            ? "Course updated and published successfully!"
            : "Course updated and saved as draft!"
          : status === "published"
            ? "Course published successfully!"
            : "Course saved as draft!"
      );

      onSuccess();
      onClose();
    } catch (error) {
      console.error(
        isEditMode ? "Update course error:" : "Create course error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {isEditMode
              ? "Update your course information and thumbnail."
              : "Add complete information about your course."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading || uploading}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-zinc-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>

      <form className="space-y-6">
        {/* Thumbnail */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Course Thumbnail
          </label>

          {thumbnail ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src={thumbnail}
                alt="Course thumbnail"
                className="h-56 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => setThumbnail("")}
                disabled={loading || uploading}
                className="absolute right-3 top-3 rounded-xl bg-black/70 p-2 text-white backdrop-blur transition hover:bg-red-500 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition hover:border-purple-500/50 hover:bg-purple-500/[0.03]">
              {uploading ? (
                <>
                  <Loader2
                    size={32}
                    className="mb-3 animate-spin text-purple-400"
                  />

                  <p className="text-sm text-zinc-300">
                    Uploading thumbnail...
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3 rounded-xl bg-purple-500/10 p-3 text-purple-400">
                    <Upload size={24} />
                  </div>

                  <p className="font-medium text-zinc-300">
                    {isEditMode
                      ? "Upload New Thumbnail"
                      : "Upload Course Thumbnail"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    PNG, JPG or WEBP • Maximum 5MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleThumbnailUpload}
                disabled={uploading || loading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title + Category */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Course Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="MERN Stack Web Development"
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Category
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Web Development"
              className="input-style"
              required
            />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Course Slug
          </label>

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="mern-stack-web-development"
            className="input-style"
            required
          />

          <p className="mt-1 text-xs text-zinc-600">
            Used for course URL.
          </p>
        </div>

        {/* Short Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Short Description
          </label>

          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            rows={3}
            placeholder="Become a professional MERN Stack Developer..."
            className="input-style resize-none"
            required
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Full Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Write detailed course description..."
            className="input-style resize-none"
            required
          />
        </div>

        {/* Level + Duration + Lessons + Price */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Level
            </label>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="input-style"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Duration (Hours)
            </label>

            <input
              type="number"
              name="duration"
              min="1"
              value={form.duration}
              onChange={handleChange}
              placeholder="120"
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Total Lessons
            </label>

            <input
              type="number"
              name="totalLessons"
              min="1"
              value={form.totalLessons}
              onChange={handleChange}
              placeholder="60"
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Price (৳)
            </label>

            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="5000"
              className="input-style"
              required
            />
          </div>
        </div>

        {/* Instructor */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <ImageIcon size={17} />
            </div>

            <h3 className="font-semibold text-white">
              Instructor Information
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Instructor Name
              </label>

              <input
                name="instructorName"
                value={form.instructorName}
                onChange={handleChange}
                placeholder="MD Towhidul Islam"
                className="input-style"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Instructor Email
              </label>

              <input
                type="email"
                name="instructorEmail"
                value={form.instructorEmail}
                onChange={handleChange}
                placeholder="instructor@example.com"
                className="input-style"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || uploading}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={(e) =>
              handleSubmit(
                e as unknown as FormEvent<HTMLFormElement>,
                "draft"
              )
            }
            disabled={loading || uploading}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {isEditMode ? "Update Draft" : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={(e) =>
              handleSubmit(
                e as unknown as FormEvent<HTMLFormElement>,
                "published"
              )
            }
            disabled={loading || uploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-purple-500/20 transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}

            {isEditMode ? "Update & Publish" : "Publish Course"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input-style {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-style::placeholder {
          color: rgb(82 82 91);
        }

        .input-style:focus {
          border-color: rgba(168, 85, 247, 0.6);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.08);
        }

        select.input-style option {
          background: #18181b;
          color: white;
        }
      `}</style>
    </div>
  );
}

