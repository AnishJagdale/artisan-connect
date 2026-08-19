const STEPS = [
  { key: 1, label: 'Photo' },
  { key: 2, label: 'Your voice' },
  { key: 3, label: 'Generate' },
]

export default function StepProgress({ current }) {
  return (
    <ol className="step-progress" aria-label="Create product steps">
      {STEPS.map((step, index) => {
        const state =
          step.key < current ? 'done' : step.key === current ? 'active' : 'upcoming'
        return (
          <li key={step.key} className={`step-progress__item step-progress__item--${state}`}>
            <span className="step-progress__dot" aria-hidden="true">
              {state === 'done' ? '✓' : step.key}
            </span>
            <span className="step-progress__label">{step.label}</span>
            {index < STEPS.length - 1 && (
              <span className="step-progress__connector" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}
