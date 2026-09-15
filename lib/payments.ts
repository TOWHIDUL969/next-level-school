import "server-only";

import clientPromise from "@/lib/mongodb";

export async function getPaymentsCollection() {
  const client = await clientPromise;
  const db = client.db("next-auth");

  return db.collection("payments");
}