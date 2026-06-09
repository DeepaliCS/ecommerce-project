function Navbar({ darkMode, setDarkMode, cartCount, setCartOpen }) {
  return (
    <div style={{ background: '#1a1a2e', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ color: 'white', margin: 0, fontSize: '22px' }}>Deepali's Shop</h1>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={() => setCartOpen(true)}
          style={{ background: '#e94560', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          Cart ({cartCount})
        </button>
      </div>
    </div>
  );
}

export default Navbar;