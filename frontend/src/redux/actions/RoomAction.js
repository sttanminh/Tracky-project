import axios from 'axios';
import { redirect } from "./AppAction"
import {
  REFRESH_MESSAGES, REFRESH_MESSAGES_FAILED, REFRESH_MESSAGES_DONE,
  CREATE_ROOM_SUCCESS
} from "../reducers/RoomReducer"
import { REST_API_URL } from '../../config';

export function refreshMessages(roomId){
  return (dispatch) => {
    dispatch({ type : REFRESH_MESSAGES })

    axios(`${REST_API_URL}/getmessages/${roomId}`, {
        method: "GET"
    }).then(response => {
      dispatch({ type : REFRESH_MESSAGES_DONE, payload: response.data });
    }).catch(response => {
        dispatch({ type : REFRESH_MESSAGES_FAILED, payload: response })
      });
  }
}

export function createRoom(){
  return (dispatch) => {
    axios(`${REST_API_URL}/createroom`, {
        method: 'POST'
      }).then(response => {
          dispatch({ type : CREATE_ROOM_SUCCESS, payload: response })
          dispatch(redirect(`/room/${response.data["roomid"]}`))
      });
  }
}

