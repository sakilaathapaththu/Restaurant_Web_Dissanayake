
const WABA_NUMBER_ID = process.env.WABA_NUMBER_ID;      // e.g. "828536603665209"
const WABA_TOKEN     = process.env.WABA_TOKEN;          // system-user long-lived token
const TEMPLATE_NAME  = (process.env.WHATSAPP_TEMPLATE_NAME || "order_confirm_pickup").trim();
const TEMPLATE_LANG  = (process.env.WHATSAPP_TEMPLATE_LANG || "en_US").trim();
const USE_TEMPLATE   = (process.env.WHATSAPP_USE_TEMPLATE || "false").toLowerCase() === "true";
const BUSINESS_NAME  = process.env.BUSINESS_NAME || "Dissanayake Restaurant";

if (!WABA_NUMBER_ID || !WABA_TOKEN) {
  console.warn("[whatsapp] Missing WABA_NUMBER_ID or WABA_TOKEN in .env");
}

const GRAPH_URL = `https://graph.facebook.com/v20.0/${WABA_NUMBER_ID}/messages`;

/** Normalize SL numbers like 0715953153 -> 94715953153 (E.164 without '+') */
function normalizeSriPhone(raw) {
  if (!raw) return raw;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("0")) return "94" + digits.slice(1);
  if (digits.startsWith("94")) return digits;
  return digits; // assume already intl without '+'
}

/** Send plain text */
async function sendText(to, text) {
  if (!to) throw new Error("Recipient number required");
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text }
  };

  const res = await fetch(GRAPH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WABA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`WhatsApp API error: ${JSON.stringify(data)}`);
  return data;
}

/** Send an approved message template */
async function sendTemplate(to, templateName, langCode, components) {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: langCode },
      ...(components && components.length ? { components } : {})
    }
  };

  const res = await fetch(GRAPH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WABA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`WhatsApp API error: ${JSON.stringify(data)}`);
  return data;
}

/** Build the nice multi-line text body for non-template sends */
function buildPlainText(order) {
  const shortId = String(order._id).slice(-8).toUpperCase();
  const timeStr = order.pickupTime
    ? (/^\d{2}:\d{2}$/.test(order.pickupTime) ? order.pickupTime : new Date(order.pickupTime).toLocaleString("en-LK"))
    : "N/A";

  const itemsLines = (order.items || [])
    .map(i => `• ${i.quantity}× ${(i.name || i?.foodId?.name || "").trim()}`)
    .filter(Boolean);

  const itemsBlock = itemsLines.length ? itemsLines.join("\n") : "—";

  return (
`✅ ${shortId} — Order Confirmed

Hi ${order.customerName || "Customer"}, your order #${shortId} is confirmed.
Pickup time: ${timeStr}
Total: LKR ${Number(order.grandTotal || 0).toLocaleString("en-LK")}

Items:
${itemsBlock}

Thank you!
— ${BUSINESS_NAME}`
  );
}

/**
 * Send the confirmation message.
 * If template mode is ON and template ≠ hello_world, it fills placeholders:
 * TEMPLATE BODY should be exactly:
 *
 *  ✅ {{1}} — Order Confirmed
 *
 *  Hi {{2}}, your order #{{3}} is confirmed.
 *  Pickup time: {{4}}
 *  Total: LKR {{5}}
 *
 *  Items:
 *  {{6}}
 *
 *  Thank you!
 */
async function sendOrderConfirmation(order) {
  const to = normalizeSriPhone(order.customerPhone);
  if (!to) throw new Error("Empty/invalid recipient number");

  // If using hello_world template, it has no params — just send it (good for first-time test)
  if (USE_TEMPLATE && TEMPLATE_NAME.toLowerCase() === "hello_world") {
    return await sendTemplate(to, TEMPLATE_NAME, TEMPLATE_LANG);
  }

  if (USE_TEMPLATE) {
    // Build parameters for template body
    const shortId = String(order._id).slice(-8).toUpperCase();
    const timeStr = order.pickupTime
      ? (/^\d{2}:\d{2}$/.test(order.pickupTime) ? order.pickupTime : new Date(order.pickupTime).toLocaleString("en-LK"))
      : "N/A";

    const itemsLines = (order.items || [])
      .map(i => `• ${i.quantity}× ${(i.name || i?.foodId?.name || "").trim()}`)
      .filter(Boolean);

    // Keep within safe param length (~1k). Trim if too long.
    let itemsBlock = itemsLines.join("\n");
    if (itemsBlock.length > 900) itemsBlock = itemsBlock.slice(0, 897) + "…";

    const components = [
      {
        type: "body",
        parameters: [
          { type: "text", text: shortId },                                                           // {{1}}
          { type: "text", text: order.customerName || "Customer" },                                  // {{2}}
          { type: "text", text: shortId },                                                           // {{3}}
          { type: "text", text: timeStr },                                                           // {{4}}
          { type: "text", text: Number(order.grandTotal || 0).toLocaleString("en-LK") },            // {{5}}
          { type: "text", text: itemsBlock },                                                        // {{6}}
        ],
      },
    ];

    return await sendTemplate(to, TEMPLATE_NAME, TEMPLATE_LANG, components);
  }

  // Fallback: plain text (requires test-recipient or 24h session)
  const body = buildPlainText(order);
  return await sendText(to, body);
}

module.exports = {
  normalizeSriPhone,
  sendText,
  sendTemplate,
  sendOrderConfirmation,   // ← controller will call this with the full order doc
};
