// Backend/services/orderSms.js
const { sendSms } = require("./notifylk");   // reuse your working OTP sender
const BUSINESS_NAME = process.env.BUSINESS_NAME || "Dissanayake Restaurant";

/** Normalize SL numbers like 0715953153 -> 94715953153 (E.164 without '+') */
function normalizeSriPhone(raw) {
  if (!raw) return raw;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("0")) return "94" + digits.slice(1);
  if (digits.startsWith("94")) return digits;
  return digits; // assume already intl without '+'
}

// Short, SMS-friendly text
function buildOrderConfirmText(order) {
  const shortId = String(order._id).slice(-8).toUpperCase();
  const timeStr = order.pickupTime
    ? (/^\d{2}:\d{2}$/.test(order.pickupTime) ? order.pickupTime : new Date(order.pickupTime).toLocaleString("en-LK"))
    : "N/A";
  const total = Number(order.grandTotal || 0).toLocaleString("en-LK");
  return `${BUSINESS_NAME}: Order #${shortId} confirmed. Pickup: ${timeStr}. Total: LKR ${total}. Thank you!`;
}

async function sendOrderSMS(order) {
  const to = normalizeSriPhone(order.customerPhone);
  if (!to) throw new Error("Empty/invalid recipient number");
  const message = buildOrderConfirmText(order);
  return await sendSms(to, message);
}

module.exports = { sendOrderSMS };
