const INITIAL_STATE = {
  currentRoom: null,
  username: '',
  chatLog: []
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'CREATE_ROOM_FULFILLED':
    case 'JOIN_ROOM_FULFILLED':
      return { ...state, currentRoom: action.payload }
    case 'SET_USERNAME':
      return { ...state, username: action.payload }
    case 'UPDATE_CHAT_LOG':
      const found =  state.chatLog && state.chatLog.find(e => e.id === action.payload.id)
      if (!found) {
        return { ...state, chatLog: [...state.chatLog, action.payload] }
      } else {
        return { ...state }
      }
    default:
      return INITIAL_STATE
  }
}
