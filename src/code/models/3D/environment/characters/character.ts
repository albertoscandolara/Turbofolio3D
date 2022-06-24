import * as THREE from 'three';
import { Item } from '../items/item';
import { Model } from '../model';

export class Character extends Model {
  declare _speed: number;
  #canMove: boolean;

  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    scale: number,
    assetId: number,
    isInteractable: boolean,
    checkpoint: Item | null,
    goToEnvironment: number | null,
    goToHTML: number | null,
    speed: number,
    canMove: boolean,
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
    this._speed = speed;
    this.#canMove = canMove;
  }
}
