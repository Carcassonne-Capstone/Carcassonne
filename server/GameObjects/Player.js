class Player {
    constructor(name, roomId) {
        this.name = name
        this.room = roomId
        this.meeple = 7
    }

    isUp(name) {
        return this.name === name
    }
}

module.exports = Player