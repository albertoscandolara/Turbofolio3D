import * as THREE from 'three';
import { Asset, AssetCategory, AssetType } from '../models/3D/environment/asset';

const assetsFolder: string = `src/assets`;
const modelsFolder: string = `${assetsFolder}/models`;
const charactersFolder: string = `${modelsFolder}/characters`;
const buildingsFolder: string = `${modelsFolder}/buildings`;
const floorsFolder: string = `${modelsFolder}/floors`;
const itemsFolder: string = `${modelsFolder}/items`;

export const assets: Array<Asset> = [
  new Asset(
    0,
    'Robot_01',
    200,
    'A robot',
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, 0, 0),
    `${charactersFolder}/robot_01/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Character
  ),
  new Asset(
    1,
    'Louvre',
    2300,
    'Louvre museum',
    new THREE.Vector3(),
    new THREE.Euler(0, Math.PI / 2, 0),
    `${buildingsFolder}/louvre/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Building
  ),
  new Asset(
    3,
    'Checkpoint',
    70,
    'Checkpoint',
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, 0, 0),
    `${itemsFolder}/checkpoint/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Item
  ),
  new Asset(
    4,
    'Robot_02',
    100,
    'Robot 2',
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, Math.PI / 2, 0),
    `${charactersFolder}/robot_02/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Character
  ),
  new Asset(
    5,
    'Stegosaurus',
    700,
    'Stegosaurus',
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, Math.PI / 2, 0),
    `${itemsFolder}/stegosaurus/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Item
  ),
  new Asset(
    6,
    'Allosaurus',
    700,
    'Allosaurus',
    new THREE.Vector3(0, 0, 0),
    new THREE.Euler(0, Math.PI / 2, 0),
    `${itemsFolder}/allosaurus/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Item
  )
];
