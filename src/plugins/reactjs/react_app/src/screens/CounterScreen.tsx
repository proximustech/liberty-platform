import { useState } from 'react'

interface CounterScreenProps {
  startCount: number
  lpApp: any
}

export default function CounterScreen({ startCount, lpApp }: CounterScreenProps) {
  const [count, setCount] = useState(startCount)

  return (
    <div className="lp_container">
      <div className="lp_contrast_container" style={{ padding: '24px' }}>
        <h4>
          {/* @ts-ignore - Shoelace web component loaded globally by root.html */}
          <sl-icon name="plus-slash-minus" /> Counter Demo
        </h4>
        <p style={{ color: 'var(--sl-color-neutral-500)', fontSize: '0.9em' }}>
          Initial value <code>{startCount}</code> was injected server-side. The counter below is pure React state.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          {/* @ts-ignore */}
          <sl-button variant="neutral" onclick={() => setCount(c => c - 1)}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="dash" />
            Decrement
          {/* @ts-ignore */}
          </sl-button>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem', textAlign: 'center' }}>
            {count}
          </span>
          {/* @ts-ignore */}
          <sl-button variant="primary" onclick={() => setCount(c => c + 1)}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="plus" />
            Increment
          {/* @ts-ignore */}
          </sl-button>
        </div>
        <div style={{ marginTop: '24px' }}>
          {/* @ts-ignore */}
          <sl-button variant="text" onclick={() => lpApp.ajax('content_view', '/reactjs', 'Home', true)}>
            ← Back to Home
          {/* @ts-ignore */}
          </sl-button>
        </div>
      </div>
    </div>
  )
}
