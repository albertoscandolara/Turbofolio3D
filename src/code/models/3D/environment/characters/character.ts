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
    height: number,
    assetId: number,
    isInteractable: boolean,
    checkpoint: Item | null,
    speed: number,
    canMove: boolean,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    initialYAngleRotation: number = 0
  ) {
    super(id, name, description, height, assetId, isInteractable, checkpoint, initialPosition, initialYAngleRotation);
    this._speed = speed;
    this.#canMove = canMove;
  }
}
