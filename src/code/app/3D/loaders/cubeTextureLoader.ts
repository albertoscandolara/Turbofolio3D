import * as THREE from 'three';

import { Logger } from '../../../app/logger';
import { BackgroundCubeTexture } from '../../../models/3D/environment/backgrounds/background';
import { cubeTextureLoadedEventEmitter } from '../../../app/event-emitter/events';

let instance!: CubeTextureLoader;

export class CubeTextureLoader {
  declare _logger: Logger;

  declare _loader: THREE.CubeTextureLoader;

  /**
   * Constructor
   */
  constructor() {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this._logger = new Logger();

    this.setLoader();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set loader
   */
  private setLoader() {
    this._loader = new THREE.CubeTextureLoader();
  }

  /**
   * Load background textures
   */
  public loadCubeTexture(background: BackgroundCubeTexture): void {
    this._loader.setPath(background._basePath).load(background._urls, (texture) => {
      background._cubeTexture = texture;

      // Emit a value to say it's loaded
      cubeTextureLoadedEventEmitter.emit(background._id);
    });
  }
}
