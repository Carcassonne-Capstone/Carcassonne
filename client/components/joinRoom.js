import React, { Component } from 'react'
import socket from '../socket'

class JoinRoom extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            roomCode: '',
            waitingRoom: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        this.setState({[event.target.name]: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault()
        this.setState({waitingRoom: true})
        socket.emit('joinRoom', this.state.roomCode, this.state.name)
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
                            <label htmlFor="roomCode" >Room Code*</label>
                            <div className="form-control">
                                <input name="roomCode" type="text" className="roomCode" required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit">Join Game</button>
                        </div>
                    </form>
                </div>
                :
                <div>
                    Please wait for your host to begin the game.
                </div>
                }
            </div>
        )
    }
}

export default JoinRoom