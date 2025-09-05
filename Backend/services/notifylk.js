// services/notifylk.js
const axios = require("axios");

// services/notifylk.js (fetch version)
const USER_ID = process.env.NOTIFYLK_USER_ID;
const API_KEY = process.env.NOTIFYLK_API_KEY;
const SENDER_ID = process.env.NOTIFYLK_SENDER_ID;

async function sendSms(to94, message) {
  const url = new URL("https://app.notify.lk/api/v1/send");
  url.search = new URLSearchParams({
    user_id: USER_ID,
    api_key: API_KEY,
    sender_id: SENDER_ID,
    to: to94,            // '94XXXXXXXXX' (no +)
    message
  }).toString();

  const rsp = await fetch(url);
  const data = await rsp.json();
  if (data?.status !== "success") {
    throw new Error(data?.message || "Notify.lk send failed");
  }
  return data;
}

module.exports = { sendSms };

