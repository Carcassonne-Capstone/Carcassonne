import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import socket from "../socket";

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.endGame = this.endGame.bind(this)
        this.playWithBots = this.playWithBots.bind(this)
    }

    playWithBots() {
        socket.emit('playingWithBots', this.props.roomId)
    }

    endGame() {
        socket.emit('endGame', this.props.roomId)
    }

    render() {
        return (
            <div id="disconnectModel" className="modal" style={{display: (this.props.disconnectedPlayers.length && !this.props.playingWithBots) ? 'block' : 'none'}}>
                {this.props.gameState === 'gameOver' && <Redirect to="/" />}
                <div className="modal-content">
                    <div>
                        UH OH! The following players have left the game:
                        {this.props.disconnectedPlayers.map(player => <div key={player}>{player}</div>)}
                    </div>
                    <div>
                        The host can choose to play with bots, or they can end the game.
                    </div>
                    {this.props.player.host &&
                        <div>
                            <button type="button" onClick={this.endGame}>End Game</button>
                            <button type="button" onClick={this.playWithBots}>Play With Bots</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    disconnectedPlayers: state.messages.disconnectedPlayers,
    roomId: state.game.roomId,
    playingWithBots: state.messages.playingWithBots,
    player: state.game.player,
    gameState: state.game.gameState
  };
};

export default connect(mapStateToProps)(Main);
