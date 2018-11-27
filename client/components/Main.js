import React from "react";
import Board from "./Board";
import DisconnectedState from './DisconnectedState'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Main extends React.Component {
  render() {
    return (
      this.props.roomId ?
        <div>
          {/* {this.props.disconnectedPlayers.length > 0 && <DisconnectedState />} */}
          <DisconnectedState />
          <Board />
        </div>
        :
        <Redirect to="/" />
    )
  }
}

const mapStateToProps = state => {
  return {
    roomId: state.game.roomId,
    // disconnectedPlayers: state.messages.disconnectedPlayers
  };
};

export default connect(mapStateToProps)(Main);
