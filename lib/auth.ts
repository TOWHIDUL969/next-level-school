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

/**
 * Protected pages
 * User না থাকলে login page এ redirect করবে
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Admin protected pages
 * Admin না হলে dashboard এ redirect করবে
 */
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}

/**
 * API routes এর জন্য
 * Redirect করবে না।
 *
 * User না থাকলে null
 * Admin না হলে null
 * Admin হলে user return করবে
 */
export async function requireAdminApi() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return null;
  }

  return user;
}