export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>PhonePe Webhook Server</h1>
      <p>POST your webhook to /api/phonepe-webhook</p>
    </div>
  );
}