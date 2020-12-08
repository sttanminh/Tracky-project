export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS"
export const CONNECT_TO_ROOM = "CONNECT_TO_ROOM"
export const DISCONNECT_FROM_ROOM = "DISCONNECT_FROM_ROOM"
export const BROADCAST_MESSAGE = "BROADCAST_MESSAGE"
export const VOTE_QUESTION = "VOTE_QUESTION"
export const ARCHIVE_QUESTION = "ARCHIVE_QUESTION"
export const ROOM_CONNECTION_CONFIRMED = "ROOM_CONNECTION_CONFIRMED"
export const ROOM_CONNECTION_FAILED = "ROOM_CONNECTION_FAILED"
export const NEW_BROADCAST_MESSAGE = "NEW_BROADCAST_MESSAGE"
export const REFRESH_MESSAGES = "REFRESH_MESSAGES"
export const REFRESH_MESSAGES_FAILED = "REFRESH_MESSAGES_FAILED"
export const REFRESH_MESSAGES_DONE = "REFRESH_MESSAGES_DONE"
export const CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED"
export const QUESTION_UPVOTED = "QUESTION_UPVOTED"
export const QUESTION_REMOVED = "QUESTION_REMOVED"

export const ConnectionStatus = {
  disconnected : "disconnected",
  connecting : "connecting",
  loading_message : "loading_message",
  connected : "connected",
  failed : "failed",
}

const initialState = {
  connectionStatus : ConnectionStatus.disconnected,
  roomId : undefined,
  messages : [],
  name : []
}

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_ROOM_SUCCESS:
        return state
      case CONNECT_TO_ROOM:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.connecting
        })
      case DISCONNECT_FROM_ROOM:
      case ROOM_CONNECTION_FAILED:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.disconnected,
          roomId : undefined
        })
      case ROOM_CONNECTION_CONFIRMED:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.loading_message,
          roomId : action.roomId,
          name : action.name
        })
      case BROADCAST_MESSAGE:
        return state
      case NEW_BROADCAST_MESSAGE:
        let messages = [...state.messages];
        messages.push(action.message);
        return Object.assign({}, state, {
          messages : messages
        })
        
      case REFRESH_MESSAGES:
      case REFRESH_MESSAGES_FAILED:
        return state
      case REFRESH_MESSAGES_DONE:
        return Object.assign({}, state, {
          connectionStatus : ConnectionStatus.connected,
          messages : action.payload
        })

      default:
        return state
    }
}

export default roomReducer;