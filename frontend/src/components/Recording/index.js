import React from 'react';
import 'reactjs-popup/dist/index.css';

import WaveSurfer from 'wavesurfer.js';

class Recording extends React.Component {  
    state = {
        playing : false,
        id: "M"+Math.floor(Math.random() * 10000) ,
        willPlay : false
    }
    componentDidMount() {
        

        this.waveform = WaveSurfer.create({
        container: '#' +this.state.id,

        });
        this.waveform.load(this.props.url);

        this.waveform.on('finish',  () => {
            this.setState({
                playing: false
            });
        });
    };
    componentDidUpdate(prevProps,prevState)
    {
        if (this.props.willPlayChild === true){
            this.handlePlay()
        }
    }
    handlePlay = () => {
            this.setState({ 
                playing: !this.state.playing
            });
            this.waveform.playPause();
    }
    render() {
        console.log(this.props.willPlayChild)
  
      return (
        <div>
            <button onClick={this.handlePlay} >
            {!this.state.playing ? 'Play' : 'Pause'}
            </button>
          <div id={this.state.id} />
          <audio id="track" src={this.props.url} />
        </div>
      );
    }
  };
  

export default Recording;
