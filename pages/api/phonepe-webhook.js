// pages/api/phonepe-webhook.js
import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // ----- 1. Basic Auth -----
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing Basic Auth' });
  }

  const encoded = auth.split(' ')[1];
  const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':');

  if (user !== process.env.PHONEPE_USER || pass !== process.env.PHONEPE_PASS) {
    return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
  }

  // ----- 2. Signature Verification -----
  const signature = req.headers['x-verify'] || req.headers['x-callback-signature'];
  if (!signature) {
    return res.status(403).json({ message: 'Forbidden: Missing signature' });
  }

  const secret = process.env.PHONEPE_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body));
  const expectedSignature = hmac.digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({ message: 'Forbidden: Invalid signature' });
  }

  // ----- 3. Process the payload -----
  const payload = req.body;
  console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

  // Example: extract some details
  const event = payload.event;
  const merchantId = payload.payload.merchantId;
  const orderId = payload.payload.orderId;

  console.log(`Event: ${event}, Merchant: ${merchantId}, Order: ${orderId}`);

  // ----- 4. Respond with success -----
  res.status(200).json({ message: 'Webhook processed successfully' });
}
