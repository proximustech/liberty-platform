import { useState } from 'react'

interface CounterScreenProps {
  startCount: number
  lpApp: any
}

export default function CounterScreen({ startCount, lpApp }: CounterScreenProps) {
  const [count, setCount] = useState(startCount)

  return (
    <div className="lp_container">
      <div className="lp_contrast_container p-3 p-md-4">
        <h4>
          {/* @ts-ignore */}
          <sl-icon name="plus-slash-minus" /> Counter Demo
        </h4>
        <p className="text-secondary" style={{ fontSize: '0.9em' }}>
          Initial value <code>{startCount}</code> was injected server-side. The counter below is pure React state.
        </p>

        {/* Counter controls - centered, touch-friendly on mobile */}
        <div className="d-flex align-items-center justify-content-center gap-3 my-4">
          {/* @ts-ignore */}
          <sl-button
            variant="neutral"
            size="large"
            circle
            onclick={() => setCount(c => c - 1)}
          >
            {/* @ts-ignore */}
            <sl-icon name="dash" />
          {/* @ts-ignore */}
          </sl-button>

          <span style={{
            fontSize: 'clamp(2rem, 8vw, 3.5rem)',
            fontWeight: 'bold',
            minWidth: '4rem',
            textAlign: 'center',
            lineHeight: 1,
          }}>
            {count}
          </span>

          {/* @ts-ignore */}
          <sl-button
            variant="primary"
            size="large"
            circle
            onclick={() => setCount(c => c + 1)}
          >
            {/* @ts-ignore */}
            <sl-icon name="plus" />
          {/* @ts-ignore */}
          </sl-button>
        </div>

        {/* @ts-ignore */}
        <sl-button
          variant="text"
          onclick={() => lpApp.ajax('content_view', '/reactjs', 'Home', true)}
        >
          ← Back to Home
        {/* @ts-ignore */}
        </sl-button>
      </div>
    </div>
  )
}
