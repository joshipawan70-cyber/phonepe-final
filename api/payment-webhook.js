export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("Webhook received:", req.body);

    // Respond to PhonePe or test requests
    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
      data: req.body
    });
  } else if (req.method === "GET") {
    return res.status(200).json({
      message: "PhonePe Webhook is running!"
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
