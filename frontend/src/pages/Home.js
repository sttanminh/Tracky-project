import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { createRoom } from '../redux/actions/RoomAction'
import Recording from '../components/Recording'

import { saveAs } from '@progress/kendo-file-saver';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
// import WaveSurfer from 'wavesurfer.js'
// import { WaveformContainer, Wave, PlayButton } from '../components/WaveForm/styled.js';

const MEDIA_CONSTRAINS = { audio: true };


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAudioSupproted : !!navigator.mediaDevices.getUserMedia,
      records : [], // recorded videos urls
      recording: false,
      // playing: false
      value: "",
      status: "",
      willPlay: false
    }
  }
  
  // handleRecordClicked = () => {
  //   console.log("asdasdsa")
  //   this.mediaRecorder.start();
  //   this.setState({
  //     recording :true,
  //     status: "Recording..."
  //   })
  // }
  // handleStopClicked = () => {
  //   this.mediaRecorder.stop();
  //   this.setState({
  //     status: "",
  //     recording: false
  //   })   
  // }

  componentDidMount(){
    if(this.state.isAudioSupproted){
      navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINS).then(
        // onSuccess
        (stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.chunks = [];

          this.mediaRecorder.ondataavailable = (e) => {
            console.log(e)
            this.chunks.push(e.data);
          }
          this.mediaRecorder.onstop = (e) => {
            const blob = new Blob( this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
            const audioURL = window.URL.createObjectURL(blob);
            let name = prompt("Please name your recording")
            if (name === null | name === "")
            {
              name = "unname recording"
            }
        
            console.log(this.chunks)

            // reset chunks for new recording
            this.chunks = [];
            let newRecords = this.state.records;
            
            newRecords.push({
              name : name,
              url : audioURL,
              isEnabled : true
            });

            this.setState({
              recording : false,
              records : newRecords
            })
                  }
        }, 
        // onError
        (err) => {
          console.log('The following error occured: ' + err);
        }
      );
    }
  }
  handleChange = (e) => {
    console.log('handle change called')
  }
  handleClick = () => {
    this.setState({value: 'another random text'})
    var event = new Event('input', { bubbles: true });
    this.myinput.dispatchEvent(event);
  }
  
  handlePlayAll = () => {
    this.setState({
      willPlay: true
    })
  }

  componentDidUpdate(){
    if(this.state.willPlay){
      this.setState({
        willPlay: false
      })
    }
  }
  handleRecordStop=()=>{
    if (!this.state.recording)
    {
      console.log("record")
      this.mediaRecorder.start();
      this.setState({
      recording :true,
      status: "Recording..."
      })
    }
    else{
      console.log("stop")
      this.mediaRecorder.stop();
      this.setState({
        status: "",
      recording: false
    })
  }}

  render() 
  {
    const { isAudioSupproted } = this.state;
    console.log("Rerendered")

    if(!isAudioSupproted) return <div>Sorry, your device does not support audio recording</div>

    return (
      <div id="home-page">
        <div className="wrapper">

          <header>
            <h1>Testing</h1>
          </header>
          <h2>{this.state.status}</h2>
          <section className="main-controls">
          <button onClick={this.handleRecordStop} >
            {!this.state.recording ? 'Record' : 'Stop'}
            </button>
            <div id="buttons">
              {/* <button className="record" onClick={this.handleRecordClicked}>Record</button>
              <button className="stop" onClick={this.handleStopClicked}>Stop</button> */}
            </div>
          </section>

          <button onClick={() => this.props.history.push("/test")}>test react</button>
          <button onClick={() => this.handlePlayAll()}>Play All</button>
          
          <section className="sound-clips">
            
            {this.state.records.map((record) => (
              <div>
                <p>{record.name}</p>

              <Recording url = {record.url} willPlayChild = {this.state.willPlay && record.isEnabled}/>
          


                <button onClick={()=>{
                  console.log(this.state.records.length )
                  for (let i = 0; i <= this.state.records.length ; i++)
                  {
                    console.log('masdasdaasdadsadasdasd')
                    console.log(this.state.records[i].url,record.url)
                    if(this.state.records[i].url == record.url)
                    {
                      let newRecordList = this.state.records
                      console.log(i)
                      newRecordList.splice(i,1)
                      this.setState({
                        records: newRecordList
                      })
                      break
                    }
                  }
                  
                }}>Delete</button>


                <button onClick={()=>{
                  saveAs(record.url)
                  console.log("jasdasd")
                }}>Download</button>
              </div>
            ))}          
          </section>

        </div>


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
    createRoom: () => {
      return dispatch(createRoom());
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
