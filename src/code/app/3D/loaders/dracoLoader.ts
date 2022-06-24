import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import { Logger } from '../../../app/logger';
import { Asset, AssetLoadingStatus } from '../../../models/3D/environment/asset';
import { assetLoadedEventEmitter } from '../../../app/event-emitter/events';
import * as THREE from 'three';

let instance!: DracoLoader;

export class DracoLoader {
  declare _logger: Logger;

  declare _dracoDecoderPath: string;
  declare _loader: GLTFLoader;

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

    this._dracoDecoderPath = './src/js/libs/draco/';
    this.setLoader();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set loader
   */
  private setLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(this._dracoDecoderPath);

    this._loader = new GLTFLoader();
    this._loader.setDRACOLoader(dracoLoader);
  }

  /**
   * Load asset
   */
  public loadAsset(asset: Asset): void {
    asset._loadingStatus = AssetLoadingStatus.Loading;
    this._loader.load(asset._url, (gltf) => {
      const object3D: THREE.Object3D = new THREE.Object3D();
      object3D.add(gltf.scene);
      asset._asset = object3D;

      asset._asset.traverse(function (object) {
        object.frustumCulled = false;
        // object.castShadow = true;
        // object.receiveShadow = true;
      });

      asset.setOffsetScale();
      asset.setOffsetRotation();
      asset.setOffsetPosition();

      asset._loadingStatus = AssetLoadingStatus.Loaded;

      // Emit a value to say it's loaded
      assetLoadedEventEmitter.emit(asset._id);
    });
  }
}
