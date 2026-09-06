import clientPromise from "./mongodb";

export async function getUsersCollection() {
  const client = await clientPromise;

  const db = client.db("next-auth");

  return db.collection("users");
}