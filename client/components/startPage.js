import React, { Component } from 'react'
import CreateRoom from './createRoom'
import JoinRoom from './joinRoom'
import Board from './Board'
import {connect} from 'react-redux'

class StartPage extends Component {
    constructor(){
        super()
        this.state = {
            join: false,
            create: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.goToMainPage = this.goToMainPage.bind(this)
    }

    handleSubmit(joinOrCreate){
        this.setState({[joinOrCreate]: true})
    }

    goToMainPage(){
        this.setState({join: false,create: false})
    }
    
    render(){
        return(
            <div>
            {this.props.gameState === 'playing' ?
                <Board /> :
                <div>
                    <h1>Welcome! Start or join a game of Carcassonne.</h1>
                    {this.state.join===false && this.state.create===false ?
                        <div>
                            <button type='button' onClick={() => this.handleSubmit('create')}>Create a Game</button>
                            <button type='button' onClick={() => this.handleSubmit('join')}>Join a Game</button>
                        </div>
                        :
                        <div>
                            {this.state.join && <JoinRoom backButton={this.goToMainPage}/>}
                            {this.state.create && <CreateRoom backButton={this.goToMainPage}/>}
                        </div>
                    }
                </div>
            }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        gameState: state.gameState
    }
}

export default connect(mapStateToProps, null)(StartPage)