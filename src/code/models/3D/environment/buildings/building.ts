import * as THREE from 'three';
import { Item } from '../items/item';
import { Model } from '../model';

export class Building extends Model {
  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    scale: number,
    assetId: number,
    isInteractable: boolean = false,
    checkpoint: Item | null = null,
    goToEnvironment: number | null,
    goToHTML: number | null,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    rotation: THREE.Euler = new THREE.Euler()
  ) {
    super(
      id,
      name,
      description,
      scale,
      assetId,
      isInteractable,
      checkpoint,
      goToEnvironment,
      goToHTML,
      initialPosition,
      rotation
    );

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }
}
