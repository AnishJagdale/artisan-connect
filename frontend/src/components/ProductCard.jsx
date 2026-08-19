export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title || 'Handmade product photo'}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__image-placeholder" aria-hidden="true">
            🧺
          </div>
        )}
        <span className="badge badge--published">Published</span>
      </div>
      <div className="product-card__body">
        <h3 className="product-card__title">
          {product.title || 'Untitled product'}
        </h3>
        {product.category && (
          <span className="product-card__category">{product.category}</span>
        )}
        <p className="product-card__price">
          {product.price ? product.price : 'Price not added'}
        </p>
      </div>
    </article>
  )
}
