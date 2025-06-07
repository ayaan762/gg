import mongoose from "mongoose";

declare global {
  var mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!global.mongooseGlobal) {
  global.mongooseGlobal = { conn: null, promise: null };
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (global.mongooseGlobal.conn) {
    return global.mongooseGlobal.conn;
  }

  if (!global.mongooseGlobal.promise) {
    global.mongooseGlobal.promise = mongoose.connect(MONGO_URI!, {
      bufferCommands: false,
    });
  }

  global.mongooseGlobal.conn = await global.mongooseGlobal.promise;
  return global.mongooseGlobal.conn;
}
