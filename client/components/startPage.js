import React, { Component } from 'react'
import CreateRoom from './createRoom'
import JoinRoom from './joinRoom'

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
        console.log('STATE',this.state)
    }

    goToMainPage(){
        this.setState({join: false,create: false})
    }
    
    render(){
        return(
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
        )
    }
}

export default StartPage