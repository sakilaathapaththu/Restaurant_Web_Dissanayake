// controllers/otpController.js
const { randomUUID } = require("crypto");
const { sendSms } = require("../services/notifylk");

// simple in-memory store; replace with Redis/DB for production or PM2 clusters
const store = new Map();
// { otpId: { code, phone, expiresAt, attempts } }

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body; // '94xxxxxxxxx'
    if (!/^94\d{9}$/.test(phone)) return res.status(400).json({ ok: false, message: "Invalid phone (use 94xxxxxxxxx)" });

    const code = genCode();
    const otpId = randomUUID();
    const expiresAt = Date.now() + OTP_TTL_MS;

    // send via notify.lk
    const msg = `Your Dissanayake Restaurant OTP is ${code}. It expires in 5 minutes.`;
    await sendSms(phone, msg);

    store.set(otpId, { code, phone, expiresAt, attempts: 0 });
    res.json({ ok: true, otpId });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message || "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otpId, code } = req.body;
    const rec = store.get(otpId);
    if (!rec) return res.status(400).json({ ok: false, message: "OTP expired. Please resend." });

    if (Date.now() > rec.expiresAt) {
      store.delete(otpId);
      return res.status(400).json({ ok: false, message: "OTP expired. Please resend." });
    }
    if ((rec.attempts || 0) >= MAX_ATTEMPTS) {
      store.delete(otpId);
      return res.status(400).json({ ok: false, message: "Too many attempts. Please resend." });
    }

    rec.attempts = (rec.attempts || 0) + 1;

    if (String(code) !== String(rec.code)) {
      return res.status(400).json({ ok: false, message: "Invalid code. Try again." });
    }

    // success → one-time use
    store.delete(otpId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message || "Verification failed" });
  }
};
