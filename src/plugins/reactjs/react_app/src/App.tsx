import HomeScreen from './screens/HomeScreen'
import CounterScreen from './screens/CounterScreen'

interface AppProps {
  screen: string
  props: Record<string, any>
}

export default function App({ screen, props }: AppProps) {
  switch (screen) {
    case 'home':
      return <HomeScreen userName={props.userName} />
    case 'counter':
      return <CounterScreen startCount={props.startCount} />
    default:
      return <p style={{ color: 'red' }}>Unknown screen: {screen}</p>
  }
}
