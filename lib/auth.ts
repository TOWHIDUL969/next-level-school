import "server-only";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";
import { getUsersCollection } from "@/lib/users";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.userId) {
    return null;
  }

  if (!ObjectId.isValid(session.userId)) {
    return null;
  }

  const users = await getUsersCollection();

  const user = await users.findOne({
    _id: new ObjectId(session.userId),
  });

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}