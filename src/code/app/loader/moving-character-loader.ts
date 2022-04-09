import { Loader } from "./loader";
import { ProgressBar } from "./progress-bar";
import { MovingCharacter } from "./moving-character";
import {
  defaultLoaderContainerSelector,
  defaultLoaderHTMLTemplate,
  loadingBarContainerSelector,
  movingCharacterContainerSelector,
} from "../../config/loader";

export class MovingCharacterLoader extends Loader {
  _movingCharacter!: MovingCharacter;
  _progressBar!: ProgressBar;

  _loaderContainer!: HTMLElement;

  /**
   * Constructor
   */
  constructor(
    active: boolean = true,
    needsBackground: boolean = true,
    container: HTMLElement = document.body
  ) {
    super(active, needsBackground, container);
  }

  /**
   * Set #active parameter to render/hide element
   * @param active true to show, false to hide
   */
  public override setActive(active: boolean): void {
    super.setActive(active);
  }

  protected render(): void {
    this._loadingArea.insertAdjacentHTML(
      "beforeend",
      defaultLoaderHTMLTemplate
    );

    this._loaderContainer = this._loadingArea.querySelector(
      defaultLoaderContainerSelector
    ) as HTMLElement;

    this._movingCharacter = new MovingCharacter(
      true,
      this._loaderContainer.querySelector(
        movingCharacterContainerSelector
      ) as HTMLElement
    );

    this._progressBar = new ProgressBar(
      true,
      false,
      this._loaderContainer.querySelector(
        loadingBarContainerSelector
      ) as HTMLElement
    );
  }

  protected hide(): void {
    this._movingCharacter.setActive(false);
    this._progressBar.setActive(false);
    this._loaderContainer.remove();
  }

  /**
   * Update loading bar progress
   * @param progress number from 0 to 100
   */
  public setProgress(progress: number = 0): void {
    this._progressBar.setProgress(progress);
  }
}
