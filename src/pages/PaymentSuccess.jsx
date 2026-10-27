import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchCheckoutSession } from "../lib/payments";
import { createPaymentRecord, updateAppointmentPayment } from "../lib/firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        toast.error('Missing session id');
        navigate('/');
        return;
      }

      try {
        const session = await fetchCheckoutSession(sessionId);
        // session contains payment_intent and metadata
        const paymentIntent = session.payment_intent;
        const appointmentId = session.metadata?.appointmentId || null;
        const amountTotal = session.amount_total ? session.amount_total / 100 : (session.display_items?.[0]?.amount || 0) / 100;

        // Create payment record in Firestore
        const paymentData = {
          userId: currentUser?.uid || session.customer_email || null,
          appointmentId,
          sessionId: session.id,
          transactionId: paymentIntent?.id || session.payment_intent || null,
          amount: amountTotal,
          currency: session.currency || 'inr',
          status: session.payment_status || 'paid',
          receiptUrl: paymentIntent?.charges?.data?.[0]?.receipt_url || null,
        };

        const receiptId = await createPaymentRecord(paymentData);

        // Update appointment with payment info
        if (appointmentId) {
          await updateAppointmentPayment(appointmentId, {
            method: 'stripe',
            transactionId: paymentData.transactionId,
            receiptId,
            status: 'confirmed'
          });
        }

        toast.success('Payment successful and recorded.');
        setLoading(false);
      } catch (err) {
        console.error('Payment verification failed:', err);
        toast.error('Payment verification failed. Please contact support.');
        navigate('/');
      }
    };

    verify();
  }, [sessionId, currentUser, navigate]);

  if (loading) return <div className="pt-32 text-center">Verifying payment...</div>;

  return (
    <div className="pt-32 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold">Payment Complete</h2>
      <p className="mt-4">Your payment was successful. A receipt has been saved to your account.</p>
      <div className="mt-6">
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
