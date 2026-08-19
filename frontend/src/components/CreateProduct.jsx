import { useEffect, useRef, useState } from 'react'
import StepProgress from './StepProgress.jsx'
import { generateListingWithGemini } from '../lib/gemini.js'

const EXAMPLE_TEXT =
  '"This is a handmade bamboo basket. I make it using bamboo from my village. It takes about two days to make."'

export default function CreateProduct({ onGenerated, onCancel }) {
  const [step, setStep] = useState(1)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoUrl, setPhotoUrl] = useState(null)
  const [voiceText, setVoiceText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-IN'

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setVoiceText((prev) => (prev ? `${prev} ${transcript}` : transcript).trim())
    }
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognitionRef.current = recognition
    return () => recognition.stop()
  }, [])


function handlePhotoSelect(file) {
  if (!file) return
  setPhotoFile(file)
  const reader = new FileReader()
  reader.onload = () => setPhotoUrl(reader.result)
  reader.readAsDataURL(file)
}

  function toggleRecording() {
    if (!recognitionRef.current) return
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  async function handleGenerate() {
    setIsGenerating(true)
    setGenerationError('')
    try {
      const listing = await generateListingWithGemini({ photoFile, voiceText })
      onGenerated({ photoUrl, voiceText, listing })
    } catch (err) {
      console.error('Gemini generation failed:', err)
      setGenerationError(
        "We couldn't create your listing right now. You can try again, or go back and continue — you'll still be able to fill in the fields yourself."
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="page create-flow">
      <div className="page__header">
        <h1 className="page__title">Create with AI</h1>
        <button className="btn btn--text" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <StepProgress current={step} />

      {step === 1 && (
        <section className="create-card" aria-labelledby="step1-heading">
          <h2 id="step1-heading" className="create-card__title">
            Add a photo of your product
          </h2>
          <p className="create-card__hint">
            A clear, well-lit photo helps AI understand your craft.
          </p>

          {photoUrl ? (
            <div className="photo-preview">
              <img src={photoUrl} alt="Your uploaded product" />
              <button
                className="btn btn--ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose a different photo
              </button>
            </div>
          ) : (
            <div className="upload-zone">
              <span className="upload-zone__icon" aria-hidden="true">
                📷
              </span>
              <p className="upload-zone__text">Add a photo of your product</p>
              <div className="upload-zone__actions">
                <button
                  className="btn btn--primary"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  Take Photo
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Photo
                </button>
              </div>
            </div>
          )}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="visually-hidden"
            onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
          />

          <div className="create-card__footer">
            <button
              className="btn btn--primary btn--large"
              disabled={!photoUrl}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="create-card" aria-labelledby="step2-heading">
          <h2 id="step2-heading" className="create-card__title">
            Tell us about your craft
          </h2>
          <p className="create-card__hint">
            Tell us what you made, how you made it, what materials you used,
            and anything special about it.
          </p>

          <div className="voice-recorder">
            <button
              className={`voice-recorder__button ${isRecording ? 'voice-recorder__button--active' : ''}`}
              onClick={toggleRecording}
              disabled={!speechSupported}
              aria-pressed={isRecording}
            >
              <span aria-hidden="true">🎙️</span>
            </button>
            <p className="voice-recorder__label">
              {isRecording
                ? 'Listening… tap to stop'
                : speechSupported
                ? 'Tap and speak'
                : 'Voice input isn\'t supported in this browser — please type below'}
            </p>
          </div>

          <p className="create-card__example">e.g. {EXAMPLE_TEXT}</p>

          <label className="field" htmlFor="voice-text">
            <span className="field__label">Or type it instead</span>
            <textarea
              id="voice-text"
              className="field__textarea"
              rows={5}
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Describe your product in your own words…"
            />
          </label>

          <div className="create-card__footer create-card__footer--split">
            <button className="btn btn--ghost" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn btn--primary btn--large"
              disabled={!voiceText.trim()}
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="create-card" aria-labelledby="step3-heading">
          <h2 id="step3-heading" className="create-card__title">
            Ready to create your listing
          </h2>
          <p className="create-card__hint">
            CraftNest will use your photo and description to write a
            professional listing for you to review.
          </p>

          <div className="generate-summary">
            <img src={photoUrl} alt="Your product" className="generate-summary__image" />
            <p className="generate-summary__text">{voiceText}</p>
          </div>

          {isGenerating ? (
            <div className="generating" role="status">
              <span className="generating__spinner" aria-hidden="true" />
              <p>Creating your listing…</p>
            </div>
          ) : (
            <>
              {generationError && (
                <p className="field__error" role="alert">
                  {generationError}
                </p>
              )}
              <div className="create-card__footer create-card__footer--split">
                <button className="btn btn--ghost" onClick={() => setStep(2)}>
                  Back
                </button>
                <button className="btn btn--primary btn--large" onClick={handleGenerate}>
                  ✨ Create My Listing
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  )
}
