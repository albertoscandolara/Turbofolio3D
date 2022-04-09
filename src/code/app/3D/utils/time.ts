import { Logger } from '../../../app/logger';
import { App3D } from '../app-3D';
import { tickEventEmitter } from '../../event-emitter/events';

export class Time {
  declare _logger: Logger;

  declare _start: number;
  declare _current: number;
  declare _elapsed: number;
  declare _delta: number;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    this._logger = app3D._logger;

    this._start = Date.now();
    this._current = this._start;
    this._elapsed = 0;
    this._delta = 16;

    // Call tick function only one frame later
    window.requestAnimationFrame(() => {
      this.tick();
    });

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Update 3D app models at every frame
   */
  private tick(): void {
    const currentTime: number = Date.now();
    this._delta = currentTime - this._current;
    this._current = currentTime;
    this._elapsed = this._current - this._start;

    tickEventEmitter.emit();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
