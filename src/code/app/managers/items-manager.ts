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
    this._assets = this._assetsManager.getAssetsWithCategory(AssetCategory.Item);

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
   * Check if there are configured items
   */
  private checkForNoItems(): void {
    if (!this._items.length) {
      this._logger.error(`No items configurations found.`);
    }
  }

  /**
   * Associate an asset id to items that don't have one
   */
  private setAssetIds(): void {
    this._items
      .filter((item) => item._assetId === -1)
      .forEach((item) => (item._assetId = Math.floor(Math.random() * (this._assets.length + 1))));
  }

  /**
   * Get the item with given id
   * @param id id of the item to find
   * @returns item with id configuration
   */
  public getItemWithId(id: number): Item {
    this.checkForNoItems();

    let item!: Item;

    const items: Array<Item> = this._items.filter((item) => item.id === id);

    if (items.length === 0) {
      this._logger.error(`No items with id '${id}' found.`);
    } else {
      if (items.length > 1) {
        this._logger.warn(`More items with id '${id}' found. Got the first one.`);
      }
      item = items[0];
    }

    return item;
  }

  /**
   * Get interaction checkpoint item
   * @returns interaction checkpoint item
   */
  public getInteractionCheckpointItem(): Item {
    const interactionCheckpointId: number = 0;
    return this.getItemWithId(interactionCheckpointId);
  }
}
