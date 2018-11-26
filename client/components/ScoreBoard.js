import React, { Component } from "react";
import { connect } from "react-redux";

const ScoreBoard = props => {
  return (
    <div className="scoreBoard">
      <h3>Current scores:</h3>
      <ul>
        {props.players.map(player => {
          return (
            <li key={player.name}>
              {player.name + ": " + props.score[player.name]}
            </li>
          );
        })}
      </ul>
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
