import React, { Component } from 'react'
import socket from '../socket'
import {connect} from 'react-redux'
import {selectMeeple} from '../store'

class JoinRoom extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            roomCode: '',
            meepleSelected: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.selectMeeple = this.selectMeeple.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault()
        socket.emit('joinRoom', this.state.roomCode, this.state.name)
    }

    selectMeeple(meeple) {
        socket.emit('selectMeeple', this.state.roomCode, meeple, this.props.player)
        this.setState({meepleSelected: true})
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
                                <input name="name" type="text" className="input" maxLength="10" required/>
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
                !this.state.meepleSelected
                ?
                <div className="meeple-selection">
                    {this.props.meeple.map(meeple => {
                        return <img key={meeple} onClick={() => this.selectMeeple(meeple)} src={`/animals/images/${meeple}.jpg`}/>
                    })}
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
        roomId: state.game.roomId,
        joinRoomErr: state.messages.joinRoomErr,
        player: state.game.player,
        meeple: state.game.meepleSelection
    }
}
const mapDispatchToProps = dispatch => { 
    return {
      selectMeeple: (meeple) => dispatch(selectMeeple(meeple))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom)