import React, { Component } from "react";
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'

class gameOver extends Component {
  constructor(props) {
    super();
    this.state = {
      sound: true
    }
  }

  getClass(animal){
    switch (animal) {
         case 'tiger':
           return 'meeple-selection-orange'
        case 'gorilla':
            return 'meeple-selection-blue' 
         case 'elephant':
             return 'meeple-selection-purple'
         case 'monkey':
             return 'meeple-selection-red'
         case 'lion':
            return 'meeple-selection-yellow' 
    }       
  }

  render() {
    const scores = this.props.scores;
    const players = this.props.players;
    let playScrs = [];
    let winner = [];
    let message = "";
    let max=0; 

    for (let key in scores) {
      if (scores.hasOwnProperty(key)) {
        playScrs.push([key, scores[key]]);
        if (scores[key]>max){
          winner=[key]
          max=scores[key]
        } else if (scores[key]===max){
          winner.push(key)
        }
      }
    }

    playScrs.sort(function(a, b) {
      return b[1] - a[1];
    });

    // for (let i = 0; i < playScrs.length; i++) {
    //   console.log('playScrs', playScrs)
    //   if (playScrs[i][1] >= max) {
    //     winner.push(playScrs[i]);
    //     max=playScrs[i][1]
    //   }
    // }

    if (winner.length > 1) {
      winner.map(name => {
        message += name + " and ";
      });
      message = message.slice(0, message.length - 5);
    }

    return (
      this.props.gameState === 'gameOver' ?
        <div className="endGameContainer">
          <div className="endTop">
            <div className='muteUnmute' onClick={()=>{this.setState({sound: !this.state.sound}); document.getElementById('end-audio').muted = !document.getElementById('end-audio').muted }}>
              <audio
                id='end-audio'
                ref="audio_tag"
                src="/Sounds/CantWaitToBeKing.mp3"
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

            {winner.length < 2 ? (
              <div id="endBody">
                <div id="winnerName">{winner[0].toUpperCase()}</div>
                <div id="endMsgHead">IS THE KING OF THE JUNGLE</div>
              </div>
            ) : (
              <div id="endBody">
                <div id="winnerName">{message} </div>
                <div id="endMsgHead">ARE KINGS OF THE JUNGLE</div>
              </div>
            )}
            <div id="playAgain">
              <a href="/">
                Play again?
              </a>
            </div>

          </div>
         
          <div className="stumps">
            {playScrs.map(player => {
              console.log('player',player)
              console.log('playerProps',this.props.players)
              return (
                <div id="playScrs" key={player[0]}>
                  <div>
                    {player[0]}: {player[1]}
                  </div>
                  <div id="winIcon" className={this.getClass(
                      this.props.players.find(propPlayer => propPlayer.name === player[0]).animal
                    )}>
                    <img src={`animals/images/${this.props.players.find(propPlayer => propPlayer.name === player[0]).animal}.png`} height="80px" width="80px"/>
                  </div>
                  <div>
                    <img
                      className="stumpImg"
                      src="/images/stump.png"
                      alt="Stump"
                      height={25 + player[1] * 4}
                      // width={200 + player[1] * 7.5}
                      width={"100%"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div> :
        <Redirect to='/'/>
    );
  }
}

const mapStateToProps = state => {
  return {
    scores: state.game.scores,
    players: state.game.players,
    gameState: state.game.gameState
  };
};

export default connect(mapStateToProps)(gameOver);
