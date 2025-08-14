export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Log what we receive
  console.log("📩 Received webhook:", req.body);

  // Skip signature check for now
  return res.status(200).json({ message: 'Webhook processed successfully' });
}
