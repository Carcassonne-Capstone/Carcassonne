import React from "react";
import { connect } from "react-redux";
import { postMessage } from "../store";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";
import Emoji from "emoji-js";


class Chat extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleEmoji = this.toggleEmoji.bind(this);
    this.state = {
      newMessage: "",
      showEmojis: false
    };
  }
  componentDidMount() {
    const chatScroll = document.getElementById('chat-messages');
    chatScroll.scrollIntoView(false);
  }
  handleSubmit(e) {
    e.preventDefault();
    // const chatScroll = document.getElementById('chat-messages');
    // chatScroll.scrollTop = chatScroll.scrollHeight;

    socket.emit(
      "newMessage",
      this.props.roomId,
      this.props.player,
      this.state.newMessage
    );
    this.setState({ newMessage: "" });
  }
  handleChange(e) {
    this.setState({ newMessage: e.target.value });
  }

  handleEmojiClick = (code, emojiPicked) => {
    let emojiPic = Emoji.replace_colons(`:${emojiPicked.name}:`);

    this.setState({
      newMessage: this.state.newMessage + emojiPic
    });
  };

  toggleEmoji() {
    const currentEmojiState = this.state.showEmojis;
    this.setState({
      showEmojis: !currentEmojiState
    });
  }
  getColorClass (animal) {
    switch(animal) {
        case 'monkey':
            return "red";
        case 'gorilla':
            return "blue";
        case 'elephant':
            return "purple";  
        case 'lion':
            return "yellow"; 
        case 'tiger':
            return "orange";         
    }
}

  render() {
    // const chatScroll = document.getElementById('chat-messages');
    // console.log("chatscroll", chatScroll)
    // chatScroll.scrollTop = chatScroll.scrollHeight;
    const getTime = date => {
      return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
    };
    const emoji = new Emoji.EmojiConvertor();
    return (
      <div className="chat">
        <div id='chat-messages'>
          <div className="chatTitle">Chat</div>
          {this.props.messages.map((message, i) => {
            const chatColor = this.getColorClass(message[0].animal);
            console.log(message[0])
            return (
             <div id='chat-scroll' key={i}> 
              <div className="chat-icon">
                <img  src={`/animals/images/${message[0].animal}.png`} />
              </div>  
              <div id={chatColor} className="speech-bubble" >
                {/* {getTime(new Date(Date.now()))} {message[0].name}: {message[1]} */}
                {message[1]}
              </div>
             </div> 
            ) ;
          })}
        </div>

        <div id={this.state.showEmojis ? 'chat-input-toggle' : 'chat-input'}>  
          <form onSubmit={this.handleSubmit}>
            <input
              id="chat-input"
              onChange={this.handleChange}
              placeholder="Type message here..."
              value={this.state.newMessage}
              autocomplete="off"
            />
            {/* <span onClick={this.toggleEmoji}>🙂 </span> */}
          </form>
          <div>
            {this.state.showEmojis ? (
            <div id="emoji-picker">
              <EmojiPicker onEmojiClick={this.handleEmojiClick} />
            </div>  
            ) : null}
          </div>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages,
  roomId: state.game.roomId,
  currentPlayer: state.game.currentPlayer,
  player: state.game.player
});

export default connect(
  mapStateToProps
)(Chat);
