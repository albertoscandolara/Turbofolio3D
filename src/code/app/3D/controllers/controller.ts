import * as THREE from 'three';
import { Logger } from '../../../app/logger';
import { MainCharacter } from '../../../models/3D/environment/characters/main-character';
import { App3D } from '../app-3D';
import { Time } from '../utils/time';

import { keydown, keyup, mousedown, mouseup } from '../../../config/events';
import {
  forwardKeyboardKeys,
  backwardKeyboardKeys,
  leftKeyboardKeys,
  rightKeyboardKeys
} from '../../../config/controller';

export class Move {
  declare forward: boolean;
  declare backward: boolean;
  declare right: boolean;
  declare left: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.forward = false;
    this.backward = false;
    this.right = false;
    this.left = false;
  }
}
export class Controller {
  _logger: Logger;

  declare _time: Time;
  declare _canvas: HTMLCanvasElement;

  declare _mainCharacter: MainCharacter;
  //declare _floor: Floor;

  declare _raycaster: THREE.Raycaster;

  declare _cameraBase: THREE.Object3D;
  declare _cameraHigh: THREE.Camera;

  declare gamepad: any;
  declare _touchController: any;

  declare _move: Move;
  declare _explore: boolean;

  declare _mainCharacterRotationAngle: number;
  declare _mainCharacterTraslationDistance: number;

  /**
   * Controller
   */
  constructor(app3D: App3D) {
    this._logger = new Logger();

    this._time = app3D._time;

    this._mainCharacter = app3D._world._mainCharacter as MainCharacter;

    this._raycaster = new THREE.Raycaster();

    this._move = new Move();
    this._explore = false;

    this._mainCharacterRotationAngle = 0.05;
    this._mainCharacterTraslationDistance = (this._mainCharacter._speed * this._time._delta) / 80;

    this.checkForGamepad();

    if ('ontouchstart' in document.documentElement) {
      this.initOnscreenController();
    } else {
      this.initKeyboardControl();
    }

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  private initOnscreenController(): void {}

  /**
   * Initialize control parameters
   */
  private initKeyboardControl() {
    document.addEventListener(keydown, (e: Event) => this.keyDown(e as KeyboardEvent));
    document.addEventListener(keyup, (e: Event) => this.keyUp(e as KeyboardEvent));
    document.addEventListener(mousedown, (e: Event) => this.mouseDown(e as MouseEvent));
    document.addEventListener(mouseup, (e: Event) => this.mouseUp(e as MouseEvent));
  }

  private checkForGamepad(): void {}

  private showTouchController(mode: boolean) {
    if (this._touchController == undefined) return;

    this._touchController.joystick1.visible = mode;
    this._touchController.joystick2.visible = mode;
    this._touchController.fireBtn.style.display = mode ? 'block' : 'none';
  }

  /**
   * Set control according to pressed keyboard button
   * @param e keyboard event
   */
  private keyDown(e: KeyboardEvent): void {
    const code: string = e.code;
    this._logger.log(`${this.constructor.name} - key down event detected. Key pressed: ${code}`);

    if (![...forwardKeyboardKeys, ...backwardKeyboardKeys, ...leftKeyboardKeys, ...rightKeyboardKeys].includes(code))
      return;

    if (forwardKeyboardKeys.includes(code)) {
      this._move.forward = true;
    } else if (backwardKeyboardKeys.includes(code)) {
      this._move.backward = true;
    }

    if (rightKeyboardKeys.includes(code)) {
      this._move.right = true;
    } else if (leftKeyboardKeys.includes(code)) {
      this._move.left = true;
    }
  }

  /**
   * Set control according to released keyboard button
   * @param e keyboard event
   */
  private keyUp(e: KeyboardEvent): void {
    const code: string = e.code;
    this._logger.log(`${this.constructor.name} - key up event detected. Key pressed: ${code}`);

    if (![...forwardKeyboardKeys, ...backwardKeyboardKeys, ...leftKeyboardKeys, ...rightKeyboardKeys].includes(code))
      return;

    if (forwardKeyboardKeys.includes(code)) {
      this._move.forward = false;
    } else if (backwardKeyboardKeys.includes(code)) {
      this._move.backward = false;
    }

    if (rightKeyboardKeys.includes(code)) {
      this._move.right = false;
    } else if (leftKeyboardKeys.includes(code)) {
      this._move.left = false;
    }
  }

  mouseDown(e: MouseEvent) {
    this._explore = true;
    // move camera up
    this._logger.log(`${this.constructor.name} - exploring`);
  }

  mouseUp(e: MouseEvent) {
    this._explore = false;
    // move camera down
    this._logger.log(`${this.constructor.name} - moving`);
  }

  gamepadHandler() {}

  /**
   * Update orbit controls
   */
  public update(): void {
    this.updateMainCharacterOrientation();

    if (!this._explore) {
      this.updateMainCharacterPosition();
    }
  }

  /**
   * Update main character orientation
   */
  private updateMainCharacterOrientation() {
    if (this._move.right || this._move.left) {
      let angle: number = this._move.right ? -this._mainCharacterRotationAngle : this._mainCharacterRotationAngle;
      this._mainCharacter._asset.rotateY(angle);
    }
  }

  /**
   * Update main character position
   */
  private updateMainCharacterPosition() {
    if (this._move.forward || this._move.backward) {
      let distance: number = this._move.forward
        ? -this._mainCharacterTraslationDistance
        : this._mainCharacterTraslationDistance;
      this._mainCharacter._asset.translateZ(distance);

      this._mainCharacter.setBoundingBox();
    }
  }
}
