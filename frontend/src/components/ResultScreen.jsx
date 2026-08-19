import { useRef, useState } from 'react'

export default function ResultScreen({ draft, onPublish, onCancel }) {
  const listing = draft.listing || {}
  const [title, setTitle] = useState(listing.title || '')
  const [description, setDescription] = useState(listing.description || '')
  const [category, setCategory] = useState(listing.category || '')
  const [tags, setTags] = useState((listing.tags || []).join(', '))
  const [highlights, setHighlights] = useState((listing.highlights || []).join('\n'))
  const [price, setPrice] = useState(listing.price || '')
  const [error, setError] = useState('')

  const titleRef = useRef(null)

  function handlePublish() {
    if (!title.trim()) {
      setError('Give your product a title before publishing.')
      titleRef.current?.focus()
      return
    }
    setError('')
    onPublish({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      highlights: highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      price: price.trim(),
      image: draft.photoUrl,
    })
  }

  return (
    <main className="page result-screen">
      <div className="page__header">
        <h1 className="page__title">Your AI-generated listing</h1>
        <button className="btn btn--text" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <p className="result-screen__notice">
        AI created this draft from your photo and description. Review it
        before publishing.
      </p>

      <div className="result-layout">
        <div className="result-layout__photo">
          {draft.photoUrl && (
            <img src={draft.photoUrl} alt="Your product" />
          )}
          {draft.voiceText && (
            <details className="result-layout__transcript">
              <summary>What you told us</summary>
              <p>{draft.voiceText}</p>
            </details>
          )}
        </div>

        <div className="result-layout__fields">
          <label className="field" htmlFor="rf-title">
            <span className="field__label">Product Title</span>
            <input
              id="rf-title"
              ref={titleRef}
              className="field__input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title for your product"
            />
          </label>

          <label className="field" htmlFor="rf-description">
            <span className="field__label">Description</span>
            <textarea
              id="rf-description"
              className="field__textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product for buyers"
            />
          </label>

          <div className="field-row">
            <label className="field" htmlFor="rf-category">
              <span className="field__label">Category</span>
              <input
                id="rf-category"
                className="field__input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Home Decor"
              />
            </label>

            <label className="field" htmlFor="rf-price">
              <span className="field__label">Price</span>
              <input
                id="rf-price"
                className="field__input"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price not added"
              />
            </label>
          </div>

          <label className="field" htmlFor="rf-tags">
            <span className="field__label">Tags</span>
            <input
              id="rf-tags"
              className="field__input"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="handmade, bamboo, eco-friendly (comma separated)"
            />
          </label>

          <label className="field" htmlFor="rf-highlights">
            <span className="field__label">Product Highlights</span>
            <textarea
              id="rf-highlights"
              className="field__textarea"
              rows={3}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder={'One highlight per line, e.g.\nHandwoven from village bamboo\nTakes two days to make'}
            />
          </label>

          {error && (
            <p className="field__error" role="alert">
              {error}
            </p>
          )}

          <div className="create-card__footer create-card__footer--split">
            <button className="btn btn--ghost" onClick={() => titleRef.current?.focus()}>
              Edit
            </button>
            <button className="btn btn--primary btn--large" onClick={handlePublish}>
              ✓ Approve &amp; Publish
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
