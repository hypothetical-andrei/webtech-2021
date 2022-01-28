import WebSocketProvider from './WebSocketProvider'
import Home from './Home'

function App () {
  return (
    <WebSocketProvider>
      <div className='App'>
        <Home />
      </div>
    </WebSocketProvider>
  )
}

export default App
