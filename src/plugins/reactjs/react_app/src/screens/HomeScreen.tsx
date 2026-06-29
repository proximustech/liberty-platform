interface HomeScreenProps {
  userName: string
}

export default function HomeScreen({ userName }: HomeScreenProps) {
  return (
    <div className="lp_container">
      <div className="lp_contrast_container" style={{ padding: '24px' }}>
        <h4>
          {/* @ts-ignore - Shoelace web component loaded globally by root.html */}
          <sl-icon name="house" /> React Demo
        </h4>
        <p>
          Welcome, <strong>{userName}</strong>. This screen was rendered by React 19.
        </p>
        <p style={{ color: 'var(--sl-color-neutral-500)', fontSize: '0.9em' }}>
          The data above was passed server-side: Koa route → EJS bridge → <code>window.__LP_PROPS__</code> → React props.
        </p>
        <div style={{ marginTop: '16px' }}>
          {/* @ts-ignore */}
          <sl-button variant="primary" onclick="app.ajax('content_view','/reactjs/counter','Counter',true)">
            Go to Counter screen
          {/* @ts-ignore */}
          </sl-button>
        </div>
      </div>
    </div>
  )
}
