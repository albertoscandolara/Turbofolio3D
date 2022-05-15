import * as THREE from 'three';

import { Character } from '../models/3D/environment/characters/character';

export const mainCharacterId: number = 0;

export const characters: Array<Character> = [
  // new Character(
  //   0,
  //   `Main character`,
  //   `Main character`,
  //   170,
  //   -1,
  //   5,
  //   true,
  //   new THREE.Vector3(0, 0, 0),
  //   new THREE.Vector3(0, 90, 0)
  // )
  new Character(
    0,
    `Main character`,
    `Main character`,
    700,
    -1,
    false,
    null,
    0.1,
    true,
    new THREE.Vector3(0, 0, 0),
    Math.PI / 2
  )
];
