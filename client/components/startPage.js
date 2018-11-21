import React, { Component } from 'react'
import CreateRoom from './createRoom'
import JoinRoom from './joinRoom'
import Board from './Board'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'

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
            <div className='startMenu'>
            {this.props.gameState === 'playing' ?
                <Redirect to="/game" /> :
                <div>
                    {this.state.join===false && this.state.create===false ?
                        <div>
                            <div className='title'>KING OF THE JUNGLE</div>
                        <div className='buttons'>
                            <button type='button' onClick={() => this.handleSubmit('create')}>CREATE A GAME</button>
                            <button type='button' onClick={() => this.handleSubmit('join')}>JOIN A GAME</button>
                        </div>
                        </div>
                        :
                        <div>
                        <div className='title'>KING OF THE JUNGLE</div>
                        <div className='buttons'>
                            {this.state.join && <JoinRoom backButton={this.goToMainPage}/>}
                            {this.state.create && <CreateRoom backButton={this.goToMainPage}/>}
                        </div>
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