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
  constructor(regions, id) {
    this.regions = regions;
    this.id = id;
  }
}

let deck = [
  new Tile([new Region(road, [right, left], false), new Region(city, [top], false)], 0),
  new Tile([new Region(road, [right, left], false), new Region(city, [top], false)], 0),
  new Tile([new Region(road, [right, left], false), new Region(city, [top], false)], 0),
  new Tile([new Region(road, [right, left], false), new Region(city, [top], false)], 0),
  new Tile([new Region(monastery, [], false)], 1),
  new Tile([new Region(monastery, [], false)], 1),
  new Tile([new Region(monastery, [], false)], 1),
  new Tile([new Region(monastery, [], false)], 1),
  new Tile([new Region(city, [top], false)], 2),
  new Tile([new Region(city, [top], false)], 2),
  new Tile([new Region(city, [top], false)], 2),
  new Tile([new Region(city, [top], false)], 2),
  new Tile([new Region(city, [top], false)], 2),
  new Tile([new Region(city, [right, left], false)], 3),
  new Tile([new Region(city, [right, left], true)], 4),
  new Tile([new Region(city, [right, left], true)], 4),
  new Tile([new Region(city, [top, right, left], false)], 5),
  new Tile([new Region(city, [top, right, left], false)], 5),
  new Tile([new Region(city, [top, right, left], false)], 5),
  new Tile([new Region(city, [top, right, left], true)], 6),
  new Tile([new Region(city, [top, right, bottom, left], true)], 7),
  new Tile([new Region(city, [top, right], false)], 8),
  new Tile([new Region(city, [top, right], false)], 8),
  new Tile([new Region(city, [top, right], false)], 8),
  new Tile([new Region(city, [top, right], true)], 9),
  new Tile([new Region(city, [top, right], true)], 9),
  new Tile([new Region(city, [top], false), new Region(city, [bottom], false)], 10),
  new Tile([new Region(city, [top], false), new Region(city, [bottom], false)], 10),
  new Tile([new Region(city, [top], false), new Region(city, [bottom], false)], 10),
  new Tile([new Region(city, [top], false), new Region(city, [right], false)], 11),
  new Tile([new Region(city, [top], false), new Region(city, [right], false)], 11),
  new Tile([new Region(monastery, [], false), new Region(road, [bottom], false)], 12),
  new Tile([new Region(monastery, [], false), new Region(road, [bottom], false)], 12),
  new Tile([new Region(city, [top, right, left], false), new Region(road, [bottom], false)], 13),
  new Tile([new Region(city, [top, right, left], true), new Region(road, [bottom], false)], 14),
  new Tile([new Region(city, [top, right, left], true), new Region(road, [bottom], false)], 14),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(road, [right, left], false)], 15),
  new Tile([new Region(city, [top, right], false), new Region(road, [bottom, left], false)], 16),
  new Tile([new Region(city, [top, right], false), new Region(road, [bottom, left], false)], 16),
  new Tile([new Region(city, [top, right], false), new Region(road, [bottom, left], false)], 16),
  new Tile([new Region(city, [top, right], true), new Region(road, [bottom, left], false)], 17),
  new Tile([new Region(city, [top, right], true), new Region(road, [bottom, left], false)], 17),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(road, [bottom, left], false)], 18),
  new Tile([new Region(city, [top], false), new Region(road, [bottom, left], false)], 19),
  new Tile([new Region(city, [top], false), new Region(road, [bottom, left], false)], 19),
  new Tile([new Region(city, [top], false), new Region(road, [bottom, left], false)], 19),
  new Tile([new Region(city, [top], false), new Region(road, [right, bottom], false)], 20),
  new Tile([new Region(city, [top], false), new Region(road, [right, bottom], false)], 20),
  new Tile([new Region(city, [top], false), new Region(road, [right, bottom], false)], 20),
  new Tile([new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 21),
  new Tile([new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 21),
  new Tile([new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 21),
  new Tile([new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 21),
  new Tile([new Region(city, [top], false), new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 22),
  new Tile([new Region(city, [top], false), new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 22),
  new Tile([new Region(city, [top], false), new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 22),
  new Tile([new Region(road, [top], false), new Region(road, [right], false), new Region(road, [bottom], false), new Region(road, [left], false)], 23)
];

class Deck {
  constructor() {
    this.Tiles = [];
  }
}

//create tile cube
// const tile1 = '/public/tile.jpeg';
// 	const createCube = (tileImgSrc) => {
// 	const texture = new THREE.TextureLoader().load(tileImgSrc);
// 	const materials = [
//        new THREE.MeshBasicMaterial({
// 		color: 0x00ff00 
//        }),
//        new THREE.MeshBasicMaterial({
// 		color: 0x00ff00 
//        }),
//        new THREE.MeshBasicMaterial({
// 		map: texture
// 	   }),
// 	   new THREE.MeshBasicMaterial({
// 		color: 0x00ff00 
// 	   }),
// 	   new THREE.MeshBasicMaterial({
// 		color: 0x00ff00 
// 	   }),
// 	   new THREE.MeshBasicMaterial({
// 		color: 0x00ff00
//        })
//     ];
// 	var cubeGeo = new THREE.CubeGeometry(1, 0.1, 1);
// 	let  cube = new THREE.Mesh(cubeGeo, materials);  
		  
//     return cube;
// 	}
// 	const createdCube = createCube(tile1);
// 	scene.add(createdCube);