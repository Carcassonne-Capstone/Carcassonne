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
            <div>
                {this.state.waitingRoom===false
                ?
                <div>
                    <button type="button" onClick={this.props.backButton}>Back to Main Page</button>
                    <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                        <div className="form-group">
                            <label htmlFor="name" >Name*</label>
                            <div className="form-control">
                                <input name="name" type="text" className="input" required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit">Create Game</button>
                        </div>
                    </form>
                </div>
                :
                <div>
                    <div>Room id: {this.props.roomId}</div>
                    <div>Players in Room:{this.props.players.map(player=>(
                        <div key={player.name}>{player.name}</div>
                    ))}
                    </div>
                    <button type='button' onClick={this.startGame}>Start Game</button>
                </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => { 
  return {
    roomId: state.roomId,
    players: state.players
  }
}

export default connect(mapStateToProps, null)(CreateRoom)