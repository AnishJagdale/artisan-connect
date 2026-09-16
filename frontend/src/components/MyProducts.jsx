import ProductCard from './ProductCard.jsx'

export default function MyProducts({ products, onNavigate }) {
  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">My Products</h1>
        {products.length > 0 && (
          <button className="btn btn--primary" onClick={() => onNavigate('create')}>
            + Create Product
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="empty-state empty-state--page">
<div className="craft-icons" aria-hidden="true">
  <span>🧵</span>
  <span>🏺</span>
  <span>🧺</span>
  <span>🪵</span>
</div>          <h3 className="empty-state__title">No products yet</h3>
          <p className="empty-state__text">
            Your digital shop starts here.
            <br />
            Add your first creation and let ArtisanLink help tell its story.
          </p>
          <button className="btn btn--primary" onClick={() => onNavigate('create')}>
            + Create Product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
