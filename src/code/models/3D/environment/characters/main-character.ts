import * as THREE from 'three';
import { Controller } from '../../../../app/3D/controllers/controller';
import { Logger } from '../../../../app/logger';
import { Item } from '../items/item';
import { Character } from './character';

export class MainCharacter extends Character {
  // User controls
  declare _controller: Controller;

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
      height,
      assetId,
      isInteractable,
      checkpoint,
      goToEnvironment,
      goToHTML,
      speed,
      canMove,
      initialPosition,
      rotation
    );
    this._logger = new Logger();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set controller to allow user to control main character actions and movements
   * @param controller the controller object to associate
   */
  public setController(controller: Controller): void {
    this._controller = controller;
  }
}
