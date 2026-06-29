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
      <div className="lp_contrast_container p-3 p-md-4">
        <h4>
          {/* @ts-ignore */}
          <sl-icon name="house" /> React Demo
        </h4>
        <p>
          Welcome, <strong>{userName}</strong>. This screen was rendered by React 19.
        </p>
        <p className="text-secondary" style={{ fontSize: '0.9em' }}>
          The data above was passed server-side: Koa route → EJS bridge → <code>window.__LP_PROPS__</code> → React props.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
          {/* @ts-ignore */}
          <sl-button
            variant="primary"
            style={{ width: '100%' }}
            onclick={() => lpApp.ajax('content_view', '/reactjs/counter', 'Counter', true)}
          >
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="plus-slash-minus" />
            Counter screen
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button
            variant="neutral"
            style={{ width: '100%' }}
            onclick={openDashboard}
          >
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
