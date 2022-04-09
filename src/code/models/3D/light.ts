import * as THREE from 'three';

export class Light {
  declare _light: THREE.Light;
  declare _position: THREE.Vector3;

  /**
   * Constructor
   */
  constructor(light: THREE.Light, position: THREE.Vector3) {
    this._light = light;
    this._position = position;
  }
}
