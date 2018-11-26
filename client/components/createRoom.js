import React, { Component } from 'react'
import { connect } from 'react-redux'
import socket from '../socket'
import { Redirect } from 'react-router-dom'

class CreateRoom extends Component {
    constructor(){
        super()
        this.state = {
            name:'',
            waitingRoom: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.startGame = this.startGame.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault()
        this.setState({waitingRoom: true})
        socket.emit('createRoom', this.state.name)
    }

    startGame() {
        socket.emit('startGame', this.props.roomId, this.props.players)
    }

    render(){
        return(
                this.state.waitingRoom===false
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
                            <button type="submit">Create Game</button>
                        </div>
                    </form>
                    <div id="backButton" onClick={this.props.backButton}>Back to Main Page</div>
                </div>
                :
                <div className='waitingRoom'>
                    <div id="list">
                        <ul>Players in Room:{this.props.players.map(player=>(
                            <li key={player.name}>{player.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div id="info">
                        <div id='roomId'>Room id: {this.props.roomId}</div>
                        <div><button type='button' onClick={this.startGame}>Start Game</button></div>
                        {this.props.startGameErr !== '' && <div>{this.props.startGameErr}</div>}
                    </div>
                </div>
        
        )
    }
}

const mapStateToProps = state => { 
  return {
    roomId: state.game.roomId,
    players: state.game.players,
    startGameErr: state.messages.startGameErr
  }
}

export default connect(mapStateToProps, null)(CreateRoom)