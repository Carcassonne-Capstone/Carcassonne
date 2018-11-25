import React from 'React';
import {connect} from 'react-redux';
import {postMessage} from '../store';
import socket from "../socket";

class Chat extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            newMessage: ''
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        //  this.props.submitMessage(this.state.newMessage);
         socket.emit('newMessage', this.props.roomId, this.props.player, this.state.newMessage);
         this.setState({newMessage: ''});
    }
    handleChange(e) {
       this.setState({newMessage: e.target.value})
    }
    render () {
        const getTime = (date) => {
            return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
         }
         console.log("date", )
        return (
            <div className="chat">
              <h3>Group Chat:</h3>
              <div>
                  {this.props.messages.map(message => {
                     return <p> {getTime(new Date(Date.now()))} {message[0].name}: {message[1]}</p>
                  })}
              </div>
              <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChange} placeholder="Type message here..." value={this.state.newMessage}/>
                <button type="submit"> Send </button>
              </form>
            </div>  
        )
    }
 }

 const mapStateToProps = (state) => ({
    messages: state.messages, 
    roomId: state.roomId,
    player: state.player
 })

 const mapDispatchToProps = (dispatch) => ({
    submitMessage: (message) => dispatch(postMessage(message))
 })


 export default connect(mapStateToProps, mapDispatchToProps)(Chat);