import React, { Component } from "react";
import { connect } from "react-redux";

const ScoreBoard = props => {
  return (
    <div className="scoreBoard">
      <div className="scoreTitle">Score Board</div>
      <table className="scoreTable">
        <tbody>
        <tr>
          <th></th>
          <th></th>
          <th className="playerHead">Player</th>
          <th className="scoreHead">Score</th>
        </tr>
        
          {props.players.map(player => {
            let color = player.color
            // style={{color: color}}
            return (
              <tr key={player.name} >
                <td id="playerImage">
                  <img src="favicon.png" alt="" height="40px" width="40px" />
                </td>
                <td id="meepleRemaining" >{`x${player.meeple}`}</td>
                <td id="playerNameSB" >{player.name}</td>
                <td id="scoreSB" >{props.score[player.name]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    players: state.game.players,
    score: state.game.scores
  };
};

export default connect(mapStateToProps)(ScoreBoard);
