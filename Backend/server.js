
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("tiny"));



const adminRoutes = require("./routes/adminRoutes");

const connect = require("./database/connection.js");

// Ensure we have a DB connection per request on Vercel
app.use(async (_req, _res, next) => {
  try { await connect(); next(); } catch (e) { next(e); }
});


// Routes

app.use("/api/admins", adminRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const menuItemRoutes = require("./routes/menuItemRoutes");
app.use("/api/menu-items", menuItemRoutes);

// health
app.get("/", (_req, res) => res.json({ ok: true }));


// ✅ On Vercel, export the app instead of listening
if (process.env.VERCEL) {
  module.exports = app;
} else {
  connect().then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  }).catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });
}

