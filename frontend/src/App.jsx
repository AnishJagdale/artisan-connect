import { useState } from 'react'
import Navigation from './components/Navigation.jsx'
import Home from './components/Home.jsx'
import CreateProduct from './components/CreateProduct.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import MyProducts from './components/MyProducts.jsx'

// A brand-new artisan starts with zero products. Do not seed fake data here —
// the empty state is the intended first experience.
const INITIAL_PRODUCTS = []

export default function App() {
  const [view, setView] = useState('home')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [draft, setDraft] = useState(null)

  function handleGenerated(generatedDraft) {
    setDraft(generatedDraft)
    setView('result')
  }

  function handlePublish(product) {
    setProducts((prev) => [
      { ...product, id: crypto.randomUUID(), publishedAt: Date.now() },
      ...prev,
    ])
    setDraft(null)
    setView('products')
  }

  function handleCancelCreate() {
    setDraft(null)
    setView('home')
  }

  return (
    <div className="app">
      <Navigation view={view} onNavigate={setView} productCount={products.length} />

      {view === 'home' && <Home products={products} onNavigate={setView} />}

      {view === 'create' && (
        <CreateProduct onGenerated={handleGenerated} onCancel={handleCancelCreate} />
      )}

      {view === 'result' && draft && (
        <ResultScreen
          draft={draft}
          onPublish={handlePublish}
          onCancel={handleCancelCreate}
        />
      )}

      {view === 'products' && (
        <MyProducts products={products} onNavigate={setView} />
      )}

      <footer className="footer">
        <p>CraftNest — Your craft deserves a digital home.</p>
      </footer>
    </div>
  )
}