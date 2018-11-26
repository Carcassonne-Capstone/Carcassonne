class Player {
  constructor(name, roomId, socketId, color, sound, host) {
    this.name = name;
    this.room = roomId;
    this.socketId = socketId;
    this.meeple = 7;
    this.color = color;
    this.sound = sound;
    this.host = host;
  }

  isUp(name) {
    return this.name === name;
  }
}

module.exports = Player;
