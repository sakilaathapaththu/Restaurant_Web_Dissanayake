module.exports = function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.admin?.role) return res.status(401).json({ error: "Unauthenticated" });
    if (!allowed.includes(req.admin.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
};
