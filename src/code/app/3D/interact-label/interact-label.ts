import './interact-label.scss';

import { Logger } from '../../../app/logger';
import { changeEnvironmentEventEmitter, showInteractionTabEventEmitter } from '../../../app/event-emitter/events';
import { App3D } from '../app-3D';
import { Language } from '../../language';
import { Building } from '../../../models/3D/environment/buildings/building';
import { Character } from '../../../models/3D/environment/characters/character';
import { Item } from '../../../models/3D/environment/items/item';
import { Model } from '../../../models/3D/environment/model';

export class InteractLabel {
  declare _logger: Logger;
  declare _container: HTMLElement;
  declare _label: HTMLElement;
  declare _language: Language;
  declare _visible: boolean;
  declare _model: Model | null;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    this._logger = app3D._logger;
    this._container = app3D._container;
    this._language = app3D._language;

    this.setLabel();
    this.hide();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Visibility setter
   */
  set visible(bool: boolean) {
    this._visible = bool;
    this._visible ? this._label.classList.remove('hidden') : this._label.classList.add('hidden');
  }

  /**
   * Get label markup
   * @returns markup string
   */
  private getLabelMarkup(): string {
    return `
    <div class="interactable-label-container" style="">
      <div class="inner-interactable-label-container">
          <img class="interactable-label-img">
          <span class="interactable-label-text"></span>
      </div>
    </div>
  `;
  }

  /**
   * Set label markup
   */
  private setLabel(): void {
    const markup: string = this.getLabelMarkup();
    this._container.insertAdjacentHTML('beforeend', markup);

    this._label = this._container.querySelector('.interactable-label-container') as HTMLElement;
  }

  /**
   * Get text to show into the label
   * @param model model interacting with main character
   * @returns string text
   */
  private getLabelText(): string {
    let text: string = '';

    if (this._model instanceof Building) {
      text = `Enter this building`;
    } else if (this._model instanceof Character) {
      text = `Talk to this character`;
    } else if (this._model instanceof Item) {
      text = `Use this item`;
    } else {
      text = `Interact`;
    }
    text = this._language.translate(text);

    return text;
  }

  /**
   * Show label
   * @param model model interacting with main character
   */
  public show(model: Model): void {
    this._model = model;
    const labelText: string = this.getLabelText();
    (this._label.querySelector('.interactable-label-text') as HTMLElement).textContent = labelText;

    this._label.addEventListener('click', () => {
      this.interact();
    });
    this.visible = true;
  }

  /**
   * Hide label
   */
  public hide(): void {
    this._model = null;
    this._label.removeEventListener('click', this.interact);
    this.visible = false;
  }

  /**
   * Dispose label
   */
  public dispose(): void {
    this._label.remove();
  }

  /**
   * Returns label visibility
   * @returns boolean representing visibility
   */
  public isVisible(): boolean {
    return this._visible;
  }

  /**
   * Callback function to invoke for model interaction
   */
  public interact(): void {
    if (!this._model) {
      this._logger.warn(`${this.constructor.name} Requesting interaction, but model is not set. Do not emit`);
      return;
    }

    this.dispose();

    if (this._model._goToEnvironment ?? false) {
      const environmentId: number = this._model._goToEnvironment as number;
      changeEnvironmentEventEmitter.emit(environmentId);
    } else if (this._model._goToHTML ?? false) {
      showInteractionTabEventEmitter.emit(this._model);
    }
  }
}
