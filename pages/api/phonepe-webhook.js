import crypto from "crypto";

// Load credentials from Vercel environment variables
const PHONEPE_USERNAME = process.env.PHONEPE_USERNAME;
const PHONEPE_PASSWORD = process.env.PHONEPE_PASSWORD;

function getExpectedAuthHash() {
  const authString = `${PHONEPE_USERNAME}:${PHONEPE_PASSWORD}`;
  return crypto.createHash("sha256").update(authString).digest("hex");
}

export default function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const incomingAuth = req.headers["authorization"];
    const expectedHash = getExpectedAuthHash();

    console.log("📥 Incoming Authorization:", incomingAuth);
    console.log("🔑 Expected Authorization:", expectedHash);

    if (!incomingAuth || incomingAuth !== expectedHash) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { event, payload } = req.body;
    console.log("📩 Event:", event);
    console.log("📦 Payload:", payload);

    // Example event handling
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
        console.log(`ℹ️ Unknown Event: ${event}`);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
