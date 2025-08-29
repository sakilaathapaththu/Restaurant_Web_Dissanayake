const fetch = require("node-fetch");

  const WABA_TOKEN = process.env.WABA_TOKEN;
  const WABA_PHONE_NUMBER_ID = process.env.WABA_NUMBER_ID;
  const RESTAURANT_OFFICIAL_WA = process.env.RESTAURANT_OFFICIAL_WA;
 // E.164 without '+'

function assertEnv() {
  const missing = [];
  if (!WABA_TOKEN) missing.push("WABA_TOKEN");
  if (!WABA_PHONE_NUMBER_ID) missing.push("WABA_NUMBER_ID");
  if (!RESTAURANT_OFFICIAL_WA) missing.push("RESTAURANT_OFFICIAL_WA");
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}

async function sendTemplateWithParams(to, templateName, params = [], langCode = "en") {
  assertEnv();
  const url = `https://graph.facebook.com/v20.0/${WABA_PHONE_NUMBER_ID}/messages`;
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: langCode },
      components: params.length
        ? [{ type: "body", parameters: params.map(t => ({ type: "text", text: String(t).slice(0, 512) })) }]
        : undefined,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${WABA_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`WhatsApp API error: ${text}`);
  try { return JSON.parse(text); } catch { return text; }
}

module.exports = { sendTemplateWithParams, RESTAURANT_OFFICIAL_WA };
