import * as THREE from 'three';
import { Light } from '../models/3D/light';
import { Building } from '../models/3D/environment/buildings/building';
import { Environment } from '../models/3D/environment/environment';
import { Floor } from '../models/3D/environment/floors/floor';
import { Item } from '../models/3D/environment/items/item';

export const environments: Array<Environment> = [
  new Environment(
    0,
    `Courtyard`,
    ``,
    true,
    new THREE.Vector3(0, 0, 0),
    Math.PI / 2,
    0,
    new Floor(0, `Dust`, `Dust`, 5, 2, false, null, new THREE.Vector3(0, -0.091, 0), 0),
    [],
    [
      new Building(
        0,
        `Louvre`,
        `The Louvre museum`,
        2300,
        1,
        true,
        new Item(1, `Checkpoint`, `Checkpoint`, 120, 3, false, null, new THREE.Vector3(-27, 0, 0), 0),
        new THREE.Vector3(-50, 0, 0),
        0
      ),
      new Building(
        1,
        `Louvre`,
        `The Louvre museum`,
        1000,
        1,
        true,
        new Item(1, `Checkpoint`, `Checkpoint`, 120, 3, false, null, new THREE.Vector3(40, 0, 28), 0),
        new THREE.Vector3(40, 0, 40),
        Math.PI / 2
      )
    ],
    [],
    [
      new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 20, 10)),
      new Light(new THREE.DirectionalLight('#ffffff', 1), new THREE.Vector3(0, 20, 10))
    ]
  ),
  new Environment(
    1,
    `ModelsBuilding`,
    ``,
    false,
    new THREE.Vector3(),
    0,
    0,
    new Floor(0, `Dust`, `Dust`, 1, 2, false, null, new THREE.Vector3(0, 0, 0), 0),
    [],
    [],
    [],
    [new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 10, 0))]
  ),
  new Environment(
    2,
    `WebSitesBuilding`,
    ``,
    false,
    new THREE.Vector3(),
    0,
    0,
    new Floor(0, `Dust`, `Dust`, 1, 2, false, null, new THREE.Vector3(0, 0, 0), 0),
    [],
    [],
    [],
    [new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 10, 0))]
  ),
  new Environment(
    3,
    `ContactsBuilding`,
    ``,
    false,
    new THREE.Vector3(),
    0,
    0,
    new Floor(0, `Dust`, `Dust`, 1, 2, false, null, new THREE.Vector3(0, 0, 0), 0),
    [],
    [],
    [],
    [new Light(new THREE.AmbientLight('#ffffff', 1), new THREE.Vector3(0, 10, 0))]
  )
];
