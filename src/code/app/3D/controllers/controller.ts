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
  rightKeyboardKeys,
  runKeyboardKeys
} from '../../../config/controller';
import { AnimationNames } from '../../../models/animations.dto';

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

  declare _explore: boolean;
  declare _move: Move;
  declare _isRunning: boolean;
  declare _runCoefficient: number;

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

    this._explore = false;
    this._move = new Move();
    this._isRunning = false;
    this._runCoefficient = 2;

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

    if (
      ![
        ...forwardKeyboardKeys,
        ...backwardKeyboardKeys,
        ...leftKeyboardKeys,
        ...rightKeyboardKeys,
        ...runKeyboardKeys
      ].includes(code)
    ) {
      return;
    }

    if (runKeyboardKeys.includes(code)) {
      this._isRunning = true;
    }

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

    if (
      ![
        ...forwardKeyboardKeys,
        ...backwardKeyboardKeys,
        ...leftKeyboardKeys,
        ...rightKeyboardKeys,
        ...runKeyboardKeys
      ].includes(code)
    ) {
      return;
    }

    if (runKeyboardKeys.includes(code)) {
      this._isRunning = false;
    }

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

  mouseDown(e: MouseEvent): void {
    this._explore = true;
    // move camera up
    this._logger.log(`${this.constructor.name} - exploring`);
  }

  mouseUp(e: MouseEvent): void {
    this._explore = false;
    // move camera down
    this._logger.log(`${this.constructor.name} - moving`);
  }

  gamepadHandler() {}

  /**
   * Update orbit controls
   */
  public update(): void {
    if (this._mainCharacter._currentAnimationName$.value === AnimationNames.talk) {
      return;
    }

    this.updateMainCharacterOrientation();

    if (!this._explore) {
      this.updateMainCharacterPosition();
    }

    this.updateMainCharacterStatus();
  }

  /**
   * Update main character orientation
   */
  private updateMainCharacterOrientation(): void {
    if (this._move.right || this._move.left) {
      let angle: number = this._move.right ? -this._mainCharacterRotationAngle : this._mainCharacterRotationAngle;
      this._mainCharacter._asset.rotateY(angle);
    }
  }

  /**
   * Update main character position
   */
  private updateMainCharacterPosition(): void {
    let distance: number = 0;
    if (this._move.forward) {
      if (this._isRunning) {
        distance = -this._mainCharacterTraslationDistance * this._runCoefficient;
      } else {
        distance = -this._mainCharacterTraslationDistance;
      }
    } else if (this._move.backward) {
      distance = this._mainCharacterTraslationDistance;
    }

    this._mainCharacter._asset.translateZ(distance);

    this._mainCharacter.setBoundingBox();
  }

  /**
   * Update main character status
   */
  private updateMainCharacterStatus(): void {
    if (this._move.forward) {
      if (this._isRunning) {
        this._mainCharacter.setCurrentAnimationName(AnimationNames.run);
      } else {
        this._mainCharacter.setCurrentAnimationName(AnimationNames.walkForward);
      }
    } else if (this._move.backward) {
      this._mainCharacter.setCurrentAnimationName(AnimationNames.walkBackward);
    } else if (!this._move.forward || !this._move.backward) {
      this._mainCharacter.setCurrentAnimationName(AnimationNames.idle);
    }
  }
}
