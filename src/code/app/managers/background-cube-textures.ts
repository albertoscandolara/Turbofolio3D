import { Logger } from '../logger';

import { backgroundCubeTextures } from '../../config/backgrounds';
import { BackgroundCubeTexture } from '~/models/3D/environment/backgrounds/background';

let instance!: BackgroundCubeTexturesManager;

export class BackgroundCubeTexturesManager {
  declare _logger: Logger;
  declare _backgroundCubeTextures: Array<BackgroundCubeTexture>;

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

    this._backgroundCubeTextures = backgroundCubeTextures;

    if (this.checkForDuplicateIds()) return;

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Checks if background cube texture have unique ids
   * @returns true if ids are unique, false otherwise
   */
  private checkForDuplicateIds(): boolean {
    let parsedBackgroundCubeTexture: Set<number> = new Set();
    const hasDuplicates: boolean = this._backgroundCubeTextures.some((backgroundCubeTexture) => {
      return parsedBackgroundCubeTexture.size === parsedBackgroundCubeTexture.add(backgroundCubeTexture._id).size;
    });

    if (hasDuplicates) {
      this._logger.error(`${this.constructor.name} - There are background cube texture with duplicate ids`);
    }

    return hasDuplicates;
  }

  /**
   * Get background cube texture with a provided id
   * @param id background cube texture id to look for
   * @returns background cube texture with provided id or undefined
   */
  public getBackgroundCubeTextureWithId(id: number): BackgroundCubeTexture {
    if (!this._backgroundCubeTextures.some((backgroundCubeTexture) => backgroundCubeTexture._id === id)) {
      this._logger.error(`${this.constructor.name} - No background cube texture with '${id}' as id`);
    }

    const backgroundCubeTexture: BackgroundCubeTexture = this._backgroundCubeTextures.find(
      (backgroundCubeTexture) => backgroundCubeTexture._id === id
    ) as BackgroundCubeTexture;
    return backgroundCubeTexture;
  }

  /**
   * Load an background cube texture
   * @param id background cube texture to load
   */
  public LoadBackgroundCubeTexture(id: number): void {
    const backgroundCubeTexture: BackgroundCubeTexture = this.getBackgroundCubeTextureWithId(
      id
    ) as BackgroundCubeTexture;
  }
}
