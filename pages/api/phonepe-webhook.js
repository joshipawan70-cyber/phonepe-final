// pages/api/phonepe-webhook.js
import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ---- 1. Check Authorization Header ----
  const authHeader = req.headers['authorization'];
  const username = 'pawanjoshi';   // replace with your test username
  const password = 'Pawan1joshi';  // replace with your test password
  const expectedHash = crypto
    .createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex');

  if (!authHeader || authHeader !== `SHA256 ${expectedHash}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ---- 2. Verify PhonePe Signature ----
  const body = JSON.stringify(req.body);  // raw JSON string
  const secretKey = 'ODRjZDRmZTctM2JjYy00MmY2LWIyYjktYzljM2M4MWI5NTBm'; // your PhonePe secret

  const computedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('hex');

  const receivedSignature = req.headers['x-verify'];

  if (!receivedSignature || receivedSignature !== computedSignature) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // ---- 3. Process Webhook Payload ----
  console.log('Webhook payload:', req.body);

  // You can add your business logic here: store in DB, trigger actions, etc.

  return res.status(200).json({ message: 'Webhook processed successfully' });
}
