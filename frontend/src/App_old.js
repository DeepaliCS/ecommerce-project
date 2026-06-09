import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51TgNnxHKAmFE5IJpgiaimwTaUV2HDEKJsF3xxE6fUSzMGj4n36YyAbbhwGl0yPKMA8SifL19gaDGgw9zihG6Bzll00zrHQQlHL');

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

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

useEffect(() => {
  fetch('http://localhost:8000/api/products/')
    .then(res => res.json())
    .then(data => {
      setProducts(data);
      setLoading(false); // setTimeout(() => setLoading(true), 2000);
    });

    fetch('http://localhost:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const showToast = (message) => {
  const id = Date.now();
  setToasts(prev => [...prev, { id, message }]);
  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, 3000);
};

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filtered = products.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category?.name === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: darkMode ? '#0f0f1a' : '#f5f5f5', color: darkMode ? 'white' : 'inherit' }}>

    {/* Navbar */}
    <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ color: 'white', margin: 0, fontSize: '22px' }}>Deepali's Shop</h1>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={() => setCartOpen(!cartOpen)} style={{ background: '#e94560', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}>
          Cart ({cartCount})
        </button>
      </div>
    </div>

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

      {/* Cart Sidebar */}
      {cartOpen && (
  <div style={{ position: 'fixed', right: 0, top: 0, width: '320px', height: '100vh', background: 'white', boxShadow: '-4px 0 12px rgba(0,0,0,0.15)', padding: '24px', zIndex: 1000, overflowY: 'auto' }}>
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
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}>Remove</button>
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
)}

      {/* Search and Filter */}
      <div style={{ padding: '24px 32px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', width: '280px' }}
        />
        {['All', ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: selectedCategory === cat ? '#1a1a2e' : 'white', color: selectedCategory === cat ? 'white' : '#333', fontWeight: selectedCategory === cat ? 'bold' : 'normal' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {loading ? (
          [1,2,3,4].map(n => (
            <div key={n} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div className="skeleton" style={{ height: '180px', width: '100%' }} />
              <div style={{ padding: '16px' }}>
                <div className="skeleton" style={{ height: '12px', width: '60px', marginBottom: '10px' }} />
                <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '6px' }} />
                <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ height: '24px', width: '60px' }} />
                  <div className="skeleton" style={{ height: '36px', width: '100px', borderRadius: '6px' }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          filtered.map(product => (
            <div key={product.id} style={{ background: darkMode ? '#1a1a2e' : 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <img src={`https://picsum.photos/seed/${product.id}/400/200`} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>{product.category?.name}</span>
                <h3 style={{ margin: '6px 0', fontSize: '16px' }}>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: '0 0 12px' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>${product.price}</span>
                  <button onClick={() => addToCart(product)} style={{ background: '#e94560', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                    Add to Cart
                  </button>

                </div>
                <p style={{ fontSize: '12px', color: product.stock > 10 ? 'green' : 'orange', margin: '8px 0 0' }}>{product.stock} in stock</p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Toast Notifications */}
  <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 2000 }}>
    {toasts.map(toast => (
      <div key={toast.id} style={{ background: '#1a1a2e', color: 'white', padding: '14px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: '14px', animation: 'fadein 0.3s ease', color: 'white'  }}>
        {toast.message}
      </div>
    ))}
  </div>
    </div>
  );
}

export default App;