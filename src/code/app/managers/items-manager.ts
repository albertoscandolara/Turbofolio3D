import { Logger } from '../logger';

import { items } from '../../config/items';
import { AssetsManager } from './assets-manager';
import { Asset, AssetCategory } from '../../models/3D/environment/asset';
import { Item } from '../../models/3D/environment/items/item';

let instance!: ItemsManager;

export class ItemsManager {
  declare _logger: Logger;
  declare _assetsManager: AssetsManager;
  declare _items: Array<Item>;
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

    this._items = items;

    this._assetsManager = new AssetsManager();
    this._assets = this._assetsManager.getAssetsWithCategory(AssetCategory.Building);

    this.setAssetIds();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Check if items have unique ids
   * @returns true if ids are unique, false otherwise
   */
  private checkForDuplicateIds(): boolean {
    let parsedItems: Set<number> = new Set();
    const hasDuplicates: boolean = items.some((item) => {
      return parsedItems.size === parsedItems.add(item.id).size;
    });

    if (hasDuplicates) {
      this._logger.error(`${this.constructor.name} - There are items with duplicate ids`);
    }

    return hasDuplicates;
  }

  /**
   * Associate an asset id to items that don't have one
   */
  private setAssetIds(): void {
    this._items
      .filter((item) => item._assetId === -1)
      .forEach((item) => (item._assetId = Math.floor(Math.random() * (this._assets.length + 1))));
  }
}
