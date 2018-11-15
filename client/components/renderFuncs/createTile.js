import * as THREE from 'three'

export const createCube = (tile) => {
    const tileImgSrc = `/public/tile${tile.id}.png`
	const texture = new THREE.TextureLoader().load(tileImgSrc);
    const back = new THREE.TextureLoader().load('/public/back.jpg');
	const materials = [
       new THREE.MeshBasicMaterial({
		color: 0x00ff00 
       }),
       new THREE.MeshBasicMaterial({
		color: 0x00ff00 
       }),
       new THREE.MeshBasicMaterial({
		map: texture
	   }),
	   new THREE.MeshBasicMaterial({
		color: 0x00ff00 
	   }),
	   new THREE.MeshBasicMaterial({
		color: 0x00ff00 
	   }),
	   new THREE.MeshBasicMaterial({
		map: back
       })
    ];
	var cubeGeo = new THREE.CubeGeometry(1, 0.1, 1);
	let  cube = new THREE.Mesh(cubeGeo, materials);  
		  
    return cube;
}