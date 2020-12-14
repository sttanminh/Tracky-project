import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createRoom } from '../redux/actions/RoomAction'
import { saveAs } from '@progress/kendo-file-saver';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
// import WaveSurfer from 'wavesurfer.js'
// import { WaveformContainer, Wave, PlayButton } from '../components/WaveForm/styled.js';

const MEDIA_CONSTRAINS = { audio: true }; 

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  

  render() 
  {
    const { isAudioSupproted } = this.state;

    return <div> new test</div>
 }
}
const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createRoom: () => {
      return dispatch(createRoom());
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Test));
