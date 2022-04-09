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
    'A robot',
    `${charactersFolder}/robot_01/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Character
  ),
  new Asset(
    1,
    'Louvre',
    'Louvre museum',
    `${buildingsFolder}/louvre/scene.gltf`,
    AssetType.DRACO,
    AssetCategory.Building
  ),
  new Asset(2, 'Dust', 'Dust', `${floorsFolder}/dust/scene.gltf`, AssetType.DRACO, AssetCategory.Floor)
];
