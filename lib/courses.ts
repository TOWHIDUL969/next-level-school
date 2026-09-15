import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

/* =========================================================
   COURSE DOCUMENT (database shape)
========================================================= */

export interface CourseDoc {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  price: number;
  instructor: {
    name: string;
    email?: string;
    avatar?: string;
  };
  totalLessons: number;

  // 🔑 coursesTable.tsx যেগুলো চায়
  skills?: string[];
  icon?: string;
  featured?: boolean;

  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   COURSE (serialized / API shape — client-এ পাঠানোর জন্য)
========================================================= */

export interface Course {
  _id: string;                     // 🔑 string, ObjectId না
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  price: number;
  instructor: {
    name: string;
    email?: string;
    avatar?: string;
  };
  totalLessons: number;

  // 🔑 required in client shape (default দিয়ে ভরা হবে)
  skills: string[];
  icon: string;
  featured: boolean;

  status: "draft" | "published";
  createdAt: string;               // 🔑 string
  updatedAt: string;               // 🔑 string
}

/* =========================================================
   COLLECTION
========================================================= */

export async function getCoursesCollection() {
  const client = await clientPromise;
  const db = client.db("next-auth");

  return db.collection<CourseDoc>("courses");
}

/* =========================================================
   SERIALIZER — DB doc → API shape
========================================================= */

export function serializeCourse(
  course: CourseDoc & { _id: ObjectId }
): Course {
  return {
    _id: course._id.toString(),
    title: course.title,
    slug: course.slug,
    description: course.description,
    shortDescription: course.shortDescription,
    thumbnail: course.thumbnail,
    category: course.category,
    level: course.level,
    duration: course.duration,
    price: course.price,
    instructor: {
      name: course.instructor?.name ?? "Next Level School",
      email: course.instructor?.email,
      avatar: course.instructor?.avatar,
    },
    totalLessons: course.totalLessons,

    // 🔑 optional DB fields → required client fields with defaults
    skills: course.skills ?? [],
    icon: course.icon ?? "",
    featured: course.featured ?? false,

    status: course.status,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  };
}