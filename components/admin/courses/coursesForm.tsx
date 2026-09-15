"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  X,
  Upload,
  ImageIcon,
  Loader2,
  Save,
  Send,
  ChevronDown,
  Check,
  Search,
  Code2,
  Monitor,
  Palette,
  PenTool,
  Megaphone,
  Video,
  Bot,
  Database,
  Globe,
  Smartphone,
  Briefcase,
  GraduationCap,
  FileText,
  Settings,
  BookOpen,
  Camera,
  Music,
  ShoppingCart,
  Calculator,
  Terminal,
  Server,
  Layers,
} from "lucide-react";

// 🔑 shared Course type — local interface বাদ
import type { Course } from "@/lib/courses";

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
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [icon, setIcon] = useState("");
  const [featured, setFeatured] = useState(false);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const courseIcons = [
    { name: "code", label: "Code", icon: Code2 },
    { name: "monitor", label: "Computer", icon: Monitor },
    { name: "palette", label: "Graphic Design", icon: Palette },
    { name: "pen-tool", label: "UI / UX", icon: PenTool },
    { name: "megaphone", label: "Digital Marketing", icon: Megaphone },
    { name: "video", label: "Video Editing", icon: Video },
    { name: "bot", label: "Artificial Intelligence", icon: Bot },
    { name: "database", label: "Database", icon: Database },
    { name: "globe", label: "Web Development", icon: Globe },
    { name: "smartphone", label: "Mobile", icon: Smartphone },
    { name: "briefcase", label: "Career", icon: Briefcase },
    { name: "graduation-cap", label: "Education", icon: GraduationCap },
    { name: "file-text", label: "Office", icon: FileText },
    { name: "settings", label: "Technical", icon: Settings },
    { name: "book-open", label: "Learning", icon: BookOpen },
    { name: "camera", label: "Photography", icon: Camera },
    { name: "music", label: "Music", icon: Music },
    { name: "shopping-cart", label: "E-Commerce", icon: ShoppingCart },
    { name: "calculator", label: "Accounting", icon: Calculator },
    { name: "terminal", label: "Programming", icon: Terminal },
    { name: "server", label: "Server", icon: Server },
    { name: "layers", label: "Technology", icon: Layers },
  ];

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

  const filteredIcons = courseIcons.filter((item) =>
    item.label.toLowerCase().includes(iconSearch.toLowerCase())
  );

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
      setSkills([]);
      setSkillInput("");
      setIcon("");
      setFeatured(false);
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
    setSkills(Array.isArray(course.skills) ? course.skills : []);
    setSkillInput("");
    setIcon(course.icon || "");
    setFeatured(Boolean(course.featured));
  }, [course]);

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (skills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSkillKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

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
        skills,
        icon: icon.trim(),
        featured,
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

        {/* Course Skills + Icon + Featured */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* Skills */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-white">
                Course Skills
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Add the main skills students will learn.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. JavaScript"
                className="input-style"
              />

              <button
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="shrink-0 rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300"
                  >
                    <span>{skill}</span>

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-zinc-500 transition hover:text-red-400"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Icon + Featured */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

            <div className="mb-4">
              <h3 className="font-semibold text-white">
                Course Display
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Customize how this course appears on the courses page.
              </p>
            </div>

            <div className="relative">
              <label className="mb-2 block text-sm text-zinc-400">
                Course Icon
              </label>

              {/* Selected Icon Button */}
              <button
                type="button"
                onClick={() => setIconDropdownOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-purple-500/40 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const selected = courseIcons.find(
                      (item) => item.name === icon
                    );

                    if (!selected) {
                      return (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-white/10 text-zinc-500">
                          <Layers size={18} />
                        </div>
                      );
                    }

                    const SelectedIcon = selected.icon;

                    return (
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                        <SelectedIcon size={19} />
                      </div>
                    );
                  })()}

                  <div>
                    <p className="text-sm font-medium text-white">
                      {courseIcons.find((item) => item.name === icon)?.label ||
                        "Select an icon"}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {icon || "Choose a course icon"}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  className={`text-zinc-500 transition-transform ${iconDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown */}
              {iconDropdownOpen && (
                <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#111116] shadow-2xl shadow-black/40">

                  {/* Search */}
                  <div className="border-b border-white/10 p-3">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      />

                      <input
                        type="text"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                        placeholder="Search icon..."
                        autoFocus
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-500/40"
                      />
                    </div>
                  </div>

                  {/* Icon List */}
                  <div className="max-h-64 overflow-y-auto p-2">
                    {filteredIcons.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1.5">
                        {filteredIcons.map((item) => {
                          const IconComponent = item.icon;
                          const selected = icon === item.name;

                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => {
                                setIcon(item.name);
                                setIconDropdownOpen(false);
                                setIconSearch("");
                              }}
                              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selected
                                ? "bg-purple-500/15 text-purple-300"
                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                                }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${selected
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-white/[0.04] text-zinc-500 group-hover:bg-white/[0.08] group-hover:text-zinc-300"
                                  }`}
                              >
                                <IconComponent size={18} />
                              </div>

                              <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                {item.label}
                              </span>

                              {selected && (
                                <Check
                                  size={15}
                                  className="shrink-0 text-purple-400"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Search
                          size={22}
                          className="mx-auto mb-2 text-zinc-600"
                        />

                        <p className="text-sm text-zinc-500">
                          No icon found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="mt-2 text-xs text-zinc-500">
                Search and select an icon for this course.
              </p>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]">
              <div>
                <p className="text-sm font-semibold text-white">
                  Featured Course
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Highlight this course on the courses page.
                </p>
              </div>

              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-5 w-5 accent-purple-600"
              />
            </label>

          </div>
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