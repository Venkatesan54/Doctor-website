import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MockCheckout = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  const description = searchParams.get('description');
  const navigate = useNavigate();

  const handleConfirm = () => {
    toast.success('Mock payment completed');
    // Redirect to PaymentSuccess with the same mock session ID
    navigate(`/payment-success?session_id=${sessionId}`);
  };

  return (
    <div className="pt-32 max-w-xl mx-auto text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Mock Checkout</h2>
      <p className="mb-2"><strong>Description:</strong> {decodeURIComponent(description || '')}</p>
      <p className="mb-2"><strong>Amount:</strong> {amount ? `${(Number(amount) / 100).toFixed(2)} ${currency?.toUpperCase()}` : ''}</p>
      <button
        onClick={handleConfirm}
        className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default MockCheckout;
