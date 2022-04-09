import { Logger } from '../logger';
import { defaultInterval, movingCharacterHTMLTemplate, movingCharacterSelector, speedX } from '../../config/loader';

import { CharactersManager } from '../managers/characters-manager';

const enum Direction {
  forward = 'FORWARD',
  backward = 'BACKWARD'
}

export class MovingCharacter {
  #logger: Logger;
  #active!: boolean;
  //#svg: Array<string>;

  #image!: HTMLImageElement;
  #imageWidth!: number; // px
  #currentImageIndex!: number;

  #currentDirection: Direction;
  #speedX: number;
  #left!: number;

  #containerBorderLeft!: number; // px
  #containerBorderRight!: number; // px
  #container!: HTMLElement;

  /**
   * Constructor
   */
  constructor(active: boolean = true, container: HTMLElement = document.body) {
    this.#logger = new Logger();

    //this.#svg = new CharactersManager().getRandomCharacter().svg;
    this.#container = container;
    this.#currentDirection = Direction.forward;
    this.#speedX = speedX;
    this.setActive(active);
  }

  /**
   * Set #active parameter to render/hide element
   * @param active true to show, false to hide
   */
  public setActive(active: boolean): void {
    this.#active = active;
    if (this.#active) {
      this.render();
    } else {
      this.hide();
    }
  }

  /**
   * Render moving character
   */
  private render(): void {
    this.initImage();
    window.setInterval(() => {
      this.updateImage();
    }, defaultInterval);
  }

  /**
   * Initialize character image
   */
  private initImage(): void {
    this.#container.insertAdjacentHTML('beforeend', movingCharacterHTMLTemplate);
    this.#image = this.#container.querySelector(movingCharacterSelector) as HTMLImageElement;

    this.#imageWidth = this.#image.getBoundingClientRect().width;
  }

  /**
   * Update character image and its position
   */
  private updateImage(): void {
    this.updateContainerLimits();

    const currentImageLeft: number = parseInt(this.#image.style.left) || this.#container.getBoundingClientRect().left;
    let expectedImageLeft: number = currentImageLeft;

    switch (this.#currentImageIndex) {
      case 0:
        this.#currentImageIndex = 1;
        break;
      case 1:
        this.#currentImageIndex = 0;
        break;
      case 2:
        this.#currentImageIndex = 3;
        break;
      case 3:
        this.#currentImageIndex = 2;
        break;
      default:
        this.#currentImageIndex = 0;
    }

    if (this.#currentDirection === Direction.forward) {
      expectedImageLeft = currentImageLeft + this.#speedX;
      if (expectedImageLeft + this.#imageWidth >= this.#containerBorderRight) {
        expectedImageLeft = this.#containerBorderRight - this.#imageWidth;
        this.#currentDirection = Direction.backward;
        this.#currentImageIndex = 2;
      }
    } else if (this.#currentDirection === Direction.backward) {
      expectedImageLeft = currentImageLeft - this.#speedX;
      if (expectedImageLeft <= this.#containerBorderLeft) {
        expectedImageLeft = this.#containerBorderLeft;
        this.#currentDirection = Direction.forward;
        this.#currentImageIndex = 0;
      }
    } else {
      this.#logger.warn(`MovingCharacter: invalid direction.`);
      this.hide();
    }

    this.#image.style.left = expectedImageLeft + 'px';
    //this.#image.src = this.#walkingImagesPaths[this.#currentImageIndex];
  }

  /**
   * Update walking limits
   */
  private updateContainerLimits(): void {
    const containerBoundingClientRect = this.#container.getBoundingClientRect();
    this.#containerBorderLeft = containerBoundingClientRect.left;
    this.#containerBorderRight = containerBoundingClientRect.right;
  }

  /**
   * Hide moving character
   */
  private hide(): void {
    this.#image.remove();
  }
}
