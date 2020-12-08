import React from "react";
import { withRouter } from "react-router-dom";

// redux
import { connect } from 'react-redux';
import { connectToRoom, broadcastMessage, disconnectFromRoom} from '../redux/actions/SocketAction';
import { ConnectionStatus } from '../redux/reducers/RoomReducer';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      message: "",
    };
  }

  broadcastMessage = () => {
    const roomId = this.props.match.params.roomId;
    const { message } = this.state;
    this.props.broadcastMessage(roomId, message);
  }

  componentDidMount() {
    const roomId = this.props.match.params.roomId;
    this.props.connectToRoom(roomId);
  }

  componentWillUnmount(){
    const roomId = this.props.match.params.roomId;
    this.props.disconnectFromRoom(roomId);
  }

  render() {
    const { messages, connectionStatus} = this.props;
    const { message } = this.state;

    return (
      <div id="room-page">
        { connectionStatus !== ConnectionStatus.connected ? (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
            <div className="card">
              <div className="card-body">
                <div className="messages">
                  {messages.map((m, index) => <div key={index}>{m.message}</div>)}
                </div>

              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Message" value={message}
                    onChange={(e) => this.setState({
                      message : e.target.value
                    })}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button" disabled={message.length === 0}
                      onClick={this.broadcastMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
	  connectionStatus : state.room.connectionStatus,
    roomId : state.room.roomId,
    messages : state.room.messages,
    name : state.room.name
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		broadcastMessage : (roomId, messages ) => {
			return dispatch(broadcastMessage(roomId, messages))
		},
		connectToRoom : (roomId,name) => {
			dispatch(connectToRoom(roomId,name));
    },
    disconnectFromRoom : (message) => {
      dispatch(disconnectFromRoom(message))
    }
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Room));
