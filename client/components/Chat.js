import React from "react";
import { connect } from "react-redux";
import { postMessage } from "../store";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";
import Emoji from "emoji-js";
const emoji = new Emoji.EmojiConvertor();

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
  handleSubmit(e) {
    e.preventDefault();
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
    let emojiPic = emoji.replace_colons(`:${emojiPicked.name}:`);

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

  render() {
    const getTime = date => {
      return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
    };

    return (
      <div className="chat">
        <div id='chat-messages'>
          <h3>Group Chat: </h3>
          {this.props.messages.map((message, i) => {
            return (
              <p key={i}>
                {getTime(new Date(Date.now()))} {message[0].name}: {message[1]}
              </p>
            );
          })}
        </div>

        <div id={this.state.showEmojis ? 'chat-input-toggle' : 'chat-input'}>  
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              placeholder="Type message here..."
              value={this.state.newMessage}
            />
            <span onClick={this.toggleEmoji}>🙂 </span>
            <button type="submit"> Send </button>
          </form>
          <div>
            {this.state.showEmojis ? (
            <EmojiPicker onEmojiClick={this.handleEmojiClick} />
            ) : null}
          </div>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages,
  roomId: state.roomId,
  player: state.player
});

export default connect(
  mapStateToProps
)(Chat);
