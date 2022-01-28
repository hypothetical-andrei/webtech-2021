import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ChatRoom from './ChatRoom'

import { room } from '../actions'

function Home () {
  const [roomName, setRoomName] = useState('')
  const [roomId, setRoomId] = useState('')
  const currentRoom = useSelector(state => state.room.currentRoom)

  const dispatch = useDispatch()

  return (
    <>
      {
        currentRoom
          ? (
            <ChatRoom />
            )
          : (
            <div className='create'>
              <div>
                <span>Create new room</span>
                <input type='text' placeholder='Room name' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <button onClick={() => dispatch(room.createRoom(roomName))}>Create</button>
              </div>
              <div>
                <span>Join existing room</span>
                <input type='text' placeholder='Room code' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                <button onClick={() => dispatch(room.joinRoom(roomId))}>Join</button>
              </div>
            </div>
            )
      }
    </>
  )
}

export default Home
