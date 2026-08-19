export default function Navigation({ view, onNavigate, productCount }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'create', label: 'Create with AI' },
    { key: 'products', label: 'My Products' },
  ]

  return (
    <header className="nav">
      <button
        className="nav__logo"
        onClick={() => onNavigate('home')}
        aria-label="CraftNest home"
      >
        <span className="nav__logo-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="26" height="26">
            <path
              d="M16 3 L27 9.5 V22.5 L16 29 L5 22.5 V9.5 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M16 3 V29 M5 9.5 L27 22.5 M27 9.5 L5 22.5"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </span>
        <span className="nav__logo-text">CraftNest</span>
      </button>

      <nav className="nav__links" aria-label="Primary">
        {items.map((item) => (
          <button
            key={item.key}
            className={`nav__link ${view === item.key ? 'nav__link--active' : ''}`}
            onClick={() => onNavigate(item.key)}
            aria-current={view === item.key ? 'page' : undefined}
          >
            {item.label}
            {item.key === 'products' && productCount > 0 && (
              <span className="nav__badge">{productCount}</span>
            )}
          </button>
        ))}
      </nav>

      <button className="nav__profile" aria-label="Your profile">
        <span className="nav__profile-circle">A</span>
      </button>
    </header>
  )
}
