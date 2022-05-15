import * as THREE from 'three';
import { Item } from '../items/item';
import { Model } from '../model';

export class Floor extends Model {
  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    height: number,
    assetId: number,
    isInteractable: boolean,
    checkpoint: Item | null,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    initialYAngleRotation: number = 0
  ) {
    super(id, name, description, height, assetId, isInteractable, checkpoint, initialPosition, initialYAngleRotation);

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }
}
