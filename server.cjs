/**
 * SECURITY PROXY SERVER
 * -------------------------------------------------------------
 * This is a lightweight Node.js Express server to proxy OpenAI requests.
 * By moving the VITE_OPENAI_API_KEY from the React bundle to this backend file,
 * we prevent malicious users from stealing your API key via their browsers.
 * 
 * To run this server: 
 * 1. npm install express cors dotenv node-fetch
 * 2. node server.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load the API key from a private .env file

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "AIzaSyCkNi3QtmAgRIidePdF9D5_GtV-yTBW-XE";

// Stripe configuration (set STRIPE_SECRET_KEY in .env for server)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
let stripe = null;
if (STRIPE_SECRET_KEY) {
  try {
    stripe = require('stripe')(STRIPE_SECRET_KEY);
  } catch {
    console.warn('Stripe SDK not available or invalid key. Stripe endpoints will fail.');
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { question, conversation } = req.body;

    // Optional: Add rate limiting, abuse detection, and user authentication here!

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversation ? conversation.map(m => ({ role: m.role, content: m.text })) : [{ role: "user", content: question }],
        max_tokens: 350,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || "No response generated.";

    res.json({ reply: answer });

  } catch (error) {
    console.error("Backend Proxy Error:", error);
    res.status(500).json({ reply: "Internal server error connecting to the AI." });
  }
});

// Create a Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency = 'inr', appointmentId, description } = req.body;

    if (!amount || !appointmentId) return res.status(400).json({ error: 'Missing amount or appointmentId' });

    const host = process.env.CLIENT_URL || `http://localhost:5173${process.env.VITE_BASE_PATH || ''}`;
    const successUrl = `${host}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${host}/`;

    if (!stripe) {
      // Mock payment fallback if Stripe keys are missing
      const mockSessionId = `mock_${appointmentId}_${Date.now()}`;
      const mockUrl = `${host}/mock-checkout?session_id=${mockSessionId}&amount=${amount}&currency=${currency}&description=${encodeURIComponent(description || 'Consultation Fee')}`;
      return res.json({ url: mockUrl, id: mockSessionId });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description || 'Consultation Fee' },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { appointmentId: String(appointmentId) },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Create Checkout Session Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Retrieve Checkout Session details (server-side) for verification
app.get('/api/checkout-session', async (req, res) => {
  try {
    const sessionId = req.query.sessionId || req.query.session_id;
    if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

    if (sessionId.startsWith('mock_')) {
      const parts = sessionId.split('_');
      const appointmentId = parts[1] || 'unknown';
      return res.json({
        id: sessionId,
        payment_status: 'paid',
        currency: 'inr',
        amount_total: 50000,
        metadata: { appointmentId },
        payment_intent: { id: `pi_mock_${appointmentId}` }
      });
    }

    if (!stripe) return res.status(500).json({ error: 'Stripe not configured on server.' });
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
    res.json(session);
  } catch (err) {
    console.error('Checkout Session fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Security Proxy Server running on http://localhost:${PORT}`);
});
