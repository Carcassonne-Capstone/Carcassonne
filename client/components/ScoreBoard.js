import React, { Component } from "react";
import { connect } from "react-redux";

const ScoreBoard = props => {
  const getClass = (animal) => {
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
            // let color = getColor(player.animal);
            // style={{color: color}}
            console.log("player in score", player)
            const classIcon = getClass(player.animal)
            return (
              <tr key={player.name} >
                <td id="playerImage">
                {/* favicon.png */}
                <div className={classIcon}>
                  <img src={`/animals/images/${player.animal}.png`} alt=""  height="40px" width="40px" />
                </div>
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
