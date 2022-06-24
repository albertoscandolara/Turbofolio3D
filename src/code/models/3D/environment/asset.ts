import * as THREE from 'three';
import { centimeter, meter } from '../../../app/3D/utils/units';
import { DracoLoader } from '../../../app/3D/loaders/dracoLoader';
import { Logger } from '../../../app/logger';

const length = require('convert-units');

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
  declare _defaultHeight: number;
  #description: string;
  declare _offsetPosition: THREE.Vector3;
  declare _offsetRotation: any;
  declare _url: string;
  #type: string;
  declare _category: AssetCategory;
  declare _asset: THREE.Object3D;
  declare _loadingStatus: AssetLoadingStatus;

  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    defaultHeight: number,
    description: string,
    offsetTransform: THREE.Vector3,
    offsetRotation: THREE.Euler,
    path: string,
    type: AssetType,
    category: AssetCategory
  ) {
    this._logger = new Logger();

    this._id = id;
    this.#name = name;
    this._defaultHeight = defaultHeight;
    this.#description = description;
    this._offsetPosition = offsetTransform;
    this._offsetRotation = offsetRotation;
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

  /**
   * Set asset offset scale
   */
  public setOffsetScale() {
    const originalBoundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this._asset);

    const originalMaxModelHeight: number = originalBoundingBox.max.y - originalBoundingBox.min.y;

    if (this._defaultHeight === 0) {
      this._logger.warn(
        `${this.constructor.name} - Model '${this._id}' has default height set to ${this._defaultHeight}. Preserving scale`
      );

      this._defaultHeight == originalMaxModelHeight;
    }

    const scaleFactor: number = length(this._defaultHeight).from(centimeter).to(meter) / originalMaxModelHeight;

    if (isNaN(scaleFactor) || !isFinite(scaleFactor)) {
      this._logger.error(`${this.constructor.name} - Invalid scale on model '${this._id}'`);
      return;
    }

    this._asset.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Log new height
    const newBoundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this._asset);
    const newMaxModelHeight: number = newBoundingBox.max.y - newBoundingBox.min.y;
    this._logger.log(
      `${this.constructor.name} - Asset named '${this.#name}' with id '${
        this._id
      }' scaled by ${scaleFactor}. Height went from ${originalMaxModelHeight} to ${newMaxModelHeight} units.`
    );
  }

  /**
   * Set  asset offset position
   */
  public setOffsetPosition(): void {
    this._asset.position.copy(this._offsetPosition);

    // Add 0.1 on y axis to avoid z-conflict
    this._asset.position.add(new THREE.Vector3(0, 0.1, 0));

    this._logger.log(
      `${this.constructor.name} - Asset named '${this.#name}' with id '${this._id}' moved to offset position.`,
      this._asset.rotation
    );
  }

  /**
   * Set asset offset rotation
   */
  public setOffsetRotation(): void {
    this._asset.children[0].rotation.copy(this._offsetRotation);

    this._logger.log(
      `${this.constructor.name} - Asset named '${this.#name}' with id '${this._id}' rotated as offset rotation.`,
      this._asset.rotation
    );
  }
}
