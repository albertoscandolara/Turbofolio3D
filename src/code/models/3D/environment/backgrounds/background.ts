import { CubeTextureLoader } from '../../../../app/3D/loaders/cubeTextureLoader';
import { Logger } from '../../../../app/logger';

export class BackgroundCubeTexture {
  declare _logger: Logger;

  declare _id: number;
  declare _name: string;
  declare _description: string;
  declare _basePath: string;
  declare _urls: Array<string>;
  declare _loader: CubeTextureLoader;

  declare _cubeTexture: THREE.CubeTexture;

  /**
   * Constructor
   */
  constructor(id: number, name: string, description: string, basePath: string, urls: Array<string>) {
    this._logger = new Logger();

    this._id = id;
    this._name = name;
    this._description = description;
    this._basePath = basePath;
    this._urls = urls;
    this._loader = new CubeTextureLoader();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Load cube texture
   */
  public loadCubeTexture(): void {
    if (this._id === -1) {
      this._logger.error(`${this.constructor.name} - Can't load background with id set to -1`, this);
      return;
    }

    this._loader.loadCubeTexture(this);
  }
}
