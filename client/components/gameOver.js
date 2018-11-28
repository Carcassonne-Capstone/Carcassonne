import React, { Component } from "react";
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'

class gameOver extends Component {
  constructor(props) {
    super();
  }

  render() {
    const scores = this.props.scores;
    const players = this.props.players;
    let playScrs = [];
    let winner = [];
    let message = "";

    for (let key in scores) {
      if (scores.hasOwnProperty(key)) {
        playScrs.push([key, scores[key]]);
      }
    }

    playScrs.sort(function(a, b) {
      return b[1] - a[1];
    });

    for (let i = 0; i < playScrs.length - 1; i++) {
      if (playScrs[i][1] >= playScrs[i + 1][1]) {
        winner.push(playScrs[i]);
      }
      if (playScrs[playScrs.length - 1][1] === playScrs[0][1]) {
        winner.push(playScrs[playScrs.length - 1]);
      }
    }

    if (winner.length > 1) {
      winner.map(name => {
        message += name[0] + " and ";
      });
      message = message.slice(0, message.length - 5);
    }

    return (
      this.props.gameState === 'gameOver' ?
        <div className="endGameContainer">
          <div>
            <audio
              ref="audio_tag"
              src="/Sounds/CantWaitToBeKing.mp3"
              controls
              autoPlay
            />
          </div>

          {winner.length < 2 ? (
            <div id="endBody">
              <div id="endMsgHead">And the winner is ...</div>
              <div id="winnerName">{winner[0][0]} </div>
            </div>
          ) : (
            <div id="endBody">
              <div id="endMsgHead">We have a tie between ...</div>
              <br />
              <div id="winnerName">{message} </div>
            </div>
          )}
          <div>
            <a href="/" id="playAgain">
              Play again
            </a>
          </div>

          <div className="stumps">
            {playScrs.map(player => {
              return (
                <div id="playScrs" key={player[0]}>
                  <div>
                    {player[0]}: {player[1]}
                  </div>
                  <div>
                    <img
                      src="/images/stump.png"
                      alt="Stump"
                      height={175 + player[1] * 10}
                      width={200 + player[1] * 7.5}
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
