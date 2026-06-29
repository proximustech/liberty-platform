import { useEffect } from 'react'

interface ChartDataItem {
  category: string
  value: number
}

interface DashboardScreenProps {
  chartId: string
  chartData: ChartDataItem[]
  lpApp: any
}

export default function DashboardScreen({ chartId, chartData, lpApp }: DashboardScreenProps) {

  // Signal the EJS layer that React has mounted and the chart container is in the DOM.
  // The EJS inline script listens for this event and calls app.graphShowPie.
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('lp:react:mounted'))
  }, [])

  const handleToastSuccess = () => {
    lpApp.toastShow('Success', 'Operation completed successfully.', { type: 'success', closable: true })
  }

  const handleToastWarning = () => {
    lpApp.toastShow('Warning', 'Something needs your attention.', { type: 'warning', closable: true })
  }

  const handleToastError = () => {
    lpApp.toastShow('Error', 'Something went wrong.', { type: 'error', closable: true })
  }

  const handleDialog = () => {
    lpApp.dialog.label = 'React Dialog Demo'
    lpApp.dialog.innerHTML = `
      <p>This dialog was opened from a React component using <code>lpApp.dialog</code>.</p>
      <div slot="footer">
        <sl-button variant="primary" onclick="document.getElementById('app_dialog').hide()">Close</sl-button>
      </div>
    `
    lpApp.dialog.show()
  }

  return (
    <div className="lp_container">
      <div className="lp_contrast_container" style={{ padding: '24px' }}>
        <h4>
          {/* @ts-ignore */}
          <sl-icon name="pie-chart" /> Dashboard
        </h4>
        <p style={{ color: 'var(--sl-color-neutral-500)', fontSize: '0.9em' }}>
          Chart data was injected server-side. All UI actions call <code>lpApp</code> functions from <code>lp.js</code>.
        </p>

        {/* Chart container — id set server-side, chart rendered by EJS after lp:react:mounted event */}
        <div
          id={chartId}
          style={{ width: '100%', height: '300px', marginBottom: '24px' }}
        />

        {/* Toast buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {/* @ts-ignore */}
          <sl-button variant="success" onclick={handleToastSuccess}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="check-circle" />
            Toast Success
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="warning" onclick={handleToastWarning}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="exclamation-triangle" />
            Toast Warning
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="danger" onclick={handleToastError}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="x-circle" />
            Toast Error
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="neutral" onclick={handleDialog}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="chat-square-text" />
            Open Dialog
          {/* @ts-ignore */}
          </sl-button>
        </div>
      </div>
    </div>
  )
}
