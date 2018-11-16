class Deck {
    constructor(tiles) {
      this.tiles = tiles;
    }

    shuffle() {
        this.tiles.forEach((tile, i) => {
            let randIdx = Math.floor(Math.random() * this.tiles.length)
            this.tiles[i] = this.tiles[randIdx];
            this.tiles[randIdx] = tile
        })
    }

    getCard() {
        return this.tiles.splice(0, 1);
    }
}

module.exports = Deck