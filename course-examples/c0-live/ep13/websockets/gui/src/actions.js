import axios from 'axios'

const API_BASE  = 'http://localhost:5000'

export const CREATE_ROOM_REQUEST = "CREATE_ROOM_REQUEST"
export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS"
export const CREATE_ROOM_ERROR = "CREATE_ROOM_ERROR"

export const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST"
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS"
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR"

export const SET_USERNAME = "SET_USERNAME"
export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"

export function updateChatLog(update){
  return {
      type: UPDATE_CHAT_LOG,
      payload: update
  }
}

export function setUsername(username){
  return {
      type: SET_USERNAME,
      payload: username
  }
}

export function createRoomRequest(){
  return {
      type: CREATE_ROOM_REQUEST
  }
}

export function createRoomSuccess(payload){
  return {
      type: CREATE_ROOM_SUCCESS,
      payload
  }
}

export function createRoomError(error){
  return {
      type: CREATE_ROOM_ERROR,
      error
  }
}


export function createRoom(roomName) {
  return async function (dispatch) {
    dispatch(createRoomRequest());
    try {
      const response = await axios.get(`${API_BASE}/room?name=${roomName}`) 
      dispatch(createRoomSuccess(response.data))
    } catch (err) {
      dispatch(createRoomError(err))
    }
  }
}

export function joinRoomRequest(){
  return {
      type: JOIN_ROOM_REQUEST
  }
}

export function joinRoomSuccess(payload){
  return {
      type: JOIN_ROOM_SUCCESS,
      payload
  }
}

export function joinRoomError(error){
  return {
      type: JOIN_ROOM_ERROR,
      error
  }
}

export function joinRoom(roomId) {
  return async function (dispatch) {
      dispatch(joinRoomRequest());
      try{
          const response = await axios.get(`${API_BASE}/room/${roomId}`)
          dispatch(joinRoomSuccess(response.data));
      }catch(error){
          dispatch(joinRoomError(error));
      }
  }
}