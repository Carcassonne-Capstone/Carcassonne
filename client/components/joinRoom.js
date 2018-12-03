import React, { Component } from 'react'
import socket from '../socket'
import {connect} from 'react-redux'
import {selectMeeple, hostLeft} from '../store'

class JoinRoom extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            roomCode: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.selectMeeple = this.selectMeeple.bind(this)
        this.handleHostLeft = this.handleHostLeft.bind(this)
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
    }
    getClass(animal) {
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

    handleHostLeft() {
        this.props.updateHostLeft(false);
        this.props.backButton()
    }

    render(){
        return(
            this.props.hostHasLeft ?
            <div>
                <div className="waitingRoomJoin">
                    Oh No! You're host has left the game.
                </div>
                <div id="backButton" onClick={this.handleHostLeft}>Back to Main Page</div>
            </div> :
            <div>
                {!this.props.player.name
                ?
                <div>
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <div className="form-group">
                            {/* <label htmlFor="name" >Name*</label> */}
                            <div className="form-control">
                                <input name="name" type="text" className="input" maxLength="10" required autoComplete="off" placeholder="Name*"/>
                            </div>
                        </div>
                        <div className="form-group">
                            {/* <label htmlFor="roomCode" >Room Code*</label> */}
                            <div className="form-control">
                                <input name="roomCode" type="text" className="roomCode" required autoComplete="off" placeholder="Room Code*"/>
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
                this.props.player.animal === ''
                ?
                <div className='characterContainer'>
                    <div className='pick'>Pick your character.</div>
                    <div className="meeple-selection" id="meep2">
                    {this.props.meeple.map(meeple => {
                        const meepleClass = this.getClass(meeple);
                        return (
                        <div key={meeple} className={meepleClass}>
                            <img onClick={() => this.selectMeeple(meeple)} src={`/animals/images/${meeple}.png`}/>
                        </div>   
                        ) 
                    })}
                </div>
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
        meeple: state.game.meepleSelection,
        hostHasLeft: state.messages.hostLeft
    }
}
const mapDispatchToProps = dispatch => { 
    return {
      selectMeeple: (meeple) => dispatch(selectMeeple(meeple)),
      updateHostLeft: (newVal) => dispatch(hostLeft(newVal))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom)