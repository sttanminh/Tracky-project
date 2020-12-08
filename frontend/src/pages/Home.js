import React  from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {createRoom} from '../redux/actions/RoomAction'

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      query : "",
      disabled : false, //Use to disable the join button in case the input field is empty
    }
  }
  handleChange = event => {
    const query = event.target.value;
    if (!query){
      this.setState({query, disabled : false})
    } else {
      this.setState({ query, disabled : true })
    }  
  }

  render(){
    const { createRoom } = this.props;
    return (
      <div id="home-page">
        <h1 className="title">Serverless Web App Demo</h1> 
        <p className="intro">
          This is a serverless web app boilerplate, which uses a collection popular web technologies. 
          This page is created using React + Bootstrap. 
          Clicking a button below will trigger a Rest API to a AWS API Gateway + Lambda to create new unique room, where 
          each client can broacast a messages to other clients in the same room in realtime.
        </p> 
        <button 
          className="btn  btn-lg btn-primary"
          onClick={createRoom}>
            Create Room
        </button>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		createRoom : () => {
			return dispatch(createRoom());
    }
	}
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Home));