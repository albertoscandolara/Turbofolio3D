import * as THREE from 'three';
import { Logger } from '../../../app/logger';
import { Building } from './buildings/building';
import { Character } from './characters/character';
import { MainCharacter } from './characters/main-character';
import { Item } from './items/item';
import { Light } from '../light';
import { Floor } from './floors/floor';
import { App3D } from '../../../app/3D/app-3D';
import { BackgroundCubeTexture } from './backgrounds/background';
import { BackgroundCubeTexturesManager } from '../../../app/managers/background-cube-textures';
import { InteractLabel } from '../../../app/3D/interact-label/interact-label';
import { Model } from './model';
import { AnimationNames } from '~/models/animations.dto';

export interface IEnvironment {}

export class Environment implements IEnvironment {
  declare _logger: Logger;

  declare _id: number;
  #name: string;
  #description: string;
  #isDefault: boolean;

  declare _mainCharacterStartingPosition: THREE.Vector3;
  declare _mainCharacterStartingRotation: THREE.Euler;

  declare _backgroundCubeTextureId: number;
  declare _backgroundCubeTexturesManager: BackgroundCubeTexturesManager;

  declare _mainCharacter: MainCharacter;
  declare _interactionCheckpoint: Item;
  declare _backgroundCubeTexture: BackgroundCubeTexture;
  declare _floor: Floor;
  declare _characters: Array<Character>;
  declare _buildings: Array<Building>;
  declare _items: Array<Item>;
  declare _lights: Array<Light>;

  // App 3D params
  declare _app3D: App3D;
  declare _scene: THREE.Scene;
  declare _isDebug: boolean;

  declare _interactableModels: Array<Model>;
  // Interact label
  declare _interactLabel: InteractLabel;

  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    isDefault: boolean,
    mainCharacterStartingPosition: THREE.Vector3 = new THREE.Vector3(),
    mainCharacterStartingRotation: THREE.Euler = new THREE.Euler(),

    backgroundCubeTextureId: number,
    //floor: Floor,
    characters: Array<Character>,
    buildings: Array<Building>,
    items: Array<Item>,
    lights: Array<Light>
  ) {
    this._logger = new Logger();

    this._id = id;
    this.#name = name;
    this.#description = description;
    this.#isDefault = isDefault;

    this._mainCharacterStartingPosition = mainCharacterStartingPosition;
    this._mainCharacterStartingRotation = mainCharacterStartingRotation;

    this._backgroundCubeTextureId = backgroundCubeTextureId;
    //this._floor = floor;
    this._characters = characters;
    this._buildings = buildings;
    this._items = items;
    this._lights = lights;

    this._interactableModels = [];

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set app parameters
   * @param app3D app
   */
  public setAppParams(app3D: App3D) {
    this._app3D = app3D;
    this._scene = this._app3D._scene;
    this._isDebug = this._app3D._debug.getActive();

    this._interactLabel = new InteractLabel(this._app3D);

    this._backgroundCubeTexturesManager = this._app3D._backgroundCubeTexturesManager;

    this._backgroundCubeTexture = this._backgroundCubeTexturesManager.getBackgroundCubeTextureWithId(
      this._backgroundCubeTextureId
    );

    this.setLights();
  }

  /**
   * Set background cube texture
   */
  public loadBackgroundCubeTexture(): void {
    this._backgroundCubeTexture = this._backgroundCubeTexturesManager.getBackgroundCubeTextureWithId(
      this._backgroundCubeTexture._id
    );
    this._backgroundCubeTexture.loadCubeTexture();
  }

  /**
   * Set environment assets
   * Load all assets for now.
   * Later could be improved by loading only
   * assets near n meters from main character
   */
  public loadAssets(): void {
    this._floor = new Floor();
    this._scene.add(this._floor._asset);

    [/*this._floor,*/ ...this._characters, ...this._buildings, ...this._items].forEach((model) => {
      model.setAppParams(this._app3D);
      model.loadAsset();
    });
  }

  /**
   * Set main character into the newly created environment
   * @param mainCharacter world main character
   */
  public setMainCharacter(mainCharacter: MainCharacter): void {
    this._mainCharacter = mainCharacter;
    this._mainCharacter.setInitialPosition(this._mainCharacterStartingPosition);
    this._mainCharacter.setRotation(this._mainCharacterStartingRotation);
  }

  /**
   * Retrieve #name parameter
   * @returns #name parameter
   */
  public getName(): string {
    return this.#name;
  }

  /**
   * Retrieve #isDefault parameter
   * @returns #isDefault parameter
   */
  public getIsDefault(): boolean {
    return this.#isDefault;
  }

  /**
   * An asset has been loaded.
   * Set it to all the models with the corresponding assetId
   * @param assetId id of the loaded asset
   */
  public setModel(assetId: number): void {
    [...this._characters, ...this._buildings, ...this._items]
      .filter((model) => !model._asset && model._assetId === assetId)
      .forEach((model) => {
        model.setAsset(assetId);

        // Set checkpoint for interactable models
        if (model._isInteractable) {
          this._interactableModels.push(model);

          (model._checkpoint as Item).setAppParams(this._app3D);
          const checkpointAssetId: number = this._app3D._itemsManager.getInteractionCheckpointItem()._assetId;
          model.setCheckpoint(checkpointAssetId);
        }
      });
  }

  /**
   * Set lights
   */
  public setLights(): void {
    this._lights.forEach((light) => {
      light._light.position.set(light._position.x, light._position.y, light._position.z);

      this._scene.add(light._light);

      //Set up shadow properties for the light
      if (light._light instanceof THREE.DirectionalLight) {
        //light._light.castShadow = true;
        // light._light.shadow.mapSize.width = 2024; // default
        // light._light.shadow.mapSize.height = 2024; // default
        // light._light.shadow.camera.near = 2; // default
        // light._light.shadow.camera.far = 1000; // default
        // const helper = new THREE.CameraHelper(light._light.shadow.camera);
        // this._scene.add(helper);
      }
    });
  }

  /**
   * Set background cube texture
   */
  public setBackgroundCubeTexture(): void {
    this._scene.background = this._backgroundCubeTexture._cubeTexture;
  }

  /**
   * Update all elements in the scene
   */
  public update(): void {
    [...this._characters, ...this._buildings, ...this._items].forEach((model) => model.update());

    if (!this._mainCharacter) return;

    const interactingModels: Array<Model> = this._interactableModels.filter((model) => {
      return (model._checkpoint as Item)._boundingBox?.intersectsBox(this._mainCharacter._boundingBox);
    });

    if (interactingModels.length === 1) {
      const model: Model = interactingModels[0] as Model;
      model.checkpointColliding = true;
      !this._interactLabel.isVisible() && this._interactLabel.show(model);
    } else {
      this._interactableModels.forEach((model) => {
        model.checkpointColliding = false;
        this._interactLabel.isVisible() && this._interactLabel.hide();
      });
    }
  }

  public disposeEnvironment(): void {
    [...this._characters, ...this._buildings, ...this._items].forEach((model) => model.disposeAsset());
  }
}
