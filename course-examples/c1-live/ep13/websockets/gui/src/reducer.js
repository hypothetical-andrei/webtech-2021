import { CREATE_ROOM_SUCCESS, JOIN_ROOM_SUCCESS, SET_USERNAME, UPDATE_CHAT_LOG} from './actions';

const initialState = {
    room: null,
    chatLog: [],
    username: null
}

export default function chatReducer(state = initialState, action) {
	switch (action.type) {
		case CREATE_ROOM_SUCCESS:
		case JOIN_ROOM_SUCCESS:
			return { ...state, room: action.payload }
		case SET_USERNAME:
			return { ...state, username: action.payload }
		case UPDATE_CHAT_LOG:
			const updatedState = state
			if (state.room !== null && action.payload.roomId === state.room.id) {
				updatedState.chatLog = [ ...state.chatLog, action.payload.data ]
			}
			return updatedState
		default: 
			return initialState
	}
}