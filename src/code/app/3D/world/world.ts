import * as THREE from 'three';

import { EnvironmentsUtils } from './utils/environments';

import { App3D } from '../app-3D';
import { Logger } from '../../logger';
import { Sizes } from '../utils/sizes';
import { Camera } from '../camera';

import { BackgroundCubeTexturesManager } from '~/app/managers/background-cube-textures';
import { EnvironmentsManager } from '../../../app/managers/environments-manager';
import { AssetsManager } from '../../../app/managers/assets-manager';
import { CharactersManager } from '../../../app/managers/characters-manager';
import { BuildingsManager } from '../../../app/managers/buildings-manager';
import { ItemsManager } from '../../../app/managers/items-manager';

import { DracoLoader } from '../loaders/dracoLoader';
import { Environment } from '../../../models/3D/environment/environment';
import { Model } from '../../../models/3D/environment/model';
import { MainCharacter } from '../../../models/3D/environment/characters/main-character';
import { Character } from '../../../models/3D/environment/characters/character';
import { Item } from '../../../models/3D/environment/items/item';

import { Controller } from '../controllers/controller';
import { AnimationNames } from '../../../models/animations.dto';
import { NumberKeyframeTrack } from 'three';

export class World {
  declare _app3D: App3D;
  declare _logger: Logger;

  declare _backgroundCubeTexturesManager: BackgroundCubeTexturesManager;
  declare _environmentsManager: EnvironmentsManager;
  declare _assetsManager: AssetsManager;
  declare _charactersManager: CharactersManager;
  declare _buildingsManager: BuildingsManager;
  declare _itemsManager: ItemsManager;

  declare _environmentsUtils: EnvironmentsUtils;

  declare _canvas: HTMLCanvasElement;
  declare _instance: THREE.WebGLRenderer;
  declare _sizes: Sizes;
  declare _scene: THREE.Scene;
  declare _camera: Camera;

  declare _loader: DracoLoader;

  declare _worldQuaternion: THREE.Quaternion;
  declare _controller: Controller;
  declare _mainCharacter: Character;
  declare _interactionCheckpoint: Item;
  declare _environment: Environment;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    this._app3D = app3D;
    this._logger = this._app3D._logger;

    // Resources managers
    this._backgroundCubeTexturesManager = this._app3D._backgroundCubeTexturesManager;
    this._environmentsManager = this._app3D._environmentsManager;
    this._assetsManager = this._app3D._assetsManager;
    this._buildingsManager = this._app3D._buildingsManager;
    this._charactersManager = this._app3D._charactersManager;
    this._itemsManager = this._app3D._itemsManager;

    // 3D app players
    this._canvas = this._app3D._canvas;
    this._scene = this._app3D._scene;

    this._loader = this._app3D._loader;

    this._worldQuaternion = new THREE.Quaternion();

    {
      // Set interaction checkpoint
      this._interactionCheckpoint = this._itemsManager.getInteractionCheckpointItem();
      this._interactionCheckpoint.setAppParams(this._app3D);
      this._interactionCheckpoint.loadAsset();
    }

    {
      // Set main character
      const {
        _id,
        _name,
        _description,
        _height,
        _assetId,
        _speed,
        _canMove,
        _initialPosition,
        _initialSteer
      }: any = this._charactersManager.getMainCharacter();

      this._mainCharacter = new MainCharacter(
        _id,
        _name,
        _description,
        _height,
        _assetId,
        false,
        null,
        null,
        null,
        _speed,
        _canMove,
        _initialPosition,
        _initialSteer
      );
      this._mainCharacter.setAppParams(this._app3D);

      this._mainCharacter.loadAsset();
    }

    {
      // Set initial environment
      const environment = this._environmentsManager.getDefaultEnvironment();
      this.changeEnvironment(environment._id);
    }

    if (app3D._debug.getActive()) {
      this.setDebugHelpers();
    }

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * An asset has been loaded.
   * Set it to all the models with the corresponding assetId
   * @param assetId id of the loaded asset
   */
  public setModel(assetId: number) {
    if (!this._mainCharacter._asset && this._mainCharacter._assetId === assetId) {
      this._mainCharacter.setAsset(assetId);

      this._controller = new Controller(this._app3D);
      (this._mainCharacter as MainCharacter).setController(this._controller);

      this._environment.setMainCharacter(this._mainCharacter as MainCharacter);
    } else if (!this._interactionCheckpoint._asset && this._interactionCheckpoint._assetId === assetId) {
      this._interactionCheckpoint.setAsset(assetId);
      this._scene.remove(this._interactionCheckpoint._asset);
    }

    this._environment.setModel(assetId);
  }

  /**
   * A background cube texture has been loaded
   */
  public setBackgroundCubeTexture() {
    this._environment.setBackgroundCubeTexture();
  }

  /**
   * Set additional helpers if in debug
   */
  private setDebugHelpers(): void {
    const axesHelper = new THREE.AxesHelper(1.8);
    const red: THREE.Color = new THREE.Color('#ff0000');
    const green: THREE.Color = new THREE.Color('#00ff00');
    const blue: THREE.Color = new THREE.Color('#0000ff');
    axesHelper.setColors(red, blue, green);
    this._scene.add(axesHelper);
  }

  /**
   * Update all elements in the scene
   */
  public update(): void {
    if (this._mainCharacter) {
      (this._mainCharacter as MainCharacter)._controller?.update();
      (this._mainCharacter as MainCharacter).update();
    }

    this._environment.update();
  }

  /**
   * Change environment
   */
  public changeEnvironment(id: number): void {
    if (this._environment) {
      if (this._environment?._id === id) {
        this._logger.warn(
          `${this.constructor.name} - current environment has same id of the requested environment. Do not switch.`
        );

        return;
      }

      this._environment.disposeEnvironment();
    }

    this._environment = this._environmentsManager.getEnvironmentWithId(id);
    this._environment.setAppParams(this._app3D);

    if (this._mainCharacter._asset) {
      this._environment.setMainCharacter(this._mainCharacter as MainCharacter);
    }

    this._environment.loadBackgroundCubeTexture();
    this._environment.loadAssets();
  }

  /**
   * The user has interacted with a model that has to show a tab. Show it.
   * @param {Model} model model interacting with the main character
   */
  public setInteractionTab(model: Model): void {
    // Set talk animation both on main character and on interacting character.
    // Set different timeouts for a bit of delay one from the other
    model.setCurrentAnimationName(AnimationNames.talk);
    const timeout: number = Math.random();
    window.setTimeout(() => {
      this._mainCharacter.setCurrentAnimationName(AnimationNames.talk);
    }, timeout);

    const interactionTabId: number = model._goToHTML as number;
  }
}
