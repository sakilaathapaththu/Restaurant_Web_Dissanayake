// const fetch = require("node-fetch");

//   const WABA_TOKEN = process.env.WABA_TOKEN;
//   const WABA_PHONE_NUMBER_ID = process.env.WABA_NUMBER_ID;
//   const RESTAURANT_OFFICIAL_WA = process.env.RESTAURANT_OFFICIAL_WA;
//  // E.164 without '+'

// function assertEnv() {
//   const missing = [];
//   if (!WABA_TOKEN) missing.push("WABA_TOKEN");
//   if (!WABA_PHONE_NUMBER_ID) missing.push("WABA_NUMBER_ID");
//   if (!RESTAURANT_OFFICIAL_WA) missing.push("RESTAURANT_OFFICIAL_WA");
//   if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
// }

// async function sendTemplateWithParams(to, templateName, params = [], langCode = "en") {
//   assertEnv();
//   const url = `https://graph.facebook.com/v20.0/${WABA_PHONE_NUMBER_ID}/messages`;
//   const body = {
//     messaging_product: "whatsapp",
//     to,
//     type: "template",
//     template: {
//       name: templateName,
//       language: { code: langCode },
//       components: params.length
//         ? [{ type: "body", parameters: params.map(t => ({ type: "text", text: String(t).slice(0, 512) })) }]
//         : undefined,
//     },
//   };

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${WABA_TOKEN}`, "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   const text = await res.text();
//   if (!res.ok) throw new Error(`WhatsApp API error: ${text}`);
//   try { return JSON.parse(text); } catch { return text; }
// }

// module.exports = { sendTemplateWithParams, RESTAURANT_OFFICIAL_WA };
// services/whatsapp.js
// If you're on Node 18+, REMOVE the node-fetch require and use global fetch.
// const fetch = require('node-fetch');  // ❌ remove on Node 18+
// services/whatsapp.js
// If you're on Node 18+, global fetch exists. On Node 16, uncomment next line:
// const fetch = require('node-fetch');

const WABA_TOKEN = process.env.WABA_TOKEN;
const WABA_NUMBER_ID = process.env.WABA_NUMBER_ID;
const BUSINESS_NAME = process.env.BUSINESS_NAME || 'Restaurant';
const WA_TEMPLATE_NAME = process.env.WA_TEMPLATE_NAME;      // e.g., order_confirm_pickup
const WA_TEMPLATE_LANG = process.env.WA_TEMPLATE_LANG || 'en_US'; // ✅ default to en_US

function assertEnv() {
  const miss = [];
  if (!WABA_TOKEN) miss.push('WABA_TOKEN');
  if (!WABA_NUMBER_ID) miss.push('WABA_NUMBER_ID');
  if (miss.length) throw new Error(`Missing env: ${miss.join(', ')}`);
}

function toE164(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('94')) return d;
  if (d.startsWith('0') && d.length === 10) return '94' + d.slice(1);
  if (d.startsWith('7') && d.length === 9) return '94' + d;
  if (d.startsWith('+')) return d.slice(1);
  return d;
}

async function callGraph(body) {
  assertEnv();
  const url = `https://graph.facebook.com/v22.0/${WABA_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WABA_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`WhatsApp API error: ${text}`);
  try { return JSON.parse(text); } catch { return text; }
}

async function sendTemplate(to, templateName, params) {     // ✅ remove lang arg
  return callGraph({
    messaging_product: 'whatsapp',
    to: toE164(to),
    type: 'template',
    template: {
      name: templateName,
      language: { code: WA_TEMPLATE_LANG },                 // ✅ use env language
      components: [{
        type: 'body',
        parameters: params.map(t => ({ type: 'text', text: String(t).slice(0,512) }))
      }]
    }
  });
}

async function sendText(to, body) {
  return callGraph({
    messaging_product: 'whatsapp',
    to: toE164(to),
    type: 'text',
    text: { preview_url: false, body }
  });
}

// Public helper used by controller
async function sendOrderConfirmed(order) {
  const itemsSummary = (order.items || [])
    .map(i => `${i.quantity}× ${i.name || i?.foodId?.name || ''}`.trim())
    .join(', ');

  const shortId = String(order._id).slice(-8).toUpperCase();
  const timeStr = /^\d{2}:\d{2}$/.test(order.pickupTime || '')
    ? order.pickupTime
    : (order.pickupTime ? new Date(order.pickupTime).toLocaleString('en-LK') : 'N/A');

  if (WA_TEMPLATE_NAME) {
    // ✅ now uses en_US (or whatever you set) under the hood
    return sendTemplate(order.customerPhone, WA_TEMPLATE_NAME, [
      BUSINESS_NAME,                              // {{1}}
      order.customerName || 'Customer',           // {{2}}
      shortId,                                    // {{3}}
      timeStr,                                    // {{4}}
      Number(order.grandTotal || 0).toLocaleString('en-LK'), // {{5}}
      itemsSummary                                // {{6}}
    ]);
  }

  const body =
`✅ ${BUSINESS_NAME} — Order Confirmed

Hi ${order.customerName || 'Customer'},
Your order #${shortId} is confirmed.

Pickup time: ${timeStr}
Total: LKR ${Number(order.grandTotal || 0).toLocaleString('en-LK')}
Items: ${itemsSummary}

Thank you!`;

  return sendText(order.customerPhone, body);
}

module.exports = { sendOrderConfirmed };
