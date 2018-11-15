let road = "road";
let monastery = "monastery";
let city = "city";
let top = 0;
let right = 1;
let bottom = 2;
let left = 3;

const Region = (type, edges, hasShield) => {
  this.type = type;
  this.edges = edges;
  this.hasShield = hasShield;
  this.meeple = [];
};

class Tile {
  constructor(regions) {
    this.regions = regions;
  }
}

let deck = [
  new Tile([
    new Region(road, [right, left], false),
    new Region(city, [top], false)
  ]),

  new Tile([
    new Region(road, [right, left], false),
    new Region(city, [top], false)
  ]),

  new Tile([
    new Region(road, [right, left], false),
    new Region(city, [top], false)
  ]),

  new Tile([
    new Region(road, [right, left], false),
    new Region(city, [top], false)
  ]),

  new Tile([new Region(monastery, [], false)]),
  new Tile([new Region(monastery, [], false)]),
  new Tile([new Region(monastery, [], false)]),
  new Tile([new Region(monastery, [], false)]),

  new Tile([new Region(city, [top], false)]),
  new Tile([new Region(city, [top], false)]),
  new Tile([new Region(city, [top], false)]),
  new Tile([new Region(city, [top], false)]),
  new Tile([new Region(city, [top], false)]),

  new Tile([new Region(city, [right, left], false)]),

  new Tile([new Region(city, [right, left], true)]),
  new Tile([new Region(city, [right, left], true)]),

  new Tile([new Region(city, [top, right, left], false)]),
  new Tile([new Region(city, [top, right, left], false)]),
  new Tile([new Region(city, [top, right, left], false)]),

  new Tile([new Region(city, [top, right, left], true)]),

  new Tile([new Region(city, [top, right, bottom, left], true)]),

  new Tile([new Region(city, [top, right], false)]),
  new Tile([new Region(city, [top, right], false)]),
  new Tile([new Region(city, [top, right], false)]),

  new Tile([new Region(city, [top, right], true)]),
  new Tile([new Region(city, [top, right], true)]),

  new Tile([new Region(city, [top], false), new Region(city, [bottom], false)]),

  new Tile([new Region(city, [top], false), new Region(city, [bottom], false)]),

  new Tile([new Region(city, [top], false), new Region(city, [bottom], false)]),

  new Tile([new Region(city, [top], false), new Region(city, [right], false)]),

  new Tile([new Region(city, [top], false), new Region(city, [right], false)]),

  new Tile([
    new Region(monastery, [], false),
    new Region(road, [bottom], false)
  ]),
  new Tile([
    new Region(monastery, [], false),
    new Region(road, [bottom], false)
  ]),

  new Tile([
    new Region(city, [top, right, left], false),
    new Region(road, [bottom], false)
  ]),

  new Tile([
    new Region(city, [top, right, left], true),
    new Region(road, [bottom], false)
  ]),
  new Tile([
    new Region(city, [top, right, left], true),
    new Region(road, [bottom], false)
  ]),

  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),
  new Tile([new Region(road, [right, left], false)]),

  new Tile([
    new Region(city, [top, right], false),
    new Region(road, [bottom, left], false)
  ]),
  new Tile([
    new Region(city, [top, right], false),
    new Region(road, [bottom, left], false)
  ]),
  new Tile([
    new Region(city, [top, right], false),
    new Region(road, [bottom, left], false)
  ]),

  new Tile([
    new Region(city, [top, right], true),
    new Region(road, [bottom, left], false)
  ]),

  new Tile([
    new Region(city, [top, right], true),
    new Region(road, [bottom, left], false)
  ]),

  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),
  new Tile([new Region(road, [bottom, left], false)]),

  new Tile([
    new Region(city, [top], false),
    new Region(road, [bottom, left], false)
  ]),

  new Tile([
    new Region(city, [top], false),
    new Region(road, [bottom, left], false)
  ]),
  new Tile([
    new Region(city, [top], false),
    new Region(road, [bottom, left], false)
  ]),

  new Tile([
    new Region(city, [top], false),
    new Region(road, [right, bottom], false)
  ]),
  new Tile([
    new Region(city, [top], false),
    new Region(road, [right, bottom], false)
  ]),
  new Tile([
    new Region(city, [top], false),
    new Region(road, [right, bottom], false)
  ]),

  new Tile([
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),

  new Tile([
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),

  new Tile([
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),

  new Tile([
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),

  new Tile([
    new Region(city, [top], false),
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),

  new Tile([
    new Region(city, [top], false),
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),
  new Tile([
    new Region(city, [top], false),
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ]),

  new Tile([
    new Region(road, [top], false),
    new Region(road, [right], false),
    new Region(road, [bottom], false),
    new Region(road, [left], false)
  ])
];

class Deck {
  constructor() {
    this.Tiles = [];
  }
}
