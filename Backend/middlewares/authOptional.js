const jwt = require("jsonwebtoken");
module.exports = function authOptional(req, _res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return next();
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: d.id, role: d.role };
  } catch {}
  next();
};
