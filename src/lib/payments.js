

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export const createCheckoutSession = async ({ amount, currency = 'inr', appointmentId, description }) => {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, appointmentId, description })
  });
  if (!res.ok) throw new Error('Failed to create checkout session');
  return res.json();
};

export const fetchCheckoutSession = async (sessionId) => {
  const res = await fetch(`${API_BASE}/api/checkout-session?sessionId=${encodeURIComponent(sessionId)}`);
  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
};

export default { createCheckoutSession, fetchCheckoutSession };
