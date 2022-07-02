import * as THREE from 'three';
import { AxesHelper, BoxHelper, Mesh } from 'three';
import { Logger } from '../../../app/logger';
import { DracoLoader } from '../../../app/3D/loaders/dracoLoader';
import { AssetsManager } from '../../../app/managers/assets-manager';
import { Asset } from './asset';
import { App3D } from '../../../app/3D/app-3D';
import { Camera } from '../../../app/3D/camera';
import { xAxis, yAxis, zAxis } from '../../../config/axes';
import { Item } from './items/item';
import { Time } from '../../../app/3D/utils/time';
import { AnimationActions, AnimationClips, AnimationNames } from '../../../models/animations.dto';
import { BehaviorSubject, map } from 'rxjs';

const SkeletonUtils = require('three/examples/jsm/utils/SkeletonUtils');

export class Model {
  declare _logger: Logger;

  declare _animationMixer: THREE.AnimationMixer;
  declare _animationActions: AnimationActions;
  declare _animationCurrentStatus$: BehaviorSubject<AnimationNames>;

  declare _assetsManager: AssetsManager;
  declare _loader: DracoLoader;

  declare _id: number;
  declare _name: string;
  declare _description: string;
  declare _scale: number;
  declare _height: number;
  declare _boundingBox: THREE.Box3;
  declare _assetId: number;
  declare _asset: THREE.Object3D;
  declare _initialPosition: THREE.Vector3;
  declare _rotation: THREE.Euler;

  // Interaction parameters
  declare _isInteractable: boolean;
  declare _checkpoint: Item | null;
  declare _checkpointColliding: boolean;
  declare _goToEnvironment: number | null;
  declare _goToHTML: number | null;

  // App 3D params
  declare _scene: THREE.Scene;
  declare _time: Time;
  declare _camera: Camera;
  declare _isDebug: boolean;

  // Helpers
  declare _boxHelper: THREE.BoxHelper;

  /**
   * Constructor
   */
  constructor(
    id: number,
    name: string,
    description: string,
    scale: number,
    assetId: number = -1,
    isInteractable: boolean,
    checkpoint: Item | null,
    goToEnvironment: number | null,
    goToHTML: number | null,
    initialPosition: THREE.Vector3 = new THREE.Vector3(),
    rotation: THREE.Euler = new THREE.Euler(0, 0, 0)
  ) {
    this._logger = new Logger();

    // Animation parameters
    this._animationActions = {
      idle: null,
      run: null,
      walkForward: null,
      walkBackward: null
    };

    this._animationCurrentStatus$ = new BehaviorSubject<AnimationNames>(AnimationNames.walkForward);
    this._animationCurrentStatus$.pipe(map(() => this.playAnimation)).subscribe();

    this._assetsManager = new AssetsManager();
    this._loader = new DracoLoader();

    this._checkpointColliding = false;

    this._id = id;
    this._name = name;
    this._description = description;
    this._scale = scale <= 1 ? 1 : scale;
    this._assetId = assetId;
    this._initialPosition = initialPosition;
    this._rotation = rotation;

    this._isInteractable = isInteractable;
    if (this._isInteractable) {
      this._checkpoint = checkpoint ?? null;
      this._goToEnvironment = goToEnvironment ?? null;
      this._goToHTML = goToHTML ?? null;

      if (!this._checkpoint) {
        this._logger.warn(`${this.constructor.name} model is interactable, but 'checkpoint' was not provided`, this);
      }

      if (!this._goToEnvironment && !this._goToHTML) {
        this._logger.warn(
          `${this.constructor.name} model is interactable, but neither 'goToEnvironment' nor 'goToHTML' parameter were set`,
          this
        );
      }
    } else {
      if (checkpoint) {
        this._logger.warn(
          `${this.constructor.name} 'checkpoint' parameter was set, but model is not interactable`,
          this
        );
      }

      if (goToEnvironment) {
        this._logger.warn(
          `${this.constructor.name} 'goToEnvironment' parameter was set, but model is not interactable`,
          this
        );
      }

      if (goToHTML) {
        this._logger.warn(`${this.constructor.name} 'goToHTML' parameter was set, but model is not interactable`, this);
      }
    }

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * id property getter
   */
  get id(): number {
    return this._id;
  }

  /**
   * _checkpointColliding property setter.
   * Toggle model bounding box color
   */
  set checkpointColliding(value: boolean) {
    if (this._checkpointColliding === value) return;

    this._checkpointColliding = value;
    this.setBoxHelperColor();

    if (!this._checkpoint) return;

    (this._checkpoint as Item).checkpointColliding = value;
    (this._checkpoint as Item).setBoxHelperColor();
  }

  /**
   * Set app parameters
   * @param app3D app
   */
  public setAppParams(app3D: App3D) {
    this._scene = app3D._scene;
    this._isDebug = app3D._debug.getActive();
    this._time = app3D._time;

    if (this._name === 'Main character') {
      this._camera = app3D._camera;
    }
  }

  /**
   * Set asset
   * @param asset id of the asset to set
   */
  public setAsset(assetId: number): void {
    const assetObj: Asset = this._assetsManager.getAssetWithId(assetId);
    this._asset = SkeletonUtils.clone(assetObj._asset) as THREE.Object3D;

    this._logger.log(`${this.constructor.name} - Asset with id '${this._assetId}' cloned`, this);

    // Set model physical properties
    this.setScale();
    this.setInitialPosition(this._initialPosition);
    this.setRotation(this._rotation);

    // Set animation tools
    this.setAnimationMixer(this._asset);
    this.setAnimationActions(assetObj._animations);
    this._animationCurrentStatus$.next(AnimationNames.idle);

    this.setBoundingBox();
    this.setDebugHelperTools();

    if (this._camera) {
      this._camera.setCameraPosition(this);
      this._asset.add(this._camera._instance);
    }

    this._scene.add(this._asset);
  }

  /**
   * Scale model
   */
  private setScale() {
    if (this._scale === 1) {
      this._logger.log(
        `${this.constructor.name} - Model '${this._id}' has scale set to ${this._scale}. Preserve asset height.`
      );
    } else {
      //this._asset.scale.set(this._scale, this._scale, this._scale);
    }
  }

  /**
   * Set initial position
   */
  public setInitialPosition(initialPosition: THREE.Vector3 = new THREE.Vector3()): void {
    this._asset.position.add(
      new THREE.Vector3(initialPosition.x, initialPosition.y < 0 ? 0 : initialPosition.y, initialPosition.z)
    );
  }

  /**
   * Set model rotation
   */
  public setRotation(euler: THREE.Euler = new THREE.Euler()): void {
    this._asset.rotateOnAxis(xAxis, euler.x);
    this._asset.rotateOnAxis(yAxis, euler.y);
    this._asset.rotateOnAxis(zAxis, euler.z);
  }

  /**
   * Set bounding box
   */
  public setBoundingBox(): void {
    const newBoundingBox: THREE.Box3 = new THREE.Box3().expandByObject(this._asset);
    this._boundingBox = newBoundingBox;

    this.setHeight();
  }

  /**
   * Set model animation mixer
   * @param model model
   */
  private setAnimationMixer(model: THREE.Object3D): void {
    this._animationMixer = new THREE.AnimationMixer(model);
  }

  /**
   * Set model animations
   */
  private setAnimationActions(animations: AnimationClips): void {
    this._animationActions.idle =
      animations.idle && this._animationMixer.clipAction(animations.idle as THREE.AnimationClip);
    this._animationActions.run =
      animations.run && this._animationMixer.clipAction(animations.run as THREE.AnimationClip);
    this._animationActions.walkForward =
      animations.walkForward && this._animationMixer.clipAction(animations.walkForward as THREE.AnimationClip);
    this._animationActions.walkBackward =
      animations.walkBackward && this._animationMixer.clipAction(animations.walkBackward as THREE.AnimationClip);
  }

  /**
   * Play animation based on current status
   */
  public playAnimation(): void {
    console.log(`playAnimation`);
    // Stop current animation
    {
      this._animationActions.idle?.stop();
      this._animationActions.run?.stop();
      this._animationActions.walkBackward?.stop();
      this._animationActions.walkForward?.stop();
    }

    // Play new one
    switch (this._animationCurrentStatus$.value) {
      case AnimationNames.idle:
        this.playAnimationIdle();
        break;
      case AnimationNames.run:
        this.playAnimationRun();
        break;
      case AnimationNames.walkBackward:
        this.playAnimationWalkBackward();
        break;
      case AnimationNames.walkForward:
        this.playAnimationWalkForward();
        break;
      default:
        this.playAnimationIdle();
    }
  }

  /**
   * Manage model idle animation
   */
  private playAnimationIdle(): void {
    this._animationActions.idle?.play();
  }

  /**
   *  Manage model run animation
   */
  private playAnimationRun(): void {
    this._animationActions.run?.play();
  }

  /**
   * Manage model walk backward animation
   */
  private playAnimationWalkBackward(): void {
    this._animationActions.walkBackward?.play();
  }

  /**
   * Manage model walk forward animation
   */
  private playAnimationWalkForward(): void {
    this._animationActions.walkForward?.play();
  }

  /**
   * Append checkpoint item to current model
   */
  public setCheckpoint(id: number): void {
    if (!this._isInteractable) return;

    (this._checkpoint as Item).setAsset(id);
  }

  /**
   * Set model height
   */
  public setHeight() {
    this._height = this._boundingBox.max.y - this._boundingBox.min.y;
  }

  /**
   * Set helper tools to show in debug mode
   */
  private setDebugHelperTools(): void {
    if (!this._isDebug) return;

    this.setBoundingBoxHelper();
    this.setModelAxesHelper();
  }

  /**
   * Set bounding axes helper
   */
  private setModelAxesHelper(): void {
    const height: number = Math.min(
      this._boundingBox.max.x - this._boundingBox.min.x,
      this._boundingBox.max.y - this._boundingBox.min.y,
      this._boundingBox.max.z - this._boundingBox.min.z
    );

    const axesHelper = new THREE.AxesHelper(height);
    this._asset.add(axesHelper);
  }

  /**
   * Set bounding box debug helper
   */
  private setBoundingBoxHelper(): void {
    this._boxHelper = new THREE.BoxHelper(this._asset, 0xffff00);
    this._asset.attach(this._boxHelper);
  }

  private setBoxHelperColor(): void {
    if (!this._boxHelper) return;

    const defaultColor: string = 'yellow';
    const collidingColor: string = 'red';
    const bboxColor: string = this._checkpointColliding ? collidingColor : defaultColor;

    this._boxHelper['material']['color'] = new THREE.Color(bboxColor);
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

  /**
   * Dispose asset
   */
  public disposeAsset(): void {
    this._animationCurrentStatus$.unsubscribe();

    let assetsToDispose: Array<THREE.Object3D> = [];
    assetsToDispose.push(this._asset);
    if (this._checkpoint) {
      assetsToDispose.push(this._checkpoint._asset);
    }

    assetsToDispose.forEach((asset) => {
      this._logger.log(`${this.constructor.name} - Disposing '${this._name}; asset: `, asset);

      if (asset.children?.length > 0) {
        asset.children.forEach((child) => {
          let childMesh: Mesh | AxesHelper | BoxHelper;
          if (child instanceof Mesh) {
            childMesh = child as Mesh;
          } else if (child instanceof AxesHelper) {
            childMesh = child as AxesHelper;
          } else if (child instanceof BoxHelper) {
            childMesh = child as BoxHelper;
          } else {
            return;
          }

          childMesh.geometry.dispose();
          //(childMesh.material as Array<THREE.Material>).forEach((material) => material.dispose());
        });
      }

      this._scene.remove(asset);
    });
  }

  /**
   * Update model
   */
  public update(): void {
    this._asset && this._animationMixer.update(this._time._delta * 0.001);
  }
}
