function Region(type, edges, hasShield, meeplePosition) {
  this.type = type;
  this.edges = edges;
  this.hasShield = hasShield;
  this.meeple = [];
  this.meeplePosition = meeplePosition;
}

class Tile {
  constructor(regions, id) {
    this.regions = regions;
    this.id = id;
  }
}

module.exports = { Tile, Region };
