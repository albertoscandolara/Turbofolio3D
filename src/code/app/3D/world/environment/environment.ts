// import { EnvironmentsUtils } from './environments-util';

import * as THREE from 'three';
import { BackgroundCubeTexture } from '~/models/3D/environment/backgrounds/background';
import { Building } from '~/models/3D/environment/buildings/building';
import { Character } from '~/models/3D/environment/characters/character';
import { Floor } from '~/models/3D/environment/floors/floor';
import { Item } from '~/models/3D/environment/items/item';
import { App3D } from '../../app-3D';
import { Light } from './light';

export class Environment {
  declare _app3D: App3D;
  declare _scene: THREE.Scene;
  declare _light: Light;

  declare _characters: Array<Character>;
  declare _buildings: Array<Building>;
  declare _items: Array<Item>;

  declare _navMesh: THREE.Mesh;
  declare _floor: Floor;
  declare _backgroundCubeTexture: BackgroundCubeTexture;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    this._app3D = app3D;

    this._scene = this._app3D._scene;
    this._light = new Light();

    this._characters = [];
    this._buildings = [];
    this._items = [];

    const light1: THREE.AmbientLight = new THREE.AmbientLight('#ffffff', 1);
    light1.position.set(10, 10, 10);
    this._scene.add(light1);

    const light2: THREE.DirectionalLight = new THREE.DirectionalLight('#ffffff', 1);
    light2.position.set(10, 10, 10);
    this._scene.add(light2);
  }

  /**
   * An asset has been loaded.
   * Set it to all the models with the corresponding assetId
   * @param assetId id of the loaded asset
   */
  public setModel(assetId: number) {
    [...this._characters, ...this._buildings, ...this._items]
      .filter((model) => !model._asset && model._assetId === assetId)
      .forEach((model) => model.setAsset(assetId));
  }
}
