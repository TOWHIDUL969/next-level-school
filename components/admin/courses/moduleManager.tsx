// components/admin/courses/moduleManager.tsx

"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    BookOpen,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    RefreshCw,
    X,
    Layers,
    CheckCircle2,
    Clock3,
    ChevronDown,
    ChevronUp,
    Video,
    Upload,
    PlayCircle,
    LockOpen,
    Lock,
    FileVideo,
    CircleCheck,
    AlertCircle,
    Eye,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface Module {
    _id: string;
    courseId: string;
    title: string;
    description: string;
    order: number;
    status: "draft" | "published";
    createdAt: string;
    updatedAt: string;
}

interface Lesson {
    _id: string;
    courseId: string;
    moduleId: string;
    title: string;
    description: string;
    videoUrl: string;
    videoPublicId: string;
    duration: number;
    order: number;
    isFree: boolean;
    status: "draft" | "published";
    createdAt: string;
    updatedAt: string;
}

interface Course {
    _id: string;
    title: string;
    thumbnail: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    totalLessons: number;
    duration: number;
    price: number;
    status: "draft" | "published";
    description?: string;
    shortDescription?: string;
}

interface ModuleManagerProps {
    courseId: string;
}

type LessonFormState = {
    title: string;
    description: string;
    videoUrl: string;
    videoPublicId: string;
    duration: number;
    isFree: boolean;
    status: "draft" | "published";
};

const emptyLessonForm: LessonFormState = {
    title: "",
    description: "",
    videoUrl: "",
    videoPublicId: "",
    duration: 0,
    isFree: false,
    status: "draft",
};

/* =========================================================
   CLOUDINARY HELPERS
========================================================= */

const CHUNK_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_CHUNK_RETRIES = 2;

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    duration?: number;
    format?: string;
    bytes?: number;
}

interface SignatureResponse {
    success: boolean;
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
    message?: string;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ModuleManager({
    courseId,
}: ModuleManagerProps) {
    /* =====================================================
       COURSE / MODULE / LESSON STATE
    ===================================================== */

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* =====================================================
       MODULE MODAL STATE
    ===================================================== */

    const [showModuleModal, setShowModuleModal] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [moduleTitle, setModuleTitle] = useState("");
    const [moduleDescription, setModuleDescription] = useState("");
    const [moduleStatus, setModuleStatus] =
        useState<"draft" | "published">("draft");
    const [savingModule, setSavingModule] = useState(false);

    /* =====================================================
       MODULE EXPANSION
    ===================================================== */

    const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
        null
    );

    /* =====================================================
       LESSON MODAL STATE
    ===================================================== */

    const [showLessonModal, setShowLessonModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] =
        useState<LessonFormState>(emptyLessonForm);
    const [savingLesson, setSavingLesson] = useState(false);

    /* =====================================================
       VIDEO UPLOAD STATE
    ===================================================== */

    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");

    const videoInputRef = useRef<HTMLInputElement | null>(null);
    const newlyUploadedVideoRef = useRef<string | null>(null);
    const activeUploadXhrRef = useRef<XMLHttpRequest | null>(null);
    const uploadCancelledRef = useRef(false);

    /* =====================================================
       PREVIEW
    ===================================================== */

    const [previewVideo, setPreviewVideo] = useState<Lesson | null>(null);

    /* =====================================================
       API HELPERS
    ===================================================== */

    const parseJsonResponse = async (response: Response) => {
        const text = await response.text();

        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    };

    /* =====================================================
       FETCH CONTENT
    ===================================================== */

    const fetchContent = useCallback(
        async (showLoader = false) => {
            try {
                if (showLoader) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                setError(null);

                const [
                    courseResponse,
                    moduleResponse,
                    lessonResponse,
                ] = await Promise.all([
                    fetch(`/api/courses?id=${courseId}`, {
                        cache: "no-store",
                    }),
                    fetch(`/api/modules?courseId=${courseId}`, {
                        cache: "no-store",
                    }),
                    fetch(`/api/lessons?courseId=${courseId}`, {
                        cache: "no-store",
                    }),
                ]);

                const courseData =
                    await parseJsonResponse(courseResponse);

                const moduleData =
                    await parseJsonResponse(moduleResponse);

                const lessonData =
                    await parseJsonResponse(lessonResponse);

                if (!courseResponse.ok) {
                    throw new Error(
                        courseData?.message ||
                        "Failed to load course."
                    );
                }

                if (!moduleResponse.ok) {
                    throw new Error(
                        moduleData?.message ||
                        "Failed to load modules."
                    );
                }

                if (!lessonResponse.ok) {
                    throw new Error(
                        lessonData?.message ||
                        "Failed to load lessons."
                    );
                }

                const fetchedCourse =
                    courseData?.course ??
                    courseData?.data ??
                    courseData;

                const fetchedModules =
                    moduleData?.modules ??
                    moduleData?.data ??
                    [];

                const fetchedLessons =
                    lessonData?.lessons ??
                    lessonData?.data ??
                    [];

                setCourse(fetchedCourse || null);

                setModules(
                    Array.isArray(fetchedModules)
                        ? [...fetchedModules].sort(
                            (a: Module, b: Module) =>
                                a.order - b.order
                        )
                        : []
                );

                setLessons(
                    Array.isArray(fetchedLessons)
                        ? [...fetchedLessons].sort(
                            (a: Lesson, b: Lesson) =>
                                a.order - b.order
                        )
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch course content:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load content"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [courseId]
    );

    useEffect(() => {
        fetchContent(true);
    }, [fetchContent]);

    /* =====================================================
       CLEANUP ABORT ON UNMOUNT
    ===================================================== */

    useEffect(() => {
        return () => {
            if (activeUploadXhrRef.current) {
                activeUploadXhrRef.current.abort();
                activeUploadXhrRef.current = null;
            }
        };
    }, []);

    /* =====================================================
       MODULE HELPERS
    ===================================================== */

    const openCreateModuleModal = () => {
        setEditingModule(null);
        setModuleTitle("");
        setModuleDescription("");
        setModuleStatus("draft");
        setShowModuleModal(true);
    };

    const openEditModuleModal = (module: Module) => {
        setEditingModule(module);
        setModuleTitle(module.title);
        setModuleDescription(module.description || "");
        setModuleStatus(module.status);
        setShowModuleModal(true);
    };

    const closeModuleModal = () => {
        if (savingModule) return;

        setShowModuleModal(false);
        setEditingModule(null);
        setModuleTitle("");
        setModuleDescription("");
        setModuleStatus("draft");
    };

    /* =====================================================
       CREATE / UPDATE MODULE
    ===================================================== */

    const handleModuleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const title = moduleTitle.trim();

        if (!title) {
            alert("Module title is required.");
            return;
        }

        try {
            setSavingModule(true);

            const isEditing = Boolean(editingModule);

            const payload = {
                courseId,
                title,
                description: moduleDescription.trim(),
                status: moduleStatus,
            };

            const response = await fetch(
                isEditing
                    ? `/api/modules?id=${editingModule!._id}`
                    : "/api/modules",
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await parseJsonResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to save module."
                );
            }

            closeModuleModal();
            await fetchContent();
        } catch (error) {
            console.error("Module save error:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to save module."
            );
        } finally {
            setSavingModule(false);
        }
    };

    /* =====================================================
       DELETE MODULE
    ===================================================== */

    const handleDeleteModule = async (module: Module) => {
        const moduleLessons = lessons.filter(
            (lesson) => lesson.moduleId === module._id
        );

        const message =
            moduleLessons.length > 0
                ? `Delete "${module.title}" and its ${moduleLessons.length} lesson(s)?`
                : `Delete "${module.title}"?`;

        if (!window.confirm(message)) return;

        try {
            const response = await fetch(
                `/api/modules?id=${module._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await parseJsonResponse(response);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to delete module."
                );
            }

            await fetchContent();
        } catch (error) {
            console.error("Module delete error:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete module."
            );
        }
    };

    /* =====================================================
       LESSON HELPERS
    ===================================================== */

    const openCreateLessonModal = (moduleId: string) => {
        setEditingLesson(null);
        setActiveModuleId(moduleId);
        setLessonForm({ ...emptyLessonForm });
        setUploadError("");
        setUploadStatus("");
        setUploadProgress(0);
        newlyUploadedVideoRef.current = null;
        setShowLessonModal(true);
    };

    const openEditLessonModal = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setActiveModuleId(lesson.moduleId);

        setLessonForm({
            title: lesson.title || "",
            description: lesson.description || "",
            videoUrl: lesson.videoUrl || "",
            videoPublicId: lesson.videoPublicId || "",
            duration: Number(lesson.duration) || 0,
            isFree: Boolean(lesson.isFree),
            status: lesson.status || "draft",
        });

        setUploadError("");
        setUploadStatus("");
        setUploadProgress(0);
        newlyUploadedVideoRef.current = null;
        setShowLessonModal(true);
    };

    const closeLessonModal = () => {
        if (savingLesson || uploadingVideo) return;

        setShowLessonModal(false);
        setEditingLesson(null);
        setActiveModuleId(null);
        setLessonForm({ ...emptyLessonForm });
        setUploadError("");
        setUploadStatus("");
        setUploadProgress(0);
        newlyUploadedVideoRef.current = null;

        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    /* =====================================================
       DELETE CLOUDINARY VIDEO
    ===================================================== */

    const deleteCloudinaryVideo = async (publicId: string) => {
        if (!publicId) return;

        try {
            const response = await fetch(
                "/api/upload/video/delete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ publicId }),
                }
            );

            if (!response.ok) {
                const data =
                    await parseJsonResponse(response);

                console.error(
                    "Cloudinary cleanup failed:",
                    data
                );
            }
        } catch (error) {
            console.error(
                "Cloudinary cleanup error:",
                error
            );
        }
    };

    /* =====================================================
       UPLOAD CHUNK
    ===================================================== */

    const uploadCloudinaryChunk = (
        uploadUrl: string,
        chunk: Blob,
        start: number,
        end: number,
        total: number,
        uploadId: string,
        signature: string,
        timestamp: number,
        apiKey: string,
        folder: string,
        attempt = 0
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            activeUploadXhrRef.current = xhr;

            xhr.open("POST", uploadUrl, true);

            xhr.setRequestHeader(
                "X-Unique-Upload-Id",
                uploadId
            );

            xhr.setRequestHeader(
                "Content-Range",
                `bytes ${start}-${end}/${total}`
            );

            xhr.responseType = "text";
            xhr.timeout = 10 * 60 * 1000;

            xhr.onload = () => {
                activeUploadXhrRef.current = null;

                let data: any = null;

                try {
                    data = xhr.responseText
                        ? JSON.parse(xhr.responseText)
                        : null;
                } catch {
                    data = null;
                }

                if (
                    xhr.status >= 200 &&
                    xhr.status < 300
                ) {
                    resolve(data);
                    return;
                }

                const message =
                    data?.error?.message ||
                    data?.message ||
                    `Cloudinary returned HTTP ${xhr.status}.`;

                if (attempt < MAX_CHUNK_RETRIES) {
                    setUploadStatus(
                        `Retrying chunk ${Math.floor(
                            start / CHUNK_SIZE
                        ) + 1
                        }...`
                    );

                    setTimeout(() => {
                        uploadCloudinaryChunk(
                            uploadUrl,
                            chunk,
                            start,
                            end,
                            total,
                            uploadId,
                            signature,
                            timestamp,
                            apiKey,
                            folder,
                            attempt + 1
                        )
                            .then(resolve)
                            .catch(reject);
                    }, 1200 * (attempt + 1));

                    return;
                }

                reject(new Error(message));
            };

            xhr.onerror = () => {
                activeUploadXhrRef.current = null;

                if (attempt < MAX_CHUNK_RETRIES) {
                    setUploadStatus(
                        "Network interruption. Retrying chunk..."
                    );

                    setTimeout(() => {
                        uploadCloudinaryChunk(
                            uploadUrl,
                            chunk,
                            start,
                            end,
                            total,
                            uploadId,
                            signature,
                            timestamp,
                            apiKey,
                            folder,
                            attempt + 1
                        )
                            .then(resolve)
                            .catch(reject);
                    }, 1200 * (attempt + 1));

                    return;
                }

                reject(
                    new Error(
                        "Network error while uploading video."
                    )
                );
            };

            xhr.ontimeout = () => {
                activeUploadXhrRef.current = null;

                if (attempt < MAX_CHUNK_RETRIES) {
                    setUploadStatus(
                        "Chunk timed out. Retrying..."
                    );

                    setTimeout(() => {
                        uploadCloudinaryChunk(
                            uploadUrl,
                            chunk,
                            start,
                            end,
                            total,
                            uploadId,
                            signature,
                            timestamp,
                            apiKey,
                            folder,
                            attempt + 1
                        )
                            .then(resolve)
                            .catch(reject);
                    }, 1200 * (attempt + 1));

                    return;
                }

                reject(
                    new Error(
                        "Video upload timed out."
                    )
                );
            };

            xhr.onabort = () => {
                activeUploadXhrRef.current = null;

                reject(
                    new Error(
                        "Video upload was cancelled."
                    )
                );
            };

            xhr.upload.onprogress = (event) => {
                if (!event.lengthComputable) return;

                const uploaded = start + event.loaded;

                const progress = Math.min(
                    100,
                    Math.round(
                        (uploaded / total) * 100
                    )
                );

                setUploadProgress(progress);

                const currentChunk =
                    Math.floor(
                        start / CHUNK_SIZE
                    ) + 1;

                const totalChunks = Math.ceil(
                    total / CHUNK_SIZE
                );

                setUploadStatus(
                    `Uploading chunk ${currentChunk} of ${totalChunks} • ${progress}%`
                );
            };

            const formData = new FormData();

            formData.append(
                "file",
                chunk,
                "video-chunk"
            );

            formData.append(
                "api_key",
                apiKey
            );

            formData.append(
                "timestamp",
                String(timestamp)
            );

            formData.append(
                "signature",
                signature
            );

            formData.append(
                "folder",
                folder
            );

            xhr.send(formData);
        });
    };

    /* =====================================================
       HANDLE VIDEO UPLOAD
    ===================================================== */

    const handleVideoUpload = async (file: File) => {
        if (!file) return;

        setUploadError("");
        setUploadStatus("");
        setUploadProgress(0);
        uploadCancelledRef.current = false;

        const allowedTypes = [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-matroska",
        ];

        const fileExtension =
            file.name
                .split(".")
                .pop()
                ?.toLowerCase() || "";

        const allowedExtensions = [
            "mp4",
            "webm",
            "mov",
            "mkv",
        ];

        const validType =
            allowedTypes.includes(file.type) ||
            allowedExtensions.includes(
                fileExtension
            );

        if (!validType) {
            setUploadError(
                "Unsupported video format. Please upload MP4, WebM, MOV or MKV."
            );

            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }

            return;
        }

        if (file.size <= 0) {
            setUploadError(
                "The selected video file is empty."
            );

            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }

            return;
        }

        if (file.size > MAX_VIDEO_SIZE) {
            setUploadError(
                "Video size must be less than 500MB."
            );

            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }

            return;
        }

        try {
            setUploadingVideo(true);
            setUploadStatus(
                "Preparing secure upload..."
            );

            const signatureResponse = await fetch(
                "/api/upload/video/signature",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "include",
                }
            );

            const signatureData =
                (await signatureResponse.json()) as SignatureResponse;

            if (
                !signatureResponse.ok ||
                !signatureData?.success
            ) {
                throw new Error(
                    signatureData?.message ||
                    "Failed to generate upload signature."
                );
            }

            const {
                signature,
                timestamp,
                apiKey,
                cloudName,
                folder,
            } = signatureData;

            if (
                !signature ||
                !timestamp ||
                !apiKey ||
                !cloudName ||
                !folder
            ) {
                throw new Error(
                    "Invalid Cloudinary signature response."
                );
            }

            const cloudinaryUploadUrl =
                `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

            const uploadId =
                `${Date.now()}-${cryptoRandomId()}`;

            const totalChunks = Math.ceil(
                file.size / CHUNK_SIZE
            );

            let finalResponse: any = null;

            for (
                let chunkIndex = 0;
                chunkIndex < totalChunks;
                chunkIndex++
            ) {
                if (
                    uploadCancelledRef.current
                ) {
                    throw new Error(
                        "Video upload was cancelled."
                    );
                }

                const start =
                    chunkIndex * CHUNK_SIZE;

                const end = Math.min(
                    start +
                    CHUNK_SIZE -
                    1,
                    file.size - 1
                );

                const chunk = file.slice(
                    start,
                    end + 1
                );

                setUploadStatus(
                    `Uploading chunk ${chunkIndex + 1
                    } of ${totalChunks}...`
                );

                const response =
                    await uploadCloudinaryChunk(
                        cloudinaryUploadUrl,
                        chunk,
                        start,
                        end,
                        file.size,
                        uploadId,
                        signature,
                        timestamp,
                        apiKey,
                        folder
                    );

                finalResponse = response;

                setUploadProgress(
                    Math.round(
                        ((chunkIndex + 1) /
                            totalChunks) *
                        100
                    )
                );
            }

            if (
                !finalResponse ||
                typeof finalResponse !==
                "object"
            ) {
                throw new Error(
                    "Invalid Cloudinary response format"
                );
            }

            if (
                !finalResponse.secure_url ||
                !finalResponse.public_id
            ) {
                console.error(
                    "Unexpected Cloudinary response:",
                    finalResponse
                );

                throw new Error(
                    finalResponse?.error
                        ?.message ||
                    finalResponse?.message ||
                    "Cloudinary did not return a valid video URL."
                );
            }

            const uploadResult: CloudinaryUploadResult =
                finalResponse;

            const previousUnsavedVideo =
                newlyUploadedVideoRef.current;

            if (
                previousUnsavedVideo &&
                previousUnsavedVideo !==
                uploadResult.public_id
            ) {
                await deleteCloudinaryVideo(
                    previousUnsavedVideo
                );
            }

            newlyUploadedVideoRef.current =
                uploadResult.public_id;

            setLessonForm((prev) => ({
                ...prev,
                videoUrl:
                    uploadResult.secure_url,
                videoPublicId:
                    uploadResult.public_id,
                duration:
                    Number(
                        uploadResult.duration
                    ) || 0,
            }));

            setUploadProgress(100);

            setUploadStatus(
                "Video uploaded successfully."
            );

            setUploadError("");

            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }
        } catch (error) {
            console.error(
                "Video upload error:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Video upload failed.";

            setUploadProgress(0);
            setUploadStatus("");
            setUploadError(message);

            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }
        } finally {
            setUploadingVideo(false);
            activeUploadXhrRef.current = null;
        }
    };

    /* =====================================================
       CANCEL VIDEO UPLOAD
    ===================================================== */

    const cancelVideoUpload = () => {
        uploadCancelledRef.current = true;

        if (activeUploadXhrRef.current) {
            activeUploadXhrRef.current.abort();
            activeUploadXhrRef.current = null;
        }

        setUploadingVideo(false);
        setUploadProgress(0);
        setUploadStatus("");
        setUploadError(
            "Video upload was cancelled."
        );

        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    /* =====================================================
       LESSON SUBMIT
    ===================================================== */

    const handleLessonSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const title = lessonForm.title.trim();

        if (!title) {
            setUploadError(
                "Please enter a lesson title."
            );
            return;
        }

        if (!activeModuleId) {
            setUploadError(
                "Please select a module."
            );
            return;
        }

        if (!lessonForm.videoUrl) {
            setUploadError(
                "Please upload a lesson video."
            );
            return;
        }

        if (uploadingVideo) {
            setUploadError(
                "Please wait until the video upload is complete."
            );
            return;
        }

        const isEditing =
            Boolean(editingLesson);

        const oldVideoPublicId =
            editingLesson?.videoPublicId || "";

        const newVideoPublicId =
            lessonForm.videoPublicId || "";

        const uploadedVideoPublicId =
            newlyUploadedVideoRef.current;

        try {
            setSavingLesson(true);
            setUploadError("");

            const payload = {
                courseId,
                moduleId: activeModuleId,
                title,
                description:
                    lessonForm.description.trim(),
                videoUrl:
                    lessonForm.videoUrl,
                videoPublicId:
                    lessonForm.videoPublicId,
                duration:
                    Number(
                        lessonForm.duration
                    ) || 0,
                isFree: Boolean(
                    lessonForm.isFree
                ),
                status: lessonForm.status,
            };

            const response = await fetch(
                isEditing
                    ? `/api/lessons?id=${editingLesson!._id}`
                    : "/api/lessons",
                {
                    method: isEditing
                        ? "PUT"
                        : "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        payload
                    ),
                }
            );

            const data =
                await parseJsonResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to save lesson."
                );
            }

            newlyUploadedVideoRef.current =
                null;

            setShowLessonModal(false);
            setEditingLesson(null);
            setActiveModuleId(null);
            setLessonForm({
                ...emptyLessonForm,
            });
            setUploadError("");
            setUploadStatus("");
            setUploadProgress(0);

            if (videoInputRef.current) {
                videoInputRef.current.value =
                    "";
            }

            await fetchContent();
        } catch (error) {
            console.error(
                "Lesson save error:",
                error
            );

            const videoToCleanup =
                uploadedVideoPublicId ||
                (isEditing &&
                    newVideoPublicId &&
                    newVideoPublicId !==
                    oldVideoPublicId
                    ? newVideoPublicId
                    : "");

            if (videoToCleanup) {
                await deleteCloudinaryVideo(
                    videoToCleanup
                );

                newlyUploadedVideoRef.current =
                    null;
            }

            setUploadError(
                error instanceof Error
                    ? error.message
                    : "Failed to save lesson."
            );
        } finally {
            setSavingLesson(false);
        }
    };

    /* =====================================================
       DELETE LESSON
    ===================================================== */

    const handleDeleteLesson = async (
        lesson: Lesson
    ) => {
        if (
            !window.confirm(
                `Delete "${lesson.title}"?`
            )
        ) {
            return;
        }

        try {
            const response = await fetch(
                `/api/lessons?id=${lesson._id}`,
                {
                    method: "DELETE",
                }
            );

            const data =
                await parseJsonResponse(
                    response
                );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Failed to delete lesson."
                );
            }

            await fetchContent();
        } catch (error) {
            console.error(
                "Lesson delete error:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete lesson."
            );
        }
    };

    /* =====================================================
       FORMAT DURATION
    ===================================================== */

    const formatDuration = (
        seconds: number
    ) => {
        if (
            !seconds ||
            Number.isNaN(seconds)
        ) {
            return "00:00";
        }

        const totalSeconds =
            Math.floor(seconds);

        const hours = Math.floor(
            totalSeconds / 3600
        );

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const remainingSeconds =
            totalSeconds % 60;

        if (hours > 0) {
            return `${String(hours).padStart(
                2,
                "0"
            )}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(
                remainingSeconds
            ).padStart(2, "0")}`;
        }

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    /* =====================================================
       TOGGLE MODULE
    ===================================================== */

    const toggleModule = (
        moduleId: string
    ) => {
        setExpandedModuleId(
            (current) =>
                current === moduleId
                    ? null
                    : moduleId
        );
    };

    /* =====================================================
       MODULE LESSON COUNT
    ===================================================== */

    const getModuleLessons = (
        moduleId: string
    ) => {
        return lessons
            .filter(
                (lesson) =>
                    lesson.moduleId ===
                    moduleId
            )
            .sort(
                (a, b) =>
                    a.order - b.order
            );
    };

    /* =====================================================
       RENDER LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="relative flex flex-col items-center gap-4">
                    <div className="absolute h-24 w-24 animate-pulse rounded-full bg-purple-400/10 blur-2xl" />

                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10">
                        <Loader2 className="h-7 w-7 animate-spin text-purple-400" />
                    </div>

                    <p className="text-sm font-medium text-zinc-400">
                        Loading course content...
                    </p>
                </div>
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                </div>

                <p className="max-w-md text-center text-sm text-red-400">
                    {error}
                </p>

                <button
                    onClick={() =>
                        fetchContent(true)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/10 px-5 py-2.5 text-sm font-semibold text-purple-400 transition-all duration-200 hover:border-purple-400/40 hover:bg-purple-400/20"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        );
    }

    /* =====================================================
       COURSE NOT FOUND
    ===================================================== */

    if (!course) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10">
                    <BookOpen className="h-8 w-8 text-blue-400" />
                </div>

                <p className="text-sm text-zinc-400">
                    Course not found
                </p>
            </div>
        );
    }

    /* =====================================================
       CALCULATED VALUES
    ===================================================== */

    const publishedLessons =
        lessons.filter(
            (lesson) =>
                lesson.status ===
                "published"
        ).length;

    const freeLessons =
        lessons.filter(
            (lesson) =>
                lesson.isFree
        ).length;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="space-y-6 pb-8 mx-4 my-4">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="group relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-zinc-950/90 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                {/* Premium Background Glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-purple-400/10 blur-[90px]" />
                    <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" />
                    <div className="absolute left-1/3 top-0 h-52 w-52 rounded-full bg-blue-400/5 blur-[80px]" />

                    {/* Subtle grid */}
                    <div
                        className="absolute inset-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                            backgroundSize: "32px 32px",
                        }}
                    />
                </div>

                {/* Top Accent Line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

                <div className="relative p-5 sm:p-6 lg:p-7">
                    <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">

                        {/* =====================================================
                LEFT CONTENT
            ====================================================== */}
                        <div className="flex min-w-0 items-center gap-4 sm:gap-5">

                            {/* Icon */}
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 rounded-[20px] bg-purple-400/10 blur-xl" />

                                <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] border border-purple-400/20 bg-gradient-to-br from-purple-400/15 via-blue-400/10 to-cyan-400/15 text-purple-400 shadow-xl shadow-purple-400/5 sm:h-16 sm:w-16">
                                    <Layers className="h-7 w-7 sm:h-8 sm:w-8" />

                                    {/* Online Indicator */}
                                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-zinc-950 bg-cyan-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                                    </span>
                                </div>
                            </div>

                            {/* Title Area */}
                            <div className="min-w-0">
                                {/* Breadcrumb / Label */}
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                        Course Builder
                                    </span>

                                    <span className="text-zinc-700">/</span>

                                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                                        Content Management
                                    </span>
                                </div>

                                {/* Main Title */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-[26px]">
                                        Course Content
                                    </h2>

                                    <span className="hidden h-1 w-1 rounded-full bg-blue-400/60 sm:block" />

                                    <span className="max-w-[280px] truncate text-sm font-medium text-zinc-400">
                                        {course.title}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-zinc-500 sm:text-sm">
                                    Organize modules, lessons and course materials from one place.
                                </p>
                            </div>
                        </div>

                        {/* =====================================================
                ACTION AREA
            ====================================================== */}
                        <div className="flex flex-wrap items-center gap-2.5 xl:justify-end">

                            {/* Go To Dashboard */}
                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = "/dashboard/admin";
                                }}
                                className="group/dashboard inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm font-medium text-zinc-300 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/20 hover:bg-blue-400/5 hover:text-blue-400 hover:shadow-blue-400/5 active:translate-y-0"
                            >
                                <svg
                                    className="h-4 w-4 transition-transform duration-300 group-hover/dashboard:-translate-x-0.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>

                                <span>Dashboard</span>
                            </button>

                            {/* Divider */}
                            <div className="hidden h-7 w-px bg-white/[0.08] sm:block" />

                            {/* Refresh */}
                            <button
                                type="button"
                                onClick={() => fetchContent(false)}
                                disabled={refreshing}
                                className="group/refresh inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm font-medium text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 transition-colors duration-300 ${refreshing
                                            ? "animate-spin text-cyan-400"
                                            : "group-hover/refresh:text-cyan-400"
                                        }`}
                                />

                                <span>Refresh</span>
                            </button>

                            {/* Add Module */}
                            <button
                                type="button"
                                onClick={openCreateModuleModal}
                                className="group/module relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl border border-purple-400/20 bg-gradient-to-r from-purple-400/15 via-blue-400/15 to-cyan-400/15 px-4 text-sm font-semibold text-white shadow-xl shadow-purple-400/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-cyan-400/10 active:translate-y-0"
                            >
                                {/* Animated Shine */}
                                <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/10 transition-all duration-700 group-hover/module:left-[120%]" />

                                {/* Glow */}
                                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-blue-400/5 to-cyan-400/5 opacity-0 transition-opacity duration-300 group-hover/module:opacity-100" />

                                <span className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-400/20 to-cyan-400/20 text-cyan-400">
                                    <Plus className="h-4 w-4" />
                                </span>

                                <span className="relative">
                                    Add Module
                                </span>

                                <span className="relative hidden text-[10px] font-normal text-zinc-500 sm:inline">
                                    ⌘
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* =====================================================
            BOTTOM META BAR
        ====================================================== */}
                    <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                            <span>Manage course structure</span>
                        </div>

                        <div className="hidden h-3 w-px bg-white/[0.08] sm:block" />

                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            <span>Build your learning flow</span>
                        </div>

                        <div className="hidden h-3 w-px bg-white/[0.08] sm:block" />

                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span>Publish when ready</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                COURSE SUMMARY
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Modules */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/20 hover:bg-zinc-950/80">
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-400/5 blur-2xl transition-opacity group-hover:opacity-100" />

                    <div className="relative flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/10 text-blue-400">
                            <Layers className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                Modules
                            </p>

                            <p className="mt-0.5 text-2xl font-bold text-white">
                                {modules.length}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-px bg-gradient-to-r from-blue-400/30 via-blue-400/5 to-transparent" />
                </div>

                {/* Lessons */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/20 hover:bg-zinc-950/80">
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-purple-400/5 blur-2xl" />

                    <div className="relative flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 text-purple-400">
                            <BookOpen className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                Lessons
                            </p>

                            <p className="mt-0.5 text-2xl font-bold text-white">
                                {lessons.length}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-px bg-gradient-to-r from-purple-400/30 via-purple-400/5 to-transparent" />
                </div>

                {/* Published */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-zinc-950/80">
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-400/5 blur-2xl" />

                    <div className="relative flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-400">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                Published
                            </p>

                            <p className="mt-0.5 text-2xl font-bold text-white">
                                {publishedLessons}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-px bg-gradient-to-r from-cyan-400/30 via-cyan-400/5 to-transparent" />
                </div>

                {/* Free */}
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400/20 hover:bg-zinc-950/80">
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-purple-400/5 blur-2xl" />

                    <div className="relative flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 text-purple-400">
                            <LockOpen className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-500">
                                Free Lessons
                            </p>

                            <p className="mt-0.5 text-2xl font-bold text-white">
                                {freeLessons}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-px bg-gradient-to-r from-purple-400/30 via-blue-400/10 to-transparent" />
                </div>
            </div>

            {/* =================================================
                MODULE LIST
            ================================================= */}

            {modules.length === 0 ? (
                <div className="relative overflow-hidden rounded-[28px] border border-dashed border-blue-400/15 bg-zinc-950/40 px-6 py-20 text-center">
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/5 blur-3xl" />

                    <div className="relative">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10 text-purple-400">
                            <Layers className="h-8 w-8" />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-white">
                            No modules yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                            Start building your course by
                            adding the first module.
                        </p>

                        <button
                            type="button"
                            onClick={
                                openCreateModuleModal
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/10 px-5 py-3 text-sm font-semibold text-purple-400 transition-all hover:border-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400"
                        >
                            <Plus className="h-4 w-4" />
                            Add First Module
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {modules.map(
                        (
                            module,
                            moduleIndex
                        ) => {
                            const moduleLessons =
                                getModuleLessons(
                                    module._id
                                );

                            const isExpanded =
                                expandedModuleId ===
                                module._id;

                            return (
                                <div
                                    key={
                                        module._id
                                    }
                                    className={`group overflow-hidden rounded-[26px] border bg-zinc-950/60 shadow-xl shadow-black/10 transition-all duration-300 ${isExpanded
                                            ? "border-blue-400/20"
                                            : "border-white/[0.08] hover:border-purple-400/15"
                                        }`}
                                >
                                    {/* MODULE HEADER */}
                                    <div className="relative p-4 sm:p-5">
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />

                                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleModule(
                                                        module._id
                                                    )
                                                }
                                                className="flex min-w-0 flex-1 items-center gap-4 text-left"
                                            >
                                                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-400/15 via-blue-400/10 to-cyan-400/10 text-sm font-bold text-purple-400">
                                                    {moduleIndex +
                                                        1}

                                                    <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="truncate text-base font-semibold text-white">
                                                            {
                                                                module.title
                                                            }
                                                        </h3>

                                                        {module.status ===
                                                            "published" ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-400">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Published
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/15 bg-blue-400/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
                                                                <Clock3 className="h-3 w-3" />
                                                                Draft
                                                            </span>
                                                        )}
                                                    </div>

                                                    {module.description && (
                                                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-500">
                                                            {
                                                                module.description
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] font-medium text-zinc-500">
                                                            <BookOpen className="h-3 w-3 text-blue-400" />

                                                            {
                                                                moduleLessons.length
                                                            }{" "}
                                                            {moduleLessons.length ===
                                                                1
                                                                ? "lesson"
                                                                : "lessons"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-zinc-500 transition group-hover:border-blue-400/15 group-hover:text-blue-400 sm:flex">
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </div>
                                            </button>

                                            <div className="flex flex-wrap items-center gap-2 pl-16 xl:pl-0">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openCreateLessonModal(
                                                            module._id
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-xl border border-purple-400/15 bg-purple-400/10 px-3.5 py-2.5 text-xs font-semibold text-purple-400 transition-all duration-200 hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-400"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add Lesson
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModuleModal(
                                                            module
                                                        )
                                                    }
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition-all hover:border-blue-400/20 hover:bg-blue-400/10 hover:text-blue-400"
                                                    title="Edit module"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteModule(
                                                            module
                                                        )
                                                    }
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/5 text-red-400 transition-all hover:border-red-400/20 hover:bg-red-400/10"
                                                    title="Delete module"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleModule(
                                                            module._id
                                                        )
                                                    }
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-500 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-400 sm:hidden"
                                                    title={
                                                        isExpanded
                                                            ? "Collapse"
                                                            : "Expand"
                                                    }
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* LESSONS */}
                                    {isExpanded && (
                                        <div className="border-t border-white/[0.06] bg-black/10 p-4 sm:p-5">
                                            {moduleLessons.length ===
                                                0 ? (
                                                <div className="relative overflow-hidden rounded-2xl border border-dashed border-blue-400/10 bg-white/[0.015] px-5 py-12 text-center">
                                                    <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-blue-400/5 blur-3xl" />

                                                    <div className="relative">
                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/5 text-blue-400">
                                                            <Video className="h-6 w-6" />
                                                        </div>

                                                        <p className="mt-4 text-sm font-medium text-zinc-400">
                                                            No lessons in this module.
                                                        </p>

                                                        <p className="mt-1 text-xs text-zinc-600">
                                                            Add your first video lesson to continue.
                                                        </p>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openCreateLessonModal(
                                                                    module._id
                                                                )
                                                            }
                                                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-purple-400/15 bg-purple-400/10 px-4 py-2.5 text-xs font-semibold text-purple-400 transition-all hover:border-cyan-400/25 hover:bg-cyan-400/10 hover:text-cyan-400"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                            Add Lesson
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {moduleLessons.map(
                                                        (
                                                            lesson,
                                                            lessonIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    lesson._id
                                                                }
                                                                className="group/lesson relative overflow-hidden rounded-2xl border border-white/[0.07] bg-blue-950 p-4 transition-all duration-300 hover:border-blue-400/15 hover:bg-zinc-900/80"
                                                            >
                                                                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-purple-400/0 via-blue-400/30 to-cyan-400/0 opacity-0 transition-opacity group-hover/lesson:opacity-100" />

                                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                                                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-xs font-semibold text-zinc-400">
                                                                            {lessonIndex +
                                                                                1}
                                                                        </div>

                                                                        <div className="min-w-0 flex-1">
                                                                            <div className="flex flex-wrap items-center gap-2">
                                                                                <h4 className="truncate text-sm font-semibold text-white">
                                                                                    {
                                                                                        lesson.title
                                                                                    }
                                                                                </h4>

                                                                                {lesson.isFree ? (
                                                                                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold text-cyan-400">
                                                                                        <LockOpen className="h-3 w-3" />
                                                                                        Free
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/15 bg-purple-400/10 px-2 py-1 text-[10px] font-semibold text-purple-400">
                                                                                        <Lock className="h-3 w-3" />
                                                                                        Paid
                                                                                    </span>
                                                                                )}

                                                                                {lesson.status ===
                                                                                    "published" ? (
                                                                                    <span className="rounded-full border border-blue-400/15 bg-blue-400/10 px-2 py-1 text-[10px] font-semibold text-blue-400">
                                                                                        Published
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="rounded-full border border-purple-400/10 bg-purple-400/5 px-2 py-1 text-[10px] font-semibold text-purple-400">
                                                                                        Draft
                                                                                    </span>
                                                                                )}
                                                                            </div>

                                                                            {lesson.description && (
                                                                                <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                                                                                    {
                                                                                        lesson.description
                                                                                    }
                                                                                </p>
                                                                            )}

                                                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
                                                                                <span className="inline-flex items-center gap-1">
                                                                                    <Clock3 className="h-3 w-3 text-blue-400" />
                                                                                    {formatDuration(
                                                                                        lesson.duration
                                                                                    )}
                                                                                </span>

                                                                                {lesson.videoUrl && (
                                                                                    <span className="inline-flex items-center gap-1">
                                                                                        <FileVideo className="h-3 w-3 text-purple-400" />
                                                                                        Video
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex shrink-0 items-center gap-2 pl-13 lg:pl-0">
                                                                        {lesson.videoUrl && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setPreviewVideo(
                                                                                        lesson
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-400 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/10"
                                                                            >
                                                                                <PlayCircle className="h-4 w-4" />
                                                                                Preview
                                                                            </button>
                                                                        )}

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                openEditLessonModal(
                                                                                    lesson
                                                                                )
                                                                            }
                                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition-all hover:border-blue-400/20 hover:bg-blue-400/10 hover:text-blue-400"
                                                                            title="Edit lesson"
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteLesson(
                                                                                    lesson
                                                                                )
                                                                            }
                                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/5 text-red-400 transition-all hover:border-red-400/20 hover:bg-red-400/10"
                                                                            title="Delete lesson"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            )}

            {/* =================================================
                MODULE MODAL
            ================================================= */}

            {showModuleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-purple-400/15 bg-zinc-950 shadow-2xl shadow-black/50">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" />

                        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10 text-purple-400">
                                    <Layers className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        {editingModule
                                            ? "Edit Module"
                                            : "Add Module"}
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        Organize your course content
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeModuleModal
                                }
                                disabled={
                                    savingModule
                                }
                                className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-zinc-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-400 disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleModuleSubmit
                            }
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    Module Title *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        moduleTitle
                                    }
                                    onChange={(e) =>
                                        setModuleTitle(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="e.g. Introduction to React"
                                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-400/40 focus:bg-purple-400/[0.03] focus:ring-2 focus:ring-purple-400/10"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    Description
                                </label>

                                <textarea
                                    value={
                                        moduleDescription
                                    }
                                    onChange={(e) =>
                                        setModuleDescription(
                                            e.target
                                                .value
                                        )
                                    }
                                    rows={4}
                                    placeholder="Describe what students will learn in this module..."
                                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40 focus:bg-blue-400/[0.03] focus:ring-2 focus:ring-blue-400/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-300">
                                    Status
                                </label>

                                <select
                                    value={
                                        moduleStatus
                                    }
                                    onChange={(e) =>
                                        setModuleStatus(
                                            e.target
                                                .value as
                                            | "draft"
                                            | "published"
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="published">
                                        Published
                                    </option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
                                <button
                                    type="button"
                                    onClick={
                                        closeModuleModal
                                    }
                                    disabled={
                                        savingModule
                                    }
                                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-blue-400/15 hover:bg-blue-400/5 hover:text-blue-400 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        savingModule
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border border-purple-400/20 bg-gradient-to-r from-purple-400/15 via-blue-400/15 to-cyan-400/15 px-5 py-2.5 text-sm font-semibold text-purple-400 transition-all hover:border-cyan-400/30 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingModule && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}

                                    {editingModule
                                        ? "Update Module"
                                        : "Create Module"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =================================================
                LESSON MODAL
            ================================================= */}

            {showLessonModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-5">
                    <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-blue-400/15 bg-zinc-950 shadow-2xl shadow-black/60">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" />

                        {/* Modal Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6 sm:py-5">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/10 text-blue-400">
                                    <Video className="h-5 w-5" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-lg font-bold text-white">
                                        {editingLesson
                                            ? "Edit Lesson"
                                            : "Add Lesson"}
                                    </h3>

                                    <p className="mt-1 truncate text-xs text-zinc-500">
                                        Upload video and configure lesson settings
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeLessonModal
                                }
                                disabled={
                                    savingLesson ||
                                    uploadingVideo
                                }
                                className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-zinc-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={
                                handleLessonSubmit
                            }
                            className="min-h-0 flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 sm:p-6"
                        >
                            <div className="space-y-6">
                                {/* Lesson Title */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                                        Lesson Title *
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            lessonForm.title
                                        }
                                        onChange={(e) =>
                                            setLessonForm(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    title: e
                                                        .target
                                                        .value,
                                                })
                                            )
                                        }
                                        placeholder="e.g. What is React?"
                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-400/40 focus:bg-purple-400/[0.03] focus:ring-2 focus:ring-purple-400/10"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            lessonForm.description
                                        }
                                        onChange={(e) =>
                                            setLessonForm(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    description:
                                                        e
                                                            .target
                                                            .value,
                                                })
                                            )
                                        }
                                        rows={4}
                                        placeholder="Describe this lesson..."
                                        className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40 focus:bg-blue-400/[0.03] focus:ring-2 focus:ring-blue-400/10"
                                    />
                                </div>

                                {/* Video Upload */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-zinc-300">
                                            Lesson Video *
                                        </label>

                                        {lessonForm.duration >
                                            0 && (
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-xs font-medium text-cyan-400">
                                                    <Clock3 className="h-3 w-3" />
                                                    {formatDuration(
                                                        lessonForm.duration
                                                    )}
                                                </span>
                                            )}
                                    </div>

                                    {!lessonForm.videoUrl ? (
                                        <label className="group relative block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-blue-400/15 bg-gradient-to-br from-purple-400/[0.02] via-blue-400/[0.03] to-cyan-400/[0.02] p-8 text-center transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.03]">
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/5 blur-3xl transition-all group-hover:bg-purple-400/10" />

                                            <input
                                                ref={
                                                    videoInputRef
                                                }
                                                type="file"
                                                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
                                                className="hidden"
                                                disabled={
                                                    uploadingVideo ||
                                                    savingLesson
                                                }
                                                onChange={(
                                                    e
                                                ) => {
                                                    const file =
                                                        e
                                                            .target
                                                            .files?.[0];

                                                    if (
                                                        file
                                                    ) {
                                                        handleVideoUpload(
                                                            file
                                                        );
                                                    }
                                                }}
                                            />

                                            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-400/10 via-blue-400/10 to-cyan-400/10 text-purple-400 shadow-lg shadow-purple-400/5 transition-all duration-300 group-hover:scale-105 group-hover:text-cyan-400">
                                                {uploadingVideo ? (
                                                    <Loader2 className="h-7 w-7 animate-spin" />
                                                ) : (
                                                    <Upload className="h-7 w-7" />
                                                )}
                                            </div>

                                            <p className="relative mt-5 text-sm font-semibold text-white">
                                                {uploadingVideo
                                                    ? "Uploading video..."
                                                    : "Click to upload video"}
                                            </p>

                                            <p className="relative mt-2 text-xs text-zinc-500">
                                                MP4, WebM, MOV or
                                                MKV • Maximum
                                                500MB
                                            </p>

                                            <div className="relative mx-auto mt-4 flex w-fit items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                                <span className="h-1 w-1 rounded-full bg-purple-400" />
                                                Secure Upload
                                                <span className="h-1 w-1 rounded-full bg-blue-400" />
                                                Cloud Storage
                                                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-r from-purple-400/[0.04] via-blue-400/[0.04] to-cyan-400/[0.04] p-4">
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400/0 via-blue-400/40 to-cyan-400/0" />

                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-400">
                                                        <FileVideo className="h-5 w-5" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-semibold text-white">
                                                                Video uploaded
                                                            </p>

                                                            <CircleCheck className="h-4 w-4 text-cyan-400" />
                                                        </div>

                                                        <p className="mt-1 truncate text-xs text-zinc-500">
                                                            {
                                                                lessonForm.videoPublicId
                                                            }
                                                        </p>

                                                        {lessonForm.duration >
                                                            0 && (
                                                                <p className="mt-1 text-xs text-zinc-600">
                                                                    Duration:{" "}
                                                                    {formatDuration(
                                                                        lessonForm.duration
                                                                    )}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2">
                                                    <a
                                                        href={
                                                            lessonForm.videoUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/10"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Preview
                                                    </a>

                                                    <label className="cursor-pointer">
                                                        <input
                                                            ref={
                                                                videoInputRef
                                                            }
                                                            type="file"
                                                            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
                                                            className="hidden"
                                                            disabled={
                                                                uploadingVideo ||
                                                                savingLesson
                                                            }
                                                            onChange={(
                                                                e
                                                            ) => {
                                                                const file =
                                                                    e
                                                                        .target
                                                                        .files?.[0];

                                                                if (
                                                                    file
                                                                ) {
                                                                    handleVideoUpload(
                                                                        file
                                                                    );
                                                                }
                                                            }}
                                                        />

                                                        <span className="inline-flex items-center gap-2 rounded-xl border border-purple-400/10 bg-purple-400/5 px-3 py-2 text-xs font-medium text-purple-400 transition hover:border-purple-400/20 hover:bg-purple-400/10">
                                                            <Upload className="h-4 w-4" />
                                                            Replace
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Progress */}
                                    {uploadingVideo && (
                                        <div className="mt-4 rounded-2xl border border-blue-400/10 bg-blue-400/[0.03] p-4">
                                            <div className="mb-3 flex items-center justify-between gap-4 text-xs">
                                                <span className="min-w-0 truncate text-zinc-400">
                                                    {uploadStatus ||
                                                        "Uploading..."}
                                                </span>

                                                <span className="shrink-0 font-bold text-cyan-400">
                                                    {
                                                        uploadProgress
                                                    }
                                                    %
                                                </span>
                                            </div>

                                            <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 shadow-lg shadow-blue-400/20 transition-all duration-300"
                                                    style={{
                                                        width: `${uploadProgress}%`,
                                                    }}
                                                />

                                                <div className="absolute inset-0 animate-pulse bg-white/10" />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={
                                                    cancelVideoUpload
                                                }
                                                className="mt-3 text-xs font-medium text-red-400 transition hover:text-red-300"
                                            >
                                                Cancel upload
                                            </button>
                                        </div>
                                    )}

                                    {/* Success */}
                                    {!uploadingVideo &&
                                        uploadProgress ===
                                        100 &&
                                        lessonForm.videoUrl &&
                                        !uploadError && (
                                            <div className="mt-3 flex items-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-400">
                                                <CircleCheck className="h-4 w-4" />

                                                {uploadStatus ||
                                                    "Video uploaded successfully."}
                                            </div>
                                        )}

                                    {/* Error */}
                                    {uploadError && (
                                        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-xs text-red-400">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                                            <span>
                                                {
                                                    uploadError
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Free / Paid */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-zinc-300">
                                        Lesson Access
                                    </label>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {/* FREE */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLessonForm(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        isFree: true,
                                                    })
                                                )
                                            }
                                            className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${lessonForm.isFree
                                                    ? "border-cyan-400/30 bg-cyan-400/10 shadow-lg shadow-cyan-400/5"
                                                    : "border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/15 hover:bg-cyan-400/[0.03]"
                                                }`}
                                        >
                                            {lessonForm.isFree && (
                                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" />
                                            )}

                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${lessonForm.isFree
                                                            ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                                                            : "border border-white/[0.06] bg-white/5 text-zinc-500 group-hover:text-cyan-400"
                                                        }`}
                                                >
                                                    <LockOpen className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        Free
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-zinc-500">
                                                        Available to all students
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        {/* PAID */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLessonForm(
                                                    (
                                                        prev
                                                    ) => ({
                                                        ...prev,
                                                        isFree: false,
                                                    })
                                                )
                                            }
                                            className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${!lessonForm.isFree
                                                    ? "border-purple-400/30 bg-purple-400/10 shadow-lg shadow-purple-400/5"
                                                    : "border-white/[0.08] bg-white/[0.02] hover:border-purple-400/15 hover:bg-purple-400/[0.03]"
                                                }`}
                                        >
                                            {!lessonForm.isFree && (
                                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" />
                                            )}

                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${!lessonForm.isFree
                                                            ? "border border-purple-400/20 bg-purple-400/10 text-purple-400"
                                                            : "border border-white/[0.06] bg-white/5 text-zinc-500 group-hover:text-purple-400"
                                                        }`}
                                                >
                                                    <Lock className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        Paid
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-zinc-500">
                                                        Requires course access
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                                        Lesson Status
                                    </label>

                                    <select
                                        value={
                                            lessonForm.status
                                        }
                                        onChange={(e) =>
                                            setLessonForm(
                                                (
                                                    prev
                                                ) => ({
                                                    ...prev,
                                                    status: e
                                                        .target
                                                        .value as
                                                        | "draft"
                                                        | "published",
                                                })
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/[0.08] bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/10"
                                    >
                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={
                                            closeLessonModal
                                        }
                                        disabled={
                                            savingLesson ||
                                            uploadingVideo
                                        }
                                        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-blue-400/15 hover:bg-blue-400/5 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={
                                            savingLesson ||
                                            uploadingVideo ||
                                            !lessonForm.videoUrl
                                        }
                                        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-purple-400/20 bg-gradient-to-r from-purple-400/15 via-blue-400/15 to-cyan-400/15 px-5 py-3 text-sm font-semibold text-purple-400 shadow-lg shadow-purple-400/5 transition-all hover:border-cyan-400/30 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                        {savingLesson ? (
                                            <Loader2 className="relative h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="relative h-4 w-4" />
                                        )}

                                        <span className="relative">
                                            {editingLesson
                                                ? "Update Lesson"
                                                : "Create Lesson"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =================================================
                VIDEO PREVIEW MODAL
            ================================================= */}

            {previewVideo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-5">
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-blue-400/15 bg-zinc-950 shadow-2xl shadow-black/60">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400" />

                        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-400">
                                    <PlayCircle className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="truncate text-base font-semibold text-white">
                                        {
                                            previewVideo.title
                                        }
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        {formatDuration(
                                            previewVideo.duration
                                        )}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setPreviewVideo(
                                        null
                                    )
                                }
                                className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 text-zinc-500 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-400"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="bg-black p-3 sm:p-4">
                            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black">
                                <video
                                    src={
                                        previewVideo.videoUrl
                                    }
                                    controls
                                    autoPlay
                                    playsInline
                                    className="mx-auto max-h-[75vh] w-full bg-black object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   RANDOM UPLOAD ID
========================================================= */

function cryptoRandomId() {
    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}