import fetch from "node-fetch"; // If Node >=18, you can skip this import
import dotenv from "dotenv";
dotenv.config();

const webhookUrl = "https://phonepetry-lzg31zyf1-pawans-projects-98a0b874.vercel.app/api/phonepe-webhook";

async function sendWebhook() {
  try {
    const payload = {
      transactionId: "test123",
      status: "SUCCESS",
      amount: 10000,
      message: "Payment successful",
    };

    const response = await fetch(webhookUrl, {
      method: "POST",                     // Must be POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),      // JSON payload
    });

    // Safely parse response if it's JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Webhook response:", data);
    } else {
      const text = await response.text();
      console.log("Response is not JSON:", text);
    }
  } catch (err) {
    console.error("Error sending webhook:", err);
  }
}

// Run the test
sendWebhook();
