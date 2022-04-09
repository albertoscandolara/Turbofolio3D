import { Logger } from '../logger';
import { backgroundHTMLTemplate, loaderBackgroundSelector, loadingAreaSelector } from '../../config/loader';

//import style from './loader-style.scss';

export abstract class Loader {
  declare _logger: Logger;
  declare _active: boolean;

  #needsBackground: boolean;
  #container: HTMLElement;
  #loaderBackground!: HTMLElement;
  declare _loadingArea: HTMLElement;

  /**
   * Constructor
   */
  constructor(active: boolean = true, needsBackground: boolean = true, container: HTMLElement = document.body) {
    this._logger = new Logger();

    this.#container = container;
    this.#needsBackground = needsBackground;

    this.setActive(active);
  }

  /**
   * Set #active parameter to render/hide element
   * @param active true to show, false to hide
   */
  public setActive(active: boolean): void {
    if (active === this._active) return;

    this._active = active;
    if (this._active) {
      this._logger.log(`Loading...`);
      this.#needsBackground && this.renderLoaderBackground();
      this.render();
    } else {
      this._logger.log(`Loaded`);
      this.hide();
      this.#loaderBackground?.remove();
    }
  }

  /**
   * Render loader background template
   */
  private renderLoaderBackground(): void {
    this.#container.insertAdjacentHTML('beforeend', backgroundHTMLTemplate);
    this.#loaderBackground = this.#container.querySelector(loaderBackgroundSelector) as HTMLElement;
    this._loadingArea = this.#loaderBackground.querySelector(loadingAreaSelector) as HTMLElement;
  }

  /**
   * Render loader
   */
  protected abstract render(): void;

  /**
   * Hide loader
   */
  protected abstract hide(): void;
}
