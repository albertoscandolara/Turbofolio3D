import { Logger } from '../../../app/logger';
import { App3D } from '../app-3D';
import { resizeEventEmitter } from '../../event-emitter/events';

import { sizesResizeObserverLogDebounceTime } from '../../../config/app-3D';

export class Sizes {
  declare _container: HTMLElement;
  declare _logger: Logger;
  declare _width: number;
  declare _height: number;
  declare _pixelRatio: number;
  declare _resizeObserverContainer: ResizeObserver;
  declare _containerResizeObserverLogTimer: NodeJS.Timeout;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    this._logger = app3D._logger;

    this._container = app3D._container;
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);
    this._width = this._container.clientWidth;
    this._height = this._container.clientHeight;

    this.setEventListeners();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Set event listeners connected to this class
   */
  private setEventListeners(): void {
    this._resizeObserverContainer = new ResizeObserver((entries) => this.updateSizesValues(entries));
    this.startObserving();
  }

  /**
   * Initiates the observing of a specified Element.
   */
  private startObserving(): void {
    this._resizeObserverContainer.observe(this._container);
  }

  /**
   * Ends the observing of a specified Element.
   */
  private stopObserving(): void {
    this._resizeObserverContainer.unobserve(this._container);
  }

  /**
   * Update Sizes properties when resize over container is detected
   * @param entries Describes a single element which has been resized, identifying the element and its new size
   */
  private updateSizesValues(entries: Array<ResizeObserverEntry>): void {
    for (let entry of entries) {
      if (entry.contentBoxSize) {
        this._width = entry.contentRect.width;
        this._height = entry.contentRect.height;

        resizeEventEmitter.emit();

        clearTimeout(this._containerResizeObserverLogTimer);
        if (
          !this._containerResizeObserverLogTimer ||
          ((this._containerResizeObserverLogTimer as unknown) as number) < sizesResizeObserverLogDebounceTime
        ) {
          this._containerResizeObserverLogTimer = setTimeout(() => {
            this._logger.log(`'${this._container.classList}' container sizes have changed:`, this);
          }, sizesResizeObserverLogDebounceTime);
        }
      }
    }
  }
}
