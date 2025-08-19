
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));



const connect = require("./database/connection.js");

// Ensure we have a DB connection per request on Vercel
app.use(async (_req, _res, next) => { await connect(); next(); });

// Routes


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

