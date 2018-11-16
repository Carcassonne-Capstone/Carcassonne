import * as THREE from 'three'

export const createCube = (tile, x, y) => {
    const tileImgSrc = `/images/${tile.id}.png`
	const texture = new THREE.TextureLoader().load(tileImgSrc);
    const back = new THREE.TextureLoader().load('/images/back.jpg');
	const materials = [
		new THREE.MeshBasicMaterial({
			color: 0x6e9329
		}),
		new THREE.MeshBasicMaterial({
			color: 0x6e9329
		}),
		new THREE.MeshBasicMaterial({
			color: 0x6e9329
		}),
		new THREE.MeshBasicMaterial({
			color: 0x6e9329
		}),
		new THREE.MeshBasicMaterial({
			map: texture
		}),
		new THREE.MeshBasicMaterial({
			map: back
		})
    ];
	var cubeGeo = new THREE.CubeGeometry(1, 1, 0.1);
	let cube = new THREE.Mesh(cubeGeo, materials);
	cube.position.x = x;
    cube.position.y = y;
    cube.position.z = 0;  
    return cube;
}