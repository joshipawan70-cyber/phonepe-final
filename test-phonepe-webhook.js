// test-phonepe-webhook.js
const crypto = require("crypto");
const axios = require("axios");

// ====== CONFIG ======
const WEBHOOK_URL = "https://phonepe-final-onktnxrzf-pawans-projects-1a01a468.vercel.app/api/phonepe-webhook"; // Your webhook endpoint
const USERNAME = "pawanjoshi"; // PhonePe webhook username
const PASSWORD = "Pawan1joshi"; // PhonePe webhook password
// ====================

// 1️⃣ Generate Authorization header
function generateAuthHash(username, password) {
  const authString = `${username}:${password}`;
  return crypto.createHash("sha256").update(authString).digest("hex");
}

// 2️⃣ Create test payload
const testPayload = {
  event: "checkout.order.completed",
  payload: {
    orderId: "TESTORDER123",
    merchantId: "merchantId",
    merchantOrderId: "merchantOrderId",
    state: "COMPLETED",
    amount: 10000,
    expireAt: Date.now() + 3600000
  }
};

// 3️⃣ Send request
async function sendTestWebhook() {
  try {
    const authHash = generateAuthHash(USERNAME, PASSWORD);

    console.log("🔐 Generated Authorization Hash:", authHash);
    console.log("📩 Sending test webhook...");

    const response = await axios.post(WEBHOOK_URL, testPayload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHash
      }
    });

    console.log("✅ Webhook sent successfully");
    console.log("📜 Response from server:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ Server responded with error:", error.response.status, error.response.data);
    } else {
      console.error("🔥 Request failed:", error.message);
    }
  }
}

sendTestWebhook();
