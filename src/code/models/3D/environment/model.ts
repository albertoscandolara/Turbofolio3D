import * as THREE from 'three';
import { DracoLoader } from '../../../app/3D/loaders/dracoLoader';
import { Logger } from '../../../app/logger';
import { AssetsManager } from '../../../app/managers/assets-manager';
import { Asset } from './asset';
import { centimeter, meter } from './../../../app/3D/utils/units';
import { App3D } from '../../../app/3D/app-3D';
import { Camera } from '../../../app/3D/camera';
import { yAxis, zAxis } from '../../../config/axes';
import { Item } from './items/item';

const length = require('convert-units');
const SkeletonUtils = require('three/examples/jsm/utils/SkeletonUtils');

export class Model {
  declare _logger: Logger;

  declare _id: number;
  declare _name: string;
  declare _description: string;
  declare _height: number;
  declare _boundingBox: THREE.Box3;
  declare _assetId: number;
  declare _asset: THREE.Group;
  declare _initialPosition: THREE.Vector3;
  declare _initialYAngleRotation: number;
  declare _isInteractable: boolean;
  declare _checkpoint: Item | null;

  declare _assetsManager: AssetsManager;

  declare _loader: DracoLoader;

  // App 3D params
  declare _scene: THREE.Scene;
  declare _camera: Camera;
  declare _isDebug: boolean;

  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    height: number,
    assetId: number = -1,
    isInteractable: boolean,
    checkpoint: Item | null,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    initialYAngleRotation: number = 0
  ) {
    this._logger = new Logger();

    this._id = id;
    this._name = name;
    this._description = description;
    this._height = height;
    this._assetId = assetId;
    this._isInteractable = isInteractable;
    this._checkpoint = this._isInteractable ? checkpoint : null;
    this._initialPosition = initialPosition;
    this._initialYAngleRotation = initialYAngleRotation;
    this._camera;

    this._assetsManager = new AssetsManager();
    this._loader = new DracoLoader();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set app parameters
   * @param app3D app
   */
  public setAppParams(app3D: App3D) {
    this._scene = app3D._scene;
    this._isDebug = app3D._debug.getActive();

    if (this._name === 'Main character') {
      this._camera = app3D._camera;
    }
  }

  /**
   * Set asset
   * @param asset id of the asset to set
   */
  public setAsset(assetId: number): void {
    const asset: THREE.Group = this._assetsManager.getAssetWithId(assetId)._asset;
    this._asset = SkeletonUtils.clone(asset) as THREE.Group;

    this._logger.log(`${this.constructor.name} - Asset with id '${this._assetId}' cloned`, this);

    this.setScale();
    this.setInitialPosition(this._initialPosition);
    this.setInitialYRotation(this._initialYAngleRotation);
    this.setBoundingBox();

    this.setDebugHelperTools();

    if (this._camera) {
      this._camera._instance.position.copy(this._asset.position);
      this._camera._instance.translateOnAxis(yAxis, 8);
      this._camera._instance.translateOnAxis(zAxis, 20);
      this._asset.add(this._camera._instance);
    }

    this._scene.add(this._asset);
  }

  /**
   * Scale model
   */
  private setScale() {
    const originalBoundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this._asset);

    const originalMaxModelHeight: number = originalBoundingBox.max.y - originalBoundingBox.min.y;

    if (this._height === 0) {
      this._logger.warn(
        `${this.constructor.name} - Model '${this._id}' has height set to ${this._height}. Preserving scale`
      );

      this._height == originalMaxModelHeight;
    }

    const scaleFactor: number = length(this._height).from(centimeter).to(meter) / originalMaxModelHeight;

    if (isNaN(scaleFactor) || !isFinite(scaleFactor)) {
      this._logger.error(`${this.constructor.name} - Invalid scale on model '${this._id}'`);
      return;
    }

    this._asset.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Log new height
    const newBoundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this._asset);
    const newMaxModelHeight: number = newBoundingBox.max.y - newBoundingBox.min.y;
    this._logger.log(
      `${this.constructor.name} - Model named '${this._name}' with id '${this._id}' scaled by ${scaleFactor}. Height went from ${originalMaxModelHeight} to ${newMaxModelHeight} units.`
    );
  }

  /**
   * Set initial position
   */
  public setInitialPosition(initialPosition: THREE.Vector3 = new THREE.Vector3()): void {
    this._asset.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
  }

  /**
   * Set initial y rotation
   */
  public setInitialYRotation(angle: number = 0): void {
    this._asset.rotateY(angle);
  }

  /**
   * Set bounding box
   */
  public setBoundingBox(): void {
    const newBoundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this._asset);
    this._boundingBox = newBoundingBox;
  }

  /**
   * Set helper tools to show in debug mode
   */
  private setDebugHelperTools(): void {
    if (!this._isDebug) return;

    this.setModelAxesHelper();
    this.setBoundingBoxHelper();
  }

  /**
   * Set bounding axes helper
   */
  private setModelAxesHelper(): void {
    const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(this._asset);
    const height: number = boundingBox.max.y - boundingBox.min.y;
    const axesHelper = new THREE.AxesHelper(height);
    this._asset.add(axesHelper);
  }

  /**
   * Set bounding box debug helper
   */
  private setBoundingBoxHelper(): void {
    const box = new THREE.BoxHelper(this._asset, 0xffff00);
    this._asset.attach(box);
  }

  /**
   * id property getter
   */
  get id(): number {
    return this._id;
  }

  /**
   * Load asset
   */
  public loadAsset(): void {
    if (this._assetId === -1) {
      this._logger.error(`${this.constructor.name} - Can't load asset with id set to -1`, this);
      return;
    }

    const asset: Asset = this._assetsManager.getAssetWithId(this._assetId);
    this._loader.loadAsset(asset);
  }
}
