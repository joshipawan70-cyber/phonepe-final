import crypto from "crypto";

// ✅ Hardcoded credentials — use same values in your test script
const PHONEPE_USERNAME = "pawanjoshi";
const PHONEPE_PASSWORD = "Pawan1joshi";

function getExpectedAuthHash() {
  const authString = `${PHONEPE_USERNAME}:${PHONEPE_PASSWORD}`;
  return crypto.createHash("sha256").update(authString).digest("hex");
}

export default function handler(req, res) {
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

    res.status(200).send("OK");
  } catch (err) {
    console.error("🔥 Webhook error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
