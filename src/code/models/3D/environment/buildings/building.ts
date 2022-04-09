import * as THREE from 'three';
import { Model } from '../model';

export class Building extends Model {
  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    height: number,
    assetId: number,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    initialYAngleRotation: number = 0
  ) {
    super(id, name, description, height, assetId, initialPosition, initialYAngleRotation);

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }
}
