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
      <div className="lp_contrast_container p-3 p-md-4">
        <h4>
          {/* @ts-ignore */}
          <sl-icon name="pie-chart" /> Dashboard
        </h4>
        <p className="text-secondary" style={{ fontSize: '0.9em' }}>
          Chart data injected server-side. UI actions call <code>lpApp</code> functions from <code>lp.js</code>.
        </p>

        {/* Chart — height uses clamp so it's usable on both mobile and desktop */}
        <div
          id={chartId}
          style={{ width: '100%', height: 'clamp(220px, 40vw, 350px)', marginBottom: '24px' }}
        />

        {/* Toast + dialog buttons — wrap to new line on mobile */}
        <div className="d-flex flex-wrap gap-2">
          {/* @ts-ignore */}
          <sl-button variant="success" onclick={handleToastSuccess}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="check-circle" />
            Success
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="warning" onclick={handleToastWarning}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="exclamation-triangle" />
            Warning
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="danger" onclick={handleToastError}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="x-circle" />
            Error
          {/* @ts-ignore */}
          </sl-button>
          {/* @ts-ignore */}
          <sl-button variant="neutral" onclick={handleDialog}>
            {/* @ts-ignore */}
            <sl-icon slot="prefix" name="chat-square-text" />
            Dialog
          {/* @ts-ignore */}
          </sl-button>
        </div>
      </div>
    </div>
  )
}
