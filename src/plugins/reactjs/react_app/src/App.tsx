import HomeScreen from './screens/HomeScreen'
import CounterScreen from './screens/CounterScreen'
import DashboardScreen from './screens/DashboardScreen'

interface AppProps {
  screen: string
  props: Record<string, any>
  lpApp: any
}

export default function App({ screen, props, lpApp }: AppProps) {
  switch (screen) {
    case 'home':
      return <HomeScreen userName={props.userName} lpApp={lpApp} />
    case 'counter':
      return <CounterScreen startCount={props.startCount} lpApp={lpApp} />
    case 'dashboard':
      return <DashboardScreen chartId={props.chartId} chartData={props.chartData} lpApp={lpApp} />
    default:
      return <p style={{ color: 'red' }}>Unknown screen: {screen}</p>
  }
}
