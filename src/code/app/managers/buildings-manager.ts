import { Logger } from '../logger';

import { buildings } from '../../config/buildings';
import { AssetsManager } from './assets-manager';
import { Building } from '../../models/3D/environment/buildings/building';
import { Asset, AssetCategory } from '../../models/3D/environment/asset';

let instance!: BuildingsManager;

export class BuildingsManager {
  declare _logger: Logger;
  declare _assetsManager: AssetsManager;
  declare _buildings: Array<Building>;
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

    this._buildings = buildings;

    this._assetsManager = new AssetsManager();
    this._assets = this._assetsManager.getAssetsWithCategory(AssetCategory.Building);

    this.setAssetIds();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Check if building have unique ids
   * @returns true if ids are unique, false otherwise
   */
  private checkForDuplicateIds(): boolean {
    let parsedBuildings: Set<number> = new Set();
    const hasDuplicates: boolean = buildings.some((building) => {
      return parsedBuildings.size === parsedBuildings.add(building.id).size;
    });

    if (hasDuplicates) {
      this._logger.error(`${this.constructor.name} - There are building with duplicate ids`);
    }

    return hasDuplicates;
  }

  /**
   * Associate an asset id to buildings that don't have one
   */
  private setAssetIds(): void {
    this._buildings
      .filter((building) => building._assetId === -1)
      .forEach((building) => (building._assetId = Math.floor(Math.random() * (this._assets.length + 1))));
  }

  /**
   * Check if there are configured buildings
   */
  private checkForNoBuildings(): void {
    if (!this._buildings.length) {
      this._logger.error(`No buildings configurations found.`);
    }
  }

  /**
   * Get a random buildings configuration
   * @returns random buildings configuration
   */
  public getRandomBuilding(): Building {
    this.checkForNoBuildings();

    const min: number = Math.ceil(0);
    const max: number = Math.floor(this._buildings.length) - 1;
    const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;

    return this._buildings[randomNumber];
  }

  /**
   * Get the building with given id
   * @param id id of the building to find
   * @returns building with id configuration
   */
  public getBuildingWithId(id: number): Building {
    this.checkForNoBuildings();

    let building!: Building;

    const buildings: Array<Building> = this._buildings.filter((building) => building.id === id);

    if (buildings.length === 0) {
      this._logger.error(`No buildings with id '${id}' found.`);
    } else {
      if (buildings.length > 1) {
        this._logger.warn(`More buildings with id '${id}' found. Got the first one.`);
      }
      building = buildings[0];
    }

    return building;
  }

  public loadCBuilding(building: Building) {
    const c = building;
  }
}
