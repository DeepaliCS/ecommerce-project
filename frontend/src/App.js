import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
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

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={cartCount}
        setCartOpen={setCartOpen}
      />

      {cartOpen && (
        <CartSidebar
            cart={cart}
            setCart={setCart}
            cartTotal={cartTotal}
            setCartOpen={setCartOpen}
            showToast={showToast}
            stripePromise={stripePromise}
            darkMode={darkMode}
            />
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
            <ProductCard
              key={product.id}
              product={product}
              darkMode={darkMode}
              addToCart={addToCart}
            />
          ))
        )}
      </div>

      {/* Toast Notifications */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 2000 }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{ background: '#1a1a2e', color: 'white', padding: '14px 20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: '14px' }}>
            {toast.message}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;