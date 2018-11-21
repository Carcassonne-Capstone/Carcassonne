import * as THREE from "three";

export const createMeeple = (x, y) => {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.x = x;
  cylinder.position.y = y;
  cylinder.position.z = 0.15;
  cylinder.rotation.x = Math.PI / 2;
  return cylinder;
};

export const createEmptyMeeple = (x, y) => {
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xa9b6cc });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.x = x;
  cylinder.position.y = y;
  cylinder.position.z = 0.15;
  cylinder.rotation.x = Math.PI / 2;
  return cylinder;
};
