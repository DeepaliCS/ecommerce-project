function ProductCard({ product, darkMode, addToCart }) {
  return (
    <div style={{ background: darkMode ? '#1a1a2e' : 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <img src={`https://picsum.photos/seed/${product.id}/400/200`} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
      <div style={{ padding: '16px' }}>
        <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>{product.category?.name}</span>
        <h3 style={{ margin: '6px 0', fontSize: '16px' }}>{product.name}</h3>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 12px' }}>{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' }}>${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            style={{ background: '#e94560', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            Add to Cart
          </button>
        </div>
        <p style={{ fontSize: '12px', color: product.stock > 10 ? 'green' : 'orange', margin: '8px 0 0' }}>{product.stock} in stock</p>
      </div>
    </div>
  );
}

export default ProductCard;