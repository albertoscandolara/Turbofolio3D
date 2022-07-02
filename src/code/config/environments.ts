import * as THREE from 'three';
import { Light } from '../models/3D/light';
import { Environment } from '../models/3D/environment/environment';
//import { Floor } from '../models/3D/environment/floors/floor';
import { Character } from '../models/3D/environment/characters/character';
import { Building } from '../models/3D/environment/buildings/building';
import { Item } from '../models/3D/environment/items/item';

export const environments: Array<Environment> = [
  new Environment(
    0,
    `Test assets`,
    `Environment to test and adjust default assets dimensions`,
    false,
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, 0, 0),
    0,
    [
      new Character(
        0,
        `Robot_02`,
        `Robot_02`,
        1,
        4,
        false,
        null,
        null,
        null,
        0.1,
        false,
        new THREE.Vector3(3, 0, -3),
        new THREE.Euler(0, Math.PI / 2, 0)
      ),
      new Character(
        1,
        `Robot_01`,
        `Robot_01`,
        1,
        0,
        false,
        null,
        null,
        null,
        0.1,
        false,
        new THREE.Vector3(3, 0, -6),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
    ],
    [
      new Building(
        1,
        `Louvre`,
        `The Louvre museum`,
        1,
        1,
        false,
        null,
        1,
        null,
        new THREE.Vector3(-50, 0, -30),
        new THREE.Euler(0, -Math.PI / 2, 0)
      )
    ],
    [
      new Item(
        1,
        `Checkpoint`,
        `Checkpoint`,
        1,
        3,
        false,
        null,
        null,
        null,
        new THREE.Vector3(20, 0, -3),
        new THREE.Euler(0, 0, 0)
      ),
      new Item(
        1,
        `Stegosaurus`,
        `Stegosaurus`,
        1,
        5,
        false,
        null,
        null,
        null,
        new THREE.Vector3(20, 0, -10),
        new THREE.Euler(0, Math.PI / 2, 0)
      ),
      new Item(
        2,
        `Allosaurus`,
        `Allosaurus`,
        1,
        6,
        false,
        null,
        null,
        null,
        new THREE.Vector3(20, 0, -17),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
    ],
    [new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 20, 10))]
  ),
  new Environment(
    1,
    `Courtyard`,
    ``,
    true,
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, 0, 0),
    0,
    //new Floor(0, `Dust`, `Dust`, 5, 2, false, null, null, null, new THREE.Vector3(0, -0.091, 0), 0),
    [
      new Character(
        0,
        `Character`,
        `Character`,
        1,
        4,
        true,
        new Item(
          1,
          `Checkpoint`,
          `Checkpoint`,
          0.2,
          3,
          false,
          null,
          null,
          null,
          new THREE.Vector3(5, 0, -28),
          new THREE.Euler(0, 0, 0)
        ),
        null,
        null,
        0.1,
        false,
        new THREE.Vector3(5, 0, -29),
        new THREE.Euler(0, -Math.PI, 0)
      )
    ],
    [
      new Building(
        1,
        `Louvre`,
        `The Louvre museum`,
        1,
        1,
        true,
        new Item(
          1,
          `Checkpoint`,
          `Checkpoint`,
          1,
          3,
          false,
          null,
          null,
          null,
          new THREE.Vector3(0, 0, -29),
          new THREE.Euler(0, 0, 0)
        ),
        1,
        null,
        new THREE.Vector3(0, 0, -50),
        new THREE.Euler(0, -Math.PI, 0)
      )
    ],
    [],
    [
      new Light(new THREE.AmbientLight('#ffffff', 2), new THREE.Vector3(0, 20, 10))
      //new Light(new THREE.DirectionalLight('#ffffff', 1), new THREE.Vector3(0, 20, 10))
    ]
  ),
  new Environment(
    2,
    `3D models exibition room`,
    `3D Models exhibition area`,
    false,
    new THREE.Vector3(),
    new THREE.Euler(0, 0, 0),
    1,
    [],
    [],
    [
      new Item(
        1,
        `Stegosaurus`,
        `Stegosaurus`,
        1,
        5,
        false,
        null,
        null,
        null,
        new THREE.Vector3(20, 0, -15),
        new THREE.Euler(0, Math.PI / 2, 0)
      ),
      new Item(
        2,
        `Allosaurus`,
        `Allosaurus`,
        1,
        6,
        false,
        null,
        null,
        null,
        new THREE.Vector3(20, 0, -25),
        new THREE.Euler(0, Math.PI / 2, 0)
      )
    ],
    [
      new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 10, 10)),
      new Light(new THREE.PointLight('#ffffff', 15), new THREE.Vector3(10, 10, 0))
    ]
  ),
  new Environment(
    3,
    `WebSitesBuilding`,
    ``,
    false,
    new THREE.Vector3(),
    new THREE.Euler(0, 0, 0),
    0,
    [],
    [],
    [],
    [new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 10, 0))]
  ),
  new Environment(
    4,
    `ContactsBuilding`,
    ``,
    false,
    new THREE.Vector3(),
    new THREE.Euler(0, 0, 0),
    0,
    [],
    [],
    [],
    [new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 10, 0))]
  )
];
