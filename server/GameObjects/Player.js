class Player {
    constructor(name, roomId) {
        this.name = name
        this.room = roomId
    }

    isUp(name) {
        return this.name === name
    }
}

module.exports = Player