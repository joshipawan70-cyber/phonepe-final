// phonepe-webhook.js
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Replace with your PhonePe username and password from dashboard
const PHONEPE_USERNAME = "pawanjoshi";
const PHONEPE_PASSWORD = "Pawan1joshi";

// Function to compute expected SHA256 hash
function getExpectedAuthHash() {
  const authString = `${PHONEPE_USERNAME}:${PHONEPE_PASSWORD}`;
  return crypto.createHash("sha256").update(authString).digest("hex");
}

app.post("/phonepe-webhook", (req, res) => {
  try {
    // 1️⃣ Extract Authorization header
    const incomingAuth = req.headers["authorization"];
    if (!incomingAuth) {
      console.warn("❌ Missing Authorization header");
      return res.status(401).send("Missing Authorization header");
    }

    // 2️⃣ Verify hash
    const expectedHash = getExpectedAuthHash();
    if (incomingAuth !== expectedHash) {
      console.warn("❌ Invalid Authorization hash");
      return res.status(403).send("Unauthorized");
    }

    // 3️⃣ Extract event & payload
    const { event, payload } = req.body;
    if (!event || !payload) {
      console.warn("❌ Missing event or payload in webhook body");
      return res.status(400).send("Invalid webhook data");
    }

    console.log(`📩 Received event: ${event}`);

    // 4️⃣ State validation (only trust after auth passes)
    if (payload.state && payload.state !== "COMPLETED" && payload.state !== "CONFIRMED") {
      console.warn(`⚠️ Ignoring event with non-final state: ${payload.state}`);
      return res.status(200).send("Ignored - state not completed");
    }

    // 5️⃣ Process specific events
    switch (event) {
      case "checkout.order.completed":
        console.log(`✅ Order Completed: ${payload.orderId}`);
        break;
      case "checkout.order.failed":
        console.log(`❌ Order Failed: ${payload.orderId}`);
        break;
      case "pg.refund.completed":
        console.log(`💰 Refund Completed: ${payload.merchantRefundId}`);
        break;
      case "pg.refund.failed":
        console.log(`⚠️ Refund Failed: ${payload.merchantRefundId}`);
        break;
      default:
        console.log(`ℹ️ Unknown Event Type: ${event}`);
    }

    // 6️⃣ Acknowledge
    res.status(200).send("OK");
  } catch (err) {
    console.error("🔥 Webhook processing error:", err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📡 PhonePe Webhook server running on port ${PORT}`);
});
