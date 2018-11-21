class Player {
  constructor(name, roomId, color) {
    this.name = name;
    this.room = roomId;
    this.meeple = 7;
    this.color = color;
  }

  isUp(name) {
    return this.name === name;
  }
}

module.exports = Player;
