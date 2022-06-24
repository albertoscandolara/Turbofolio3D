import { Logger } from '../logger';

import { assets } from '../../config/assets';
import { Asset, AssetCategory } from '../../models/3D/environment/asset';

let instance!: AssetsManager;

export class AssetsManager {
  declare _logger: Logger;
  declare _assets: Array<Asset>;

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

    if (this.checkForDuplicateIds()) return;

    this._assets = assets;

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Checks if assets have unique ids
   * @returns true if ids are unique, false otherwise
   */
  private checkForDuplicateIds(): boolean {
    let parsedAssets: Set<number> = new Set();
    const hasDuplicates: boolean = assets.some((asset) => {
      return parsedAssets.size === parsedAssets.add(asset._id).size;
    });

    if (hasDuplicates) {
      this._logger.error(`${this.constructor.name} - There are assets with duplicate ids`);
    }

    return hasDuplicates;
  }

  /**
   * Get asset with a provided id
   * @param id asset id to look for
   * @returns asset with provided id or undefined
   */
  public getAssetWithId(id: number): Asset {
    if (!this._assets.some((asset) => asset._id === id)) {
      this._logger.error(`${this.constructor.name} - No asset with '${id}' as id`);
    }

    const asset: Asset = this._assets.find((asset) => asset._id === id) as Asset;
    return asset;
  }

  /**
   * Get asset with a provided category
   * @param category asset category to look for
   * @returns Array of assets with provided category
   */
  public getAssetsWithCategory(category: AssetCategory): Array<Asset> {
    const assets: Array<Asset> = this._assets.filter((asset) => asset._category === category);
    return assets;
  }
}
