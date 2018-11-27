import * as THREE from "three";

export const createMeeple = (x, y, color, sound, regionType) => {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cylinder = new THREE.Mesh(geometry, material);
  let zPos = 0.15
  if (regionType === 'monastery') zPos = 1.05
  else if (regionType === 'city') zPos = 0.65
  cylinder.position.x = x;
  cylinder.position.y = y;
  cylinder.position.z = zPos;
  cylinder.rotation.x = Math.PI / 2;
  cylinder.name = `meeple-${x},${y}`
  cylinder.soundEffect= sound;
  return cylinder;
};

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
