import React, { Component } from "react";

class gameOver extends Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div>
        return <h1> Game Over </h1>;
      </div>
    );
  }
}

export default gameOver;

// const mapStateToProps = state => {
//   return {
//       joinRoomErr: state.messages.joinRoomErr,
//       player: state.game.player
//   }
// }

// export default connect(mapStateToProps)(JoinRoom)
