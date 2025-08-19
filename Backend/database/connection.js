// database/connection.js
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGO_URI;
if (!MONGODB_URI) throw new Error("Missing MONGO_URI");

mongoose.set("strictQuery", false);

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: "Restaurant_Dissanayake" }) // no deprecated options
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connect;
