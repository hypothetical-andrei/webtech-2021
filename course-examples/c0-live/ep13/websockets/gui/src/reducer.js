import { CREATE_ROOM_SUCCESS, JOIN_ROOM_SUCCESS, SET_USERNAME, UPDATE_CHAT_LOG} from './actions'

const INITIAL_STATE = {
  room: null,
  chatLog: [],
  username: null
}

export default function chatReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_ROOM_SUCCESS:
    case JOIN_ROOM_SUCCESS:
      return { ...state, room: action.payload }
    case SET_USERNAME:
      return { ...state, username: action.payload }
    case UPDATE_CHAT_LOG:
      const updateState = state
      if (state.room !== null && action.payload.roomId === state.room.id) {
        updateState.chatLog = [...state.chatLog, action.payload.data]
      }
      return updateState
    default:
      return INITIAL_STATE 
  }
}