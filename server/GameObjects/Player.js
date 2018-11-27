class Player {
  constructor(name, roomId, socketId, color, sound, chatImg) {
    this.name = name;
    this.room = roomId;
    this.socketId = socketId;
    this.meeple = 7;
    this.color = color;
    this.sound = sound;
    this.chatIconSrc = chatImg;
    this.animal = '';
    this.host = false;
  }

  setHost() {
    this.host = true;
  }

  isUp(name) {
    return this.name === name;
  }
}

module.exports = Player;
