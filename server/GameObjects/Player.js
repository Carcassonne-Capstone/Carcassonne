class Player {
  constructor(name, roomId, socketId, color) {
    this.name = name;
    this.room = roomId;
    this.socketId = socketId;
    this.meeple = 7;
    this.color = color;
    this.animal = '';
    this.host = false;
  }

  setHost() {
    this.host = true;
  }

  isUp(name) {
    return this.name === name;
  }
  setAnimal(animal) {
    this.animal = animal;
  }
}

module.exports = Player;
