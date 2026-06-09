import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

function CartSidebar({ cart, setCart, cartTotal, setCartOpen, showToast, stripePromise, darkMode }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '320px', height: '100vh', background: darkMode ? '#1a1a2e' : 'white', color: darkMode ? 'white' : 'inherit', boxShadow: '-4px 0 12px rgba(0,0,0,0.15)', padding: '24px', zIndex: 1000, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
        <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>x</button>
      </div>

      {cart.length === 0 ? (
        <p style={{ color: '#888' }}>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>{item.name}</p>
              <p style={{ margin: '0 0 8px', color: '#888', fontSize: '14px' }}>${item.price} each</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setCart(prev => prev.map(i => i.id === item.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '16px' }}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                  <button
                    onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '16px' }}
                  >
                    +
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>${(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                  <button
                    onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                    style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #1a1a2e' }}>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Total: ${cartTotal.toFixed(2)}</p>
            <button
              onClick={() => setCheckoutOpen(!checkoutOpen)}
              style={{ width: '100%', background: '#1a1a2e', color: 'white', border: 'none', padding: '14px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
            >
              Checkout
            </button>
            {checkoutOpen && (
              <div style={{ marginTop: '20px' }}>
                <h3>Payment Details</h3>
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    total={cartTotal}
                    onSuccess={() => {
                      setCart([]);
                      setCheckoutOpen(false);
                      setCartOpen(false);
                      showToast('Payment successful! Order placed.');
                    }}
                  />
                </Elements>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CartSidebar;