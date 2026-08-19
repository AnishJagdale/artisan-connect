const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = 'gemini-3.5-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

const LISTING_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    description: { type: 'STRING' },
    category: { type: 'STRING' },
    tags: { type: 'ARRAY', items: { type: 'STRING' } },
    highlights: { type: 'ARRAY', items: { type: 'STRING' } },
    price: { type: 'STRING' },
  },
  required: ['title', 'description', 'category', 'tags', 'highlights', 'price'],
}

const PROMPT = `You are helping a local artisan turn a product photo and their own
spoken description into a professional online product listing.

Using the photo and the artisan's description below, write:
- title: a short, appealing product title (under 10 words)
- description: 2-4 sentences a buyer would want to read, written from the
  artisan's own story, in plain warm language, no exaggerated claims
- category: a single simple product category (e.g. "Home Decor", "Jewelry", "Textiles")
- tags: 4-6 short lowercase tags a buyer might search for
- highlights: 2-4 short bullet-point highlights about materials, craftsmanship, or story
- price: if the artisan mentioned a price, return it formatted like "₹500".
  If no price was mentioned, return an empty string.

Do not invent facts the artisan did not mention. Stay grounded in what they said.

Artisan's description: `

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function generateListingWithGemini({ photoFile, voiceText }) {
  if (!API_KEY) {
    throw new Error(
      'Missing Gemini API key. Add VITE_GEMINI_API_KEY to frontend/.env and restart the dev server.'
    )
  }

  const base64Image = await fileToBase64(photoFile)

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT + voiceText },
            { inline_data: { mime_type: photoFile.type, data: base64Image } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: LISTING_SCHEMA,
      },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${errText}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned no content')
  return JSON.parse(text)
}
