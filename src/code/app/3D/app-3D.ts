import * as THREE from 'three';

import { App } from '../app';
import {
  assetLoadedEventEmitter,
  changeEnvironmentEventEmitter,
  cubeTextureLoadedEventEmitter,
  resizeEventEmitter,
  showInteractionTabEventEmitter,
  tickEventEmitter
} from '../event-emitter/events';
import { Logger } from '../logger';
import { Sizes } from './utils/sizes';
import { Time } from './utils/time';
import { Camera } from './camera';
import { Renderer } from './renderer';
import { World } from './world/world';

import { canvasSelector, canvasHTMLTemplate } from '../../config/app-3D';

import { EnvironmentsManager } from '../managers/environments-manager';
import { AssetsManager } from '../managers/assets-manager';
import { CharactersManager } from '../managers/characters-manager';
import { BuildingsManager } from '../managers/buildings-manager';
import { ItemsManager } from '../managers/items-manager';
import { Debug } from '../debug';
import { GUI } from './dat-gui';
import { Controller } from './controllers/controller';

import { DracoLoader } from './loaders/dracoLoader';
import { CubeTextureLoader } from './loaders/cubeTextureLoader';
import { BackgroundCubeTexturesManager } from '../managers/background-cube-textures';
import { Language } from '../language';
import { Model } from '../../models/3D/environment/model';

export class App3D {
  declare _debug: Debug;
  declare _logger: Logger;
  declare _language: Language;
  declare _gui: GUI;
  declare _container: HTMLElement;

  declare _loader: DracoLoader;
  declare _cubeTextureLoader: CubeTextureLoader;

  declare _camera: Camera;
  declare _canvas: HTMLCanvasElement;
  declare _renderer: Renderer;
  declare _scene: THREE.Scene;
  declare _sizes: Sizes;
  declare _time: Time;
  declare _world: World;
  declare _controller: Controller;

  declare _backgroundCubeTexturesManager: BackgroundCubeTexturesManager;
  declare _environmentsManager: EnvironmentsManager;
  declare _assetsManager: AssetsManager;
  declare _charactersManager: CharactersManager;
  declare _buildingsManager: BuildingsManager;
  declare _itemsManager: ItemsManager;

  /**
   * Constructor
   */
  constructor(app: App) {
    this._debug = app._debug;
    this._logger = app._logger;
    this._language = app._language;
    this._container = app._appContainer;
    this.setCanvas();

    this._loader = new DracoLoader();
    this._cubeTextureLoader = new CubeTextureLoader();

    this._scene = new THREE.Scene();
    this._gui = new GUI(this);
    this._sizes = new Sizes(this);
    this._time = new Time(this);
    this._camera = new Camera(this);
    this._renderer = new Renderer(this);

    this._backgroundCubeTexturesManager = new BackgroundCubeTexturesManager();
    this._environmentsManager = new EnvironmentsManager();
    this._assetsManager = new AssetsManager();
    this._charactersManager = new CharactersManager();
    this._buildingsManager = new BuildingsManager();
    this._itemsManager = new ItemsManager();

    this._world = new World(this);

    this.setEventListeners();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set canvas element
   */
  private setCanvas() {
    this._container.insertAdjacentHTML('beforeend', canvasHTMLTemplate);
    this._canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;
  }

  /**
   * Set event listeners connected to this class
   */
  private setEventListeners(): void {
    resizeEventEmitter.on(() => this.resize());
    tickEventEmitter.on(() => this.update());
    assetLoadedEventEmitter.on((assetId: number) => this.setModel(assetId));
    cubeTextureLoadedEventEmitter.on(() => this.setBackgroundCubeTexture());

    changeEnvironmentEventEmitter.on((environmentId: number) => this.changeEnvironment(environmentId));
    showInteractionTabEventEmitter.on((model: Model) => this.setInteractionTab(model));
  }

  /**
   * Resize
   */
  private resize(): void {
    this._camera?.resize();
    this._renderer?.resize();
  }

  /**
   * Update all elements in the scene
   */
  private update(): void {
    //this._camera.update();
    this._world.update();
    this._renderer?.update();
  }

  /**
   * An asset has been loaded.
   * Set it to all the models with the corresponding assetId
   * @param assetId id of the loaded asset
   */
  private setModel(assetId: number) {
    this._world.setModel(assetId);
  }

  /**
   * A background cube texture has been loaded
   */
  private setBackgroundCubeTexture() {
    this._world.setBackgroundCubeTexture();
  }

  /**
   * Change world environment
   * @param {number} environmentId environment id to set
   */
  public changeEnvironment(environmentId: number): void {
    this._world.changeEnvironment(environmentId);
  }

  /**
   * The user has interacted with a model that has to show a tab. Show it.
   * @param {Model} model model interacting with the main character
   */
  public setInteractionTab(model: Model): void {
    this._world.setInteractionTab(model);
  }
}
