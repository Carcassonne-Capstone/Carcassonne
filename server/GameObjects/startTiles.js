const { Tile, Region } = require("./Tiles");

const road = "road";
const monastery = "monastery";
const city = "city";
const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

module.exports = [
  // new Tile([new Region(road, [right, left], false), new Region(city, [top], false)], 0),
  new Tile(
    [
      new Region(road, [right, left], false, [0, 0]),
      new Region(city, [top], false, [0, 0.35])
    ],
    0
  ),
  new Tile(
    [
      new Region(road, [right, left], false, [0, 0]),
      new Region(city, [top], false, [0, 0.35])
    ],
    0
  ),
  new Tile(
    [
      new Region(road, [right, left], false, [0, 0]),
      new Region(city, [top], false, [0, 0.35])
    ],
    0
  ),
  new Tile([new Region(monastery, [], false, [0, 0])], 1),
  new Tile([new Region(monastery, [], false, [0, 0])], 1),
  new Tile([new Region(monastery, [], false, [0, 0])], 1),
  new Tile([new Region(monastery, [], false, [0, 0])], 1),
  new Tile([new Region(city, [top], false, [0, 0.35])], 2),
  new Tile([new Region(city, [top], false, [0, 0.35])], 2),
  new Tile([new Region(city, [top], false, [0, 0.35])], 2),
  new Tile([new Region(city, [top], false, [0, 0.35])], 2),
  new Tile([new Region(city, [top], false, [0, 0.35])], 2),
  new Tile([new Region(city, [right, left], false, [0, 0])], 3),
  new Tile([new Region(city, [right, left], true, [0, 0])], 4),
  new Tile([new Region(city, [right, left], true, [0, 0])], 4),
  new Tile([new Region(city, [top, right, left], false, [0, 0.15])], 5),
  new Tile([new Region(city, [top, right, left], false, [0, 0.15])], 5),
  new Tile([new Region(city, [top, right, left], false, [0, 0.15])], 5),
  new Tile([new Region(city, [top, right, left], true, [0, 0.15])], 6),
  new Tile([new Region(city, [top, right, bottom, left], true, [0, 0])], 7),
  new Tile([new Region(city, [top, right], false, [0.25, 0.25])], 8),
  new Tile([new Region(city, [top, right], false, [0.25, 0.25])], 8),
  new Tile([new Region(city, [top, right], false, [0.25, 0.25])], 8),
  new Tile([new Region(city, [top, right], true, [0.25, 0.25])], 9),
  new Tile([new Region(city, [top, right], true, [0.25, 0.25])], 9),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(city, [bottom], false, [0, -0.35])
    ],
    10
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(city, [bottom], false, [0, -0.35])
    ],
    10
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(city, [bottom], false, [0, -0.35])
    ],
    10
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(city, [right], false, [0.35, 0])
    ],
    11
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(city, [right], false, [0.35, 0])
    ],
    11
  ),
  new Tile(
    [
      new Region(monastery, [], false, [0, 0]),
      new Region(road, [bottom], false, [0, -0.3])
    ],
    12
  ),
  new Tile(
    [
      new Region(monastery, [], false, [0, 0]),
      new Region(road, [bottom], false, [0, -0.3])
    ],
    12
  ),
  new Tile(
    [
      new Region(city, [top, right, left], false, [0, 0.15]),
      new Region(road, [bottom], false, [0, -0.35])
    ],
    13
  ),
  new Tile(
    [
      new Region(city, [top, right, left], true, [0, 0.15]),
      new Region(road, [bottom], false, [0, -0.35])
    ],
    14
  ),
  new Tile(
    [
      new Region(city, [top, right, left], true, [0, 0.15]),
      new Region(road, [bottom], false, [0, -0.35])
    ],
    14
  ),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile([new Region(road, [right, left], false, [0, 0])], 15),
  new Tile( //weird
    [
      new Region(city, [top, right], false, [0.25, 0.25]),
      new Region(road, [bottom, left], false, [-0.2, -0.2])
    ],
    16
  ),
  new Tile( //weird
    [
      new Region(city, [top, right], false, [0.25, 0.25]),
      new Region(road, [bottom, left], false, [-0.2, -0.2])
    ],
    16
  ),
  new Tile( //weird
    [
      new Region(city, [top, right], false, [0.25, 0.25]),
      new Region(road, [bottom, left], false, [-0.2, -0.2])
    ],
    16
  ),
  new Tile(
    [
      new Region(city, [top, right], true, [0.25, 0.25]),
      new Region(road, [bottom, left], false, [-0.2, -0.2])
    ],
    17
  ),
  new Tile(
    [
      new Region(city, [top, right], true, [0.25, 0.25]),
      new Region(road, [bottom, left], false, [-0.2, -0.2])
    ],
    17
  ),
  // weird
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile([new Region(road, [bottom, left], false, [-0.1, -0.1])], 18),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [bottom, left], false, [-0.1, -0.1])
    ],
    19
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [bottom, left], false, [-0.1, -0.1])
    ],
    19
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [bottom, left], false, [-0.1, -0.1])
    ],
    19
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [right, bottom], false, [0.1, -0.1])
    ],
    20
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [right, bottom], false, [0.1, -0.1])
    ],
    20
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [right, bottom], false, [0.1, -0.1])
    ],
    20
  ),
  new Tile(
    [
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    21
  ),
  new Tile(
    [
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    21
  ),
  new Tile(
    [
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    21
  ),
  new Tile(
    [
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    21
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    22
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    22
  ),
  new Tile(
    [
      new Region(city, [top], false, [0, 0.35]),
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    22
  ),
  new Tile(
    [
      new Region(road, [top], false, [0, 0.35]),
      new Region(road, [right], false, [0.35, 0]),
      new Region(road, [bottom], false, [0, -0.35]),
      new Region(road, [left], false, [-0.35, 0])
    ],
    23
  )
];
