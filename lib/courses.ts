import clientPromise from "./mongodb";

export interface Course {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;

  thumbnail: string;

  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";

  duration: number; // hours

  price: number;

  instructor: {
    name: string;
    email?: string;
  };

  totalLessons: number;

  status: "draft" | "published";

  createdAt: Date;
  updatedAt: Date;
}

export async function getCoursesCollection() {
  const client = await clientPromise;

  const db = client.db("next-auth");

  return db.collection<Course>("courses");
}