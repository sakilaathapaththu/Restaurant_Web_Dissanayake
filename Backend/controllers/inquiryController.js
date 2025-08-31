const Inquiry = require("../models/Inquiry");
const { sendTemplateWithParams, RESTAURANT_OFFICIAL_WA } = require("../services/whatsapp");

const clean = (s = "") => String(s).replace(/\s+/g, " ").trim();
const toE164Guess = (p) => {
  const digits = String(p || "").replace(/\D/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
};

exports.create = async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.type || !["question", "reservation", "event"].includes(b.type))
      return res.status(400).json({ error: "Invalid type" });
    if (!b.firstName || !b.phone || !b.message)
      return res.status(400).json({ error: "Missing required fields" });

    const doc = await Inquiry.create({
      type: b.type,
      firstName: clean(b.firstName),
      lastName:  clean(b.lastName || ""),
      email:     clean(b.email || ""),
      phone:     toE164Guess(b.phone),
      date: b.date || "",
      time: b.time || "",
      guests: b.guests ? Number(b.guests) : undefined,
      occasion: clean(b.occasion || ""),
      budgetRange: clean(b.budgetRange || ""),
      message: clean(b.message),
      agreeToPolicy: !!b.agreeToPolicy,
    });

    const summary = [
      doc.date && `Date: ${doc.date}`,
      doc.time && `Time: ${doc.time}`,
      doc.guests && `Guests: ${doc.guests}`,
      doc.occasion && `Occasion: ${doc.occasion}`,
      doc.budgetRange && `Budget: ${doc.budgetRange}`,
      `Message: ${doc.message}`,
    ].filter(Boolean).join("\n");

    // Send to the restaurant's official WA (business-initiated requires template)

    res.status(201).json({ ok: true, data: doc });

    sendTemplateWithParams(
      RESTAURANT_OFFICIAL_WA,
      "inquiry_alert",
      [doc.type.toUpperCase(), `${doc.firstName} ${doc.lastName}`.trim(), doc.phone, summary]
    ).catch(err => console.error("WA send failed:", err));

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.list = async (req, res) => {
  const { type, status, q } = req.query;
  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (q) {
    where.$or = [
      { firstName: new RegExp(q, "i") },
      { lastName:  new RegExp(q, "i") },
      { phone:     new RegExp(q, "i") },
      { email:     new RegExp(q, "i") },
      { message:   new RegExp(q, "i") },
    ];
  }
  const list = await Inquiry.find(where).sort({ createdAt: -1 });
  res.json({ data: list });
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, internalNotes } = req.body;
  const allowed = ["new", "seen", "handled"];
  if (status && !allowed.includes(status)) return res.status(400).json({ error: "Bad status" });

  const doc = await Inquiry.findByIdAndUpdate(
    id, { ...(status ? { status } : {}), ...(internalNotes ? { internalNotes } : {}) }, { new: true }
  );
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ data: doc });
};

