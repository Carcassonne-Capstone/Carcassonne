import React, { Component } from 'react'
import socket from '../socket'
import {connect} from 'react-redux'

class JoinRoom extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            roomCode: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault()
        socket.emit('joinRoom', this.state.roomCode, this.state.name)
    }

    render(){
        return(
            <div>
                {!this.props.player.name
                ?
                <div>
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <div className="form-group">
                            <label htmlFor="name" >Name*</label>
                            <div className="form-control">
                                <input name="name" type="text" className="input" maxLength="13" required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="roomCode" >Room Code*</label>
                            <div className="form-control">
                                <input name="roomCode" type="text" className="roomCode" required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit">Join Game</button>
                            {this.props.joinRoomErr !== '' && <div>{this.props.joinRoomErr}</div>}
                        </div>
                    </form>
                    <div id="backButton" onClick={this.props.backButton}>Back to Main Page</div>
                </div>
                :
                <div className="waitingRoomJoin">
                    Please wait for your host to begin the game.
                </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        joinRoomErr: state.messages.joinRoomErr,
        player: state.game.player
    }
}

export default connect(mapStateToProps)(JoinRoom)