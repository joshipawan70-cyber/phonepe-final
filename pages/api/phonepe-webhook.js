// pages/api/phonepe-webhook.js

import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Basic Auth (if PhonePe sends username/password)
    const authHeader = req.headers.authorization || "";
    const expectedAuth = `Basic ${Buffer.from(
      process.env.PHONEPE_BASIC_AUTH || ""
    ).toString("base64")}`;

    if (!authHeader || authHeader !== expectedAuth) {
      console.warn("Unauthorized webhook attempt");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get the raw body for signature verification
    const body = req.body;
    const rawBody = JSON.stringify(body);

    // Verify webhook signature (if PhonePe provides it)
    const signature = req.headers["x-phonepe-signature"];
    const secret = process.env.PHONEPE_SECRET_KEY || "";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid signature:", signature);
      return res.status(403).json({ error: "Invalid signature" });
    }

    console.log("Webhook received:", body);

    // TODO: Add your database or Firebase handling here
    // Example:
    // await saveTransactionToFirebase(body);

    // Respond to PhonePe
    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Optional: to parse raw JSON in Next.js API routes
export const config = {
  api: {
    bodyParser: true, // Set to true if using standard JSON
  },
};
