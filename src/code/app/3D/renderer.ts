import * as THREE from 'three';

import { App3D } from './app-3D';
import { Logger } from '../logger';
import { Sizes } from './utils/sizes';
import { Camera } from './camera';

export class Renderer {
  declare _logger: Logger;

  declare _canvas: HTMLCanvasElement;
  declare _instance: THREE.WebGLRenderer;
  declare _sizes: Sizes;
  declare _scene: THREE.Scene;
  declare _camera: Camera;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    this._logger = app3D._logger;

    this._canvas = app3D._canvas;
    this._sizes = app3D._sizes;
    this._scene = app3D._scene;
    this._camera = app3D._camera;

    this.setInstance();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set THREE renderer instance
   */
  private setInstance(): void {
    this._instance = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      logarithmicDepthBuffer: true
    });

    this._instance.physicallyCorrectLights = true;
    this._instance.outputEncoding = THREE.sRGBEncoding;
    this._instance.toneMapping = THREE.CineonToneMapping;
    this._instance.toneMappingExposure = 1.75;
    this._instance.shadowMap.enabled = true;
    this._instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this._instance.setClearColor('#211d20');

    this.resize();
  }

  /**
   * Resize
   */
  public resize(): void {
    this._instance.setSize(this._sizes._width, this._sizes._height);
    this._instance.setPixelRatio(this._sizes._pixelRatio);
  }

  /**
   * Update renderer
   */
  public update(): void {
    this._instance.render(this._scene, this._camera._instance);
  }
}
