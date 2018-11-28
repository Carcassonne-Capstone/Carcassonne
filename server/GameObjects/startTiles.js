const { Tile, Region } = require("./Tiles");

const road = "road";
const monastery = "monastery";
const city = "city";
const top = 0;
const right = 1;
const bottom = 2;
const left = 3;

const tileInfo = [
  {quantity: 3, regionInfo: [[road, [right, left], false, [0, 0]], [city, [top], false, [0, 0.35]]]},
  {quantity: 4, regionInfo: [[monastery, [], false, [0, 0]]]},
  {quantity: 5, regionInfo: [[city, [top], false, [0, 0.35]]]},
  {quantity: 1, regionInfo: [[city, [right, left], false, [0, 0]]]},
  {quantity: 2, regionInfo: [[city, [right, left], true, [0, 0]]]},
  {quantity: 3, regionInfo: [[city, [top, right, left], false, [0, 0.15]]]},
  {quantity: 1, regionInfo: [[city, [top, right, left], true, [0, 0.15]]]},
  {quantity: 1, regionInfo: [[city, [top, right, bottom, left], true, [0, 0]]]},
  {quantity: 3, regionInfo: [[city, [top, right], false, [0.25, 0.25]]]},
  {quantity: 2, regionInfo: [[city, [top, right], true, [0.25, 0.25]]]},
  {quantity: 3, regionInfo: [[city, [top], false, [0, 0.35]], [city, [bottom], false, [0, -0.35]]]},
  {quantity: 2, regionInfo: [[city, [top], false, [0, 0.35]], [city, [right], false, [0.35, 0]]]},
  {quantity: 2, regionInfo: [[monastery, [], false, [0, 0]], [road, [bottom], false, [0, -0.35]]]},
  {quantity: 1, regionInfo: [[city, [top, right, left], false, [0, 0.15]], [road, [bottom], false, [0, -0.35]]]},
  {quantity: 2, regionInfo: [[city, [top, right, left], true, [0, 0.15]], [road, [bottom], false, [0, -0.35]]]},
  {quantity: 8, regionInfo: [[road, [right, left], false, [0, 0]]]},
  {quantity: 3, regionInfo: [[city, [top, right], false, [0.25, 0.25]], [road, [bottom, left], false, [-0.2, -0.2]]]},
  {quantity: 2, regionInfo: [[city, [top, right], true, [0.25, 0.25]], [road, [bottom, left], false, [-0.2, -0.2]]]},
  {quantity: 9, regionInfo: [[road, [bottom, left], false, [-0.1, -0.1]]]},
  {quantity: 3, regionInfo: [[city, [top], false, [0, 0.35]], [road, [bottom, left], false, [-0.1, -0.1]]]},
  {quantity: 3, regionInfo: [[city, [top], false, [0, 0.35]], [road, [right, bottom], false, [0.1, -0.1]]]},
  {quantity: 4, regionInfo: [[road, [right], false, [0.35, 0]], [road, [bottom], false, [0, -0.35]], [road, [left], false, [-0.35, 0]]]},
  {quantity: 3, regionInfo: [[city, [top], false, [0, 0.35]], [road, [right], false, [0.35, 0]], [road, [bottom], false, [0, -0.35]], [road, [left], false, [-0.35, 0]]]},
  {quantity: 1, regionInfo: [[road, [top], false, [0, 0.35]], [road, [right], false, [0.35, 0]], [road, [bottom], false, [0, -0.35]], [road, [left], false, [-0.35, 0]]]}
];

const getDeckTiles = () => {
  const tiles = [];
  tileInfo.forEach((tile, idx) => {
    for (let i = 0; i < tile.quantity; i++) {
      let regions = tile.regionInfo.map(region => new Region(...region));
      tiles.push(new Tile(regions, idx));
    }
  });
  return tiles;
};

module.exports = getDeckTiles;
