import { MongoClient } from "mongodb";

let db;

export async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();

  db = client.db(process.env.DATABASE_NAME);

  console.log("✅ MongoDB Connected");
}

export function getDB() {
  return db;
}
