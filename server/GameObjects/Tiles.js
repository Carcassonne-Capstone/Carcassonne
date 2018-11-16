function Region(type, edges, hasShield) {
  this.type = type;
  this.edges = edges;
  this.hasShield = hasShield;
  this.meeple = [];
}

class Tile {
  constructor(regions, id) {
    this.regions = regions;
    this.id = id;
  }
}

module.exports = {Tile, Region}