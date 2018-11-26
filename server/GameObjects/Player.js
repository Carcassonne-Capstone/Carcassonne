class Player {
  constructor(name, roomId, color, sound) {
    this.name = name;
    this.room = roomId;
    this.meeple = 7;
    this.color = color;
    this.sound = sound;
  }

  isUp(name) {
    return this.name === name;
  }
}

module.exports = Player;
