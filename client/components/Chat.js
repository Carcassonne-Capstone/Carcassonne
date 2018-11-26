import React from "React";
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
    //  this.props.submitMessage(this.state.newMessage);
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
        <h3>Group Chat: </h3>
        <div>
          {this.props.messages.map(message => {
            return (
              <p>
                {getTime(new Date(Date.now()))} {message[0].name}: {message[1]}
              </p>
            );
          })}
        </div>

        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            placeholder="Type message here..."
            value={this.state.newMessage}
          />
          <span onClick={this.toggleEmoji}>🙂 </span>
          <button type="submit"> Send </button>
        </form>
        {this.state.showEmojis ? (
          <EmojiPicker onEmojiClick={this.handleEmojiClick} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages,
  roomId: state.game.roomId,
  player: state.game.player
});

const mapDispatchToProps = dispatch => ({
  submitMessage: message => dispatch(postMessage(message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
