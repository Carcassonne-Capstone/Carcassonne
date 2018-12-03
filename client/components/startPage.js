import React, { Component } from "react";
import CreateRoom from "./createRoom";
import JoinRoom from "./joinRoom";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class StartPage extends Component {
  constructor() {
    super();
    this.state = {
      join: false,
      create: false,
      sound: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToMainPage = this.goToMainPage.bind(this);
  }

  handleSubmit(joinOrCreate) {
    this.setState({ [joinOrCreate]: true });
  }

  goToMainPage() {
    this.setState({ join: false, create: false });
  }

  render() {
    return this.props.gameState === "playing" ? (
      <Redirect to="/game" />
    ) : (
      <div className="startPage">
        <div className='muteUnmute' onClick={()=>{this.setState({sound: !this.state.sound});document.getElementById('start-audio').muted = !document.getElementById('start-audio').muted }}>
              <audio
                id='start-audio'
                ref="audio_tag2"
                src="/Sounds/lionSleeps.mp3"
                // controls
                autoPlay
                loop
              />
              {this.state.sound === false ? 
                <img src="/sound.png" width="35px" height="35px"/>
                :
                <img src="/mute.png"  width="35px" height="35px"/>
              }
        </div>
        <div className="startMenu">
          {this.state.join === false && this.state.create === false ? (
            <div className="buttonMenu">
              <div className="title">KING OF THE JUNGLE</div>
              <div className="buttons">
                <button
                  type="button"
                  onClick={() => this.handleSubmit("create")}
                >
                  CREATE A GAME
                </button>
                <button type="button" onClick={() => this.handleSubmit("join")}>
                  JOIN A GAME
                </button>
              </div>
            </div>
          ) : (
            <div className="buttonMenu">
              <div className="title">KING OF THE JUNGLE</div>
              <div className="buttons">
                {this.state.join && <JoinRoom backButton={this.goToMainPage} />}
                {this.state.create && (
                  <CreateRoom backButton={this.goToMainPage} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gameState: state.game.gameState
  };
};

export default connect(
  mapStateToProps,
  null
)(StartPage);
