import ProductCard from './ProductCard.jsx'

const PROCESS_STEPS = [
  {
    number: '01',
    icon: '📷',
    title: 'Add a product photo',
    text: 'Snap or upload a picture of what you made.',
  },
  {
    number: '02',
    icon: '🎙️',
    title: 'Tell us about your craft',
    text: 'Speak in your own words — materials, story, price.',
  },
  {
    number: '03',
    icon: '✨',
    title: 'AI creates your listing',
    text: 'ArtisanLink writes a title, description and tags for you.',
  },
  {
    number: '04',
    icon: '✓',
    title: 'Review & publish',
    text: 'Edit anything you like, then make it live.',
  },
]

export default function Home({ products, onNavigate }) {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero__stamp" aria-hidden="true">
          <span>Handmade,</span>
          <span>digitally told</span>
        </div>
        <h1 className="hero__title">Create your first digital product</h1>
       <p className="hero__subtitle">
  Whether you're an artisan or run a small craft business, just add a
  photo and tell us about it. ArtisanLink will help create your
  product listing.
</p>
        <div className="hero__actions">
          <button
            className="btn btn--primary btn--large"
            onClick={() => onNavigate('create')}
          >
            ✨ Create with AI
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => onNavigate('products')}
          >
            View My Products
          </button>
        </div>
      </section>

<section className="craft-strip" aria-hidden="true">
  <span>🧵 Textiles</span>
  <span>🏺 Pottery</span>
  <span>💍 Jewelry</span>
  <span>🪵 Woodwork</span>
  <span>🎨 Painting</span>
  <span>🧶 Weaving</span>
</section>

      <section className="section" aria-labelledby="my-products-heading">
        <div className="section__header">
          <h2 id="my-products-heading" className="section__title">
            My Products
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true">
              🪺
            </div>
            <h3 className="empty-state__title">No products yet</h3>
            <p className="empty-state__text">
              Your digital shop starts here.
              <br />
              Add your first creation and let ArtisanLink help tell its story.
            </p>
            <button
              className="btn btn--primary"
              onClick={() => onNavigate('create')}
            >
              + Create Product
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section process" aria-labelledby="process-heading">
        <h2 id="process-heading" className="section__title process__title">
          From your hands to the digital world
        </h2>
        <ol className="process__list">
          {PROCESS_STEPS.map((step) => (
            <li className="process__step" key={step.number}>
              <span className="process__number" aria-hidden="true">
                {step.number}
              </span>
              <span className="process__icon" aria-hidden="true">
                {step.icon}
              </span>
              <h3 className="process__step-title">{step.title}</h3>
              <p className="process__step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
