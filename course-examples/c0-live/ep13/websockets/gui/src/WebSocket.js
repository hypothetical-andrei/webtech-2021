import React, { createContext } from 'react'
import { useDispatch } from 'react-redux'
import io from 'socket.io-client'

import { updateChatLog } from './actions'

const WS_BASE = 'http://localhost:5000'

const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
  let socket
  let ws

  const dispatch = useDispatch()

  const sendMessage = (roomId, message) => {
    const payload = {
      roomId,
      data: message
    }
    socket.emit('event://send-message', JSON.stringify(message))
    dispatch(updateChatLog(payload))
  }

  if (!socket) {
    socket = io.connect(WS_BASE)

    socket.on('event://get-message', (msg) => {
      const payload = JSON.parse(msg)
      dispatch(updateChatLog(payload))
    })

    ws = {
      socket,
      sendMessage
    }

  }

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  )

}