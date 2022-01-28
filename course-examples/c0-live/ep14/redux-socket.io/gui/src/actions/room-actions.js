import { API_BASE } from '../config/global'

export const CREATE_ROOM = 'CREATE_ROOM'
export const JOIN_ROOM = 'JOIN_ROOM'

export function createRoom (name) {
  return {
    type: CREATE_ROOM,
    payload: async () => {
      const response = await fetch(`${API_BASE}/rooms?name=${name}`)
      if (!response.ok) {
        throw response
      }
      const data = await response.json()
      return data
    }
  }
}

export function joinRoom (roomId) {
  return {
    type: JOIN_ROOM,
    payload: async () => {
      const response = await fetch(`${API_BASE}/rooms/${roomId}`)
      if (!response.ok) {
        throw response
      }
      const data = await response.json()
      return data
    }
  }
}
