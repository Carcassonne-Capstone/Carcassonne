import * as THREE from "three";

const getModelData = (animal) => {
  switch (animal) {
    case 'tiger':
      return {posZ: .25, scaleX:.003, scaleY:.003, scaleZ:.003, rotX: Math.PI/2, rotY: Math.PI/2}
    case 'gorilla':
      return {posZ: .05, scaleX:.003, scaleY:.003, scaleZ:.003, rotX: Math.PI, rotY: Math.PI}   
    case 'elephant':
      return {posZ: .05, scaleX:.0015, scaleY:.0015, scaleZ:.0015, rotX: Math.PI, rotY: Math.PI} 
    case 'monkey':
      return {posZ: .05, scaleX:.006, scaleY:.006, scaleZ:.006, rotX: Math.PI, rotY: Math.PI} 
    case 'lion':
      return {posZ: .05, scaleX:.004, scaleY:.004, scaleZ:.004, rotX: Math.PI, rotY: Math.PI}     
    default:
      return {posZ: .05, scaleX:.004, scaleY:.004, scaleZ:.004, rotX: Math.PI, rotY: Math.PI}
    }
}

export const createMeeple = (x, y, regionType, tile, animal) => {
  const objLoader = new THREE.ObjectLoader();
  let zPosAdd = 0
  if (regionType === 'monastery') zPosAdd = 0.7
  else if (regionType === 'city') zPosAdd = 0.4
  objLoader.load(`/animals/${animal}.json`, (object) => {
    console.log('loading')
    const data = getModelData(animal);
    object.position.x = x;
    object.position.y = y;
    object.position.z = data.posZ + zPosAdd;
    object.scale.x = data.scaleX;
    object.scale.y = data.scaleY;
    object.scale.z = data.scaleZ;
    object.rotation.x = data.rotX;
    object.rotation.y = data.rotY;
    object.name = `meeple-${x},${x}`
    object.soundEffect = `animals/Sounds/${animal}.mp3`;
    tile.add(object)
  })
}

export const createEmptyMeeple = (x, y, regionIdx, tile, regionType) => {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xa9b6cc });
  const cylinder = new THREE.Mesh(geometry, material);
  let zPos = 0.1
  if (regionType === 'monastery') zPos = 0.9
  else if (regionType === 'city') zPos = 0.5
  cylinder.position.x = x;
  cylinder.position.y = y;
  cylinder.position.z = zPos;
  cylinder.rotation.x = Math.PI / 2;
  cylinder.name = `emptyMeeple-${x},${y}`
  cylinder.regionIdx = regionIdx
  cylinder.tile = tile
  return cylinder;
};
