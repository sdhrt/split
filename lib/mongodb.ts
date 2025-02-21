import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URL;

export async function connectMongo() {
  if (MONGO_DB_URI) {
    mongoose.connect(MONGO_DB_URI).catch(err => console.error(err));
  } else {
    throw new Error("Please specify mongo db url in .env.local");
  }
}
