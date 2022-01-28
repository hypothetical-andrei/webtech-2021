import { WebSocketContext } from './WebSocketProvider'

import { useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { chat } from '../actions'

function ChatRoom () {
  const [usernameInput, setUsernameInput] = useState('')
  const [msgInput, setMsgInput] = useState('')

  const room = useSelector(state => state.room.currentRoom)
  const username = useSelector(state => state.room.username)
  const chats = useSelector(state => state.room.chatLog)

  const dispatch = useDispatch()
  const ws = useContext(WebSocketContext)

  function enterRoom () {
    dispatch(chat.setUsername(usernameInput))
  }

  const sendMessage = () => {
    ws.sendMessage(room.id, {
      username: username,
      message: msgInput
    })
  }

  return (
    <div>
      <h3>{room.name} ({room.id})</h3>
      {
        username
          ? (
            <div className='room'>
              <div className='history'>
                {
                  chats.map((c, i) => (
                    <div key={i}><i>{c.username}:</i> {c.message}</div>
                  ))
                }
              </div>
              <div className='control'>
                <input type='text' value={msgInput} onChange={(e) => setMsgInput(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
            )
          : (
            <div className='user'>
              <input type='text' placeholder='Enter username' value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
              <button onClick={enterRoom}>Enter Room</button>
            </div>
            )
      }
    </div>
  )
}
export default ChatRoom
