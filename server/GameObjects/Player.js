class Player {
  constructor(name, roomId, color, sound, chatImg) {
    this.name = name;
    this.room = roomId;
    this.meeple = 7;
    this.color = color;
    this.sound = sound;
    this.chatIconSrc = chatImg;
  }

  isUp(name) {
    return this.name === name;
  }
}

module.exports = Player;
