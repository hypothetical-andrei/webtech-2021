export const SET_USERNAME = 'SET_USERNAME'
export const UPDATE_CHAT_LOG = 'UPDATE_CHAT_LOG'

export function setUsername (payload) {
  return {
    type: SET_USERNAME,
    payload: payload
  }
}

export function updateChatLog (payload) {
  return {
    type: UPDATE_CHAT_LOG,
    payload: payload
  }
}
