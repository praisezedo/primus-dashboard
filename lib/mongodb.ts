import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGO_URI!;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!MONGODB_URL) {
    throw new Error('Please define MONGODB_URL in .env.local');
}

let cached = (global as any).mongoose as MongooseCache;

if(!cached) {
    cached = (global as any).mongoose = {conn: null , promise: null};
}

export async function connectDB() {

    if (cached.conn) return cached.conn;
    
    if (!cached.promise) {
         cached.promise = mongoose.connect(MONGODB_URL).then((mongoose) => mongoose);
    }

    if (process.env.NODE_ENV === "development") {
        console.log('mongodb connected!!')
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
