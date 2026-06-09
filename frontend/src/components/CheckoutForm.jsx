import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm({ total, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setProcessing(true);
    setError(null);

    const res = await fetch('http://localhost:8000/api/create-payment-intent/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total })
    });

    const { client_secret } = await res.json();

    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ddd', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
        <CardElement />
      </div>
      {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={!stripe || processing}
        style={{ width: '100%', background: processing ? '#888' : '#1a1a2e', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: processing ? 'not-allowed' : 'pointer', fontSize: '16px' }}
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </div>
  );
}

export default CheckoutForm;