import React, { createContext } from 'react'
import io from 'socket.io-client'
import { WS_BASE } from '../config/global'
import { useDispatch } from 'react-redux'
import { chat } from '../actions'

const WebSocketContext = createContext(null)

export { WebSocketContext }

export default ({ children }) => {
  let socket
  let ws

  const dispatch = useDispatch()

  const sendMessage = (roomId, message) => {
    // console.warn(socket)
    console.warn('SENT')
    const payload = {
      roomId: roomId,
      data: message
    }
    socket.emit('event://send-message', JSON.stringify(payload))
    // dispatch(chat.updateChatLog({ ...payload, received: false }))
  }

  if (!socket) {
    socket = io.connect(WS_BASE, {
      withCredentials: false,
      transports: ["websocket"] 
    })
    socket.on('event://get-message', (msg) => {
      const payload = JSON.parse(msg)
      console.warn('RECEIVED')
      dispatch(chat.updateChatLog(payload))
    })

    ws = {
      socket: socket,
      sendMessage
    }
  }

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  )
}
