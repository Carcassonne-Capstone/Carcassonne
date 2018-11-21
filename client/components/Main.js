import React from "react";
import Board from "./Board";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Main extends React.Component {
  render() {
    return this.props.roomId ? <Board /> : <Redirect to="/" />;
  }
}

const mapStateToProps = state => {
  return {
    roomId: state.roomId
  };
};

export default connect(mapStateToProps)(Main);
