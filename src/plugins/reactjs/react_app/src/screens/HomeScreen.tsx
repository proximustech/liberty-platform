interface HomeScreenProps {
  userName: string
  lpApp: any
}

export default function HomeScreen({ userName, lpApp }: HomeScreenProps) {

  const openDashboard = () => {
    lpApp.setViewForPendingOperation('app_drawer')
    lpApp.drawer.label = 'React Dashboard'
    lpApp.drawer.show()
    lpApp.ajax('app_drawer', '/reactjs/dashboard', 'Dashboard')
  }

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
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {/* @ts-ignore */}
          <sl-button variant="primary" onclick={() => lpApp.ajax('content_view', '/reactjs/counter', 'Counter', true)}>
            Go to Counter screen
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="neutral" onclick={openDashboard}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="pie-chart" />
            Open Dashboard
          {/* @ts-ignore */}
          </sl-button>
        </div>
      </div>
    </div>
  )
}
