import {
  CONNECT_TO_ROOM, DISCONNECT_FROM_ROOM, BROADCAST_MESSAGE,
  ROOM_CONNECTION_CONFIRMED, ROOM_CONNECTION_FAILED,NEW_BROADCAST_MESSAGE
} from "../reducers/RoomReducer"
import { refreshMessages } from './RoomAction';
import { WEBSOCKET_URL } from '../../config';

// a single socket object
let socket = undefined;

const socketReply = {
  CONNECTION_CONFIRMED : "CONNECTION_CONFIRMED",
  CONNECTION_DISCONNECTED : "CONNECTION_DISCONNECTED",
  NEW_BROADCAST_MESSAGE : "NEW_BROADCAST_MESSAGE",
}

const socketAction = {
  CONNECT_TO_ROOM : "connecttoroom",
  BROADCAST_MESSAGE : "broadcastmessage",
}

export function connectToRoom(roomId,name){
  return (dispatch, getState) => {
    dispatch({ type : CONNECT_TO_ROOM })
    setupRoomSocket(roomId,name, dispatch);
  }
}

export function roomConnectionFailed(roomId, error){
  return {
    type: ROOM_CONNECTION_FAILED,
    roomId : roomId, 
    error : error
  }
}

export function confirmRoomConnectionSuccessful(roomId) {
  return (dispatch) => {
    dispatch({type: ROOM_CONNECTION_CONFIRMED, roomId: roomId})
    dispatch(refreshMessages(roomId));
  }
}

export function disconnectFromRoom( message ){
  if(socket) socket.close();

  return {
    type: DISCONNECT_FROM_ROOM,
    message : message,
  }
}

export function broadcastMessage(roomId, message){
  return (dispatch) => {
    if(socket){
      socket.send(JSON.stringify({
        action : socketAction.BROADCAST_MESSAGE,
        roomId : roomId,
        message : message,
      }))
      dispatch({ type : BROADCAST_MESSAGE , payload : {
        roomId : roomId,
        message : message,
      }})
    }
  }
}

export function receiveNewMessage(roomId, message){
  return (dispatch) => {
    dispatch({
      type : NEW_BROADCAST_MESSAGE,
      roomId : roomId, 
      message : message
    })
    dispatch(refreshMessages(roomId));
  } 
}

const setupRoomSocket = (roomId, name, dispatch) => {
  if(socket) socket.close()
  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = function(e) {
    socket.send(JSON.stringify({
      action : socketAction.CONNECT_TO_ROOM,
      roomId : roomId,
      name : name
    }));
  };

  socket.onmessage = (event) => {
    let {action, data} = JSON.parse(event.data);

    switch(action){
      case socketReply.CONNECTION_CONFIRMED:
        dispatch(confirmRoomConnectionSuccessful(roomId,name))
        break;
      case socketReply.CONNECTION_DISCONNECTED:
        dispatch(disconnectFromRoom(data))
        break;
      case socketReply.NEW_BROADCAST_MESSAGE:
        dispatch(receiveNewMessage(data.roomId, data.message));
        break;
      default:
        console.error(`"${action}" is not a valid action.`);
    }
  };

  socket.onclose = (event) => {
    dispatch(disconnectFromRoom({ 
      eventCode : event.code, 
      eventReason : event.reason
    }))

    // Socket close code 1001 is "going away"
    // attempt to reconnect 
    if (event.wasClean && event.code === 1001) {      
      socket = undefined
      dispatch(connectToRoom(roomId, name));
    }
  };
  
  socket.onerror = (error) => {
    dispatch(roomConnectionFailed(roomId, error))
  };
}