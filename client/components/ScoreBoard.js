import React, { Component } from "react";
import { connect } from "react-redux";

const ScoreBoard = props => {
  return (
    <div className="scoreBoard">
      <h3>Score board:</h3>
      <table className="scoreTable">
        {props.players.map(player => {
          return (
            <tr key={player.name}>
              <td>
                <img src="favicon.png" alt="" height="40px" width="40px" />
              </td>
              <td id="playerNameSB">{player.name}</td>
              <td id="meepleSB">
                <img src="/images/meeple.png" alt="" height={20} width={20} />
              </td>
              <td>{`x${player.meeple}`}</td>
              <td id="scoreSB">{props.score[player.name]}</td>
            </tr>
          );
        })}
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
