import { Loader } from './loader';
import {
  loadingBarHTMLTemplate,
  progressBarContainerSelector,
  progressBarSelector,
  innerProgressBarSelector
} from '../../config/loader';

export class ProgressBar extends Loader {
  declare _minValue: number;
  declare _maxValue: number;
  declare _progress: number;

  declare _progressBarContainerHTMLElement: HTMLElement;
  declare _innerProgressBarHTMLElement: HTMLElement;

  /**
   * Constructor
   */
  constructor(active: boolean = true, needsBackground: boolean = true, container: HTMLElement = document.body) {
    super(active, needsBackground, container);
    this._minValue = 0;
    this._maxValue = 100;
  }

  /**
   * maxValue property getter
   */
  public get maxValue(): number {
    return this._maxValue;
  }

  /**
   * Render loading bar
   */
  protected render(): void {
    this._loadingArea.insertAdjacentHTML('beforeend', loadingBarHTMLTemplate);

    this._progressBarContainerHTMLElement = this._loadingArea.querySelector(
      progressBarContainerSelector
    ) as HTMLElement;

    this._innerProgressBarHTMLElement = this._progressBarContainerHTMLElement.querySelector(
      innerProgressBarSelector
    ) as HTMLElement;

    this._progress = 0;
    this.setProgress(this._progress);
  }

  /**
   * Hide loading bar
   */
  protected hide(): void {
    this._progressBarContainerHTMLElement?.remove();
  }
  /**
   * Update loading bar progress
   * @param progress number (0 to 100)
   */
  public setProgress(progress: number = 0): void {
    if (!this._active) {
      this._logger.warn(`${this.constructor.name}: can't set progress because progress bar is not active.`);
      return;
    }

    if (progress < this._minValue) {
      progress = this._minValue;
      this._logger.warn(
        `${this.constructor.name}: Progress value (${progress}) lower than ${this._minValue}. Set to ${this._minValue}.`
      );
    }

    if (progress > this._maxValue) {
      progress = this._maxValue;
      this._logger.warn(
        `${this.constructor.name}: Progress value (${progress}) higher than ${this._maxValue}. Set to ${this._maxValue}.`
      );
    }

    progress = Math.round(progress);
    this.animateProgressBar(progress);
  }

  /**
   * Animate progress bar width
   * @param progress number (0 to 100)
   */
  private animateProgressBar(progress: number) {
    const transitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'width') {
        this._innerProgressBarHTMLElement.style.transition = '';
        this._innerProgressBarHTMLElement.removeEventListener('transitionend', transitionEnd, false);

        this._progress = progress;
        if (this._progress === this._maxValue) {
          this.setActive(false);
        }
      }
    };

    this._innerProgressBarHTMLElement.style.transition = 'width .5s linear';
    this._innerProgressBarHTMLElement.style.width = `${progress}%`;
    this._innerProgressBarHTMLElement.addEventListener('transitionend', transitionEnd, false);
  }
}
