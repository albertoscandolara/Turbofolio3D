import { DracoLoader } from '../../../app/3D/loaders/dracoLoader';
import { Logger } from '../../../app/logger';

export enum AssetCategory {
  Character = 'CHARACTER',
  Building = 'BUILDING',
  Floor = 'FLOOR',
  Item = 'ITEM'
}

export enum AssetLoadingStatus {
  Unloaded = 'UNLOADED',
  Loading = 'LOADING',
  Loaded = 'LOADED'
}

export enum AssetType {
  GLTF = 'GLTF',
  DRACO = 'DRACO'
}

export class Asset {
  declare _logger: Logger;

  declare _loader: DracoLoader;

  declare _id: number;
  #name: string;
  #description: string;
  declare _url: string;
  #type: string;
  declare _category: AssetCategory;
  declare _asset: THREE.Group;
  declare _loadingStatus: AssetLoadingStatus;

  /**
   * Constructor
   */
  constructor(id: number, name: string, description: string, path: string, type: AssetType, category: AssetCategory) {
    this._logger = new Logger();

    this._id = id;
    this.#name = name;
    this.#description = description;
    this.#type = type;
    this._url = path;
    this._category = category;
    this._loadingStatus = AssetLoadingStatus.Unloaded;
  }

  /**
   * Load asset
   */
  public loadAsset(): void {
    if (this._loadingStatus === AssetLoadingStatus.Loading) {
      this._logger.warn(`${this.constructor.name} - Asset already loading.No need to reload.`, this);
      return;
    }

    if (this._loadingStatus === AssetLoadingStatus.Loaded) {
      this._logger.warn(`${this.constructor.name} - Asset already loaded. No need to reload.`, this);
      return;
    }

    this._logger.log(`${this.constructor.name} - Loading asset`, this);

    this._loader.loadAsset(this);
  }
}
