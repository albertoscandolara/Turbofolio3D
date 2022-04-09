import * as THREE from 'three';
import { App3D } from '~/app/3D/app-3D';
import { Controller } from '../../../../app/3D/controllers/controller';
import { Logger } from '../../../../app/logger';
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
    speed: number,
    canMove: boolean,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    initialYAngleRotation: number = 0
  ) {
    super(id, name, description, height, assetId, speed, canMove, initialPosition, initialYAngleRotation);
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
