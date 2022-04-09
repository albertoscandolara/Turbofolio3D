import { appContainerSelector, appHTMLTemplate, borderedClass } from '../config/app';

import { Debug } from './debug';
import { Language } from './language';
import { Logger } from './logger';
import { UserAgent } from './user-agent';

import { App3D } from './3D/app-3D';

export class App {
  declare _debug: Debug;
  declare _logger: Logger;
  declare _language: Language;
  //#userAgent: UserAgent;

  #app3D: App3D;

  declare _appContainer: HTMLElement;
  #container: HTMLElement;

  /**
   * Constructor
   */
  constructor(container: HTMLElement = document.body) {
    this.#container = container;
    this._debug = new Debug();
    this._logger = new Logger();
    this._language = new Language();
    //this.#userAgent = new UserAgent();

    this.render();
    this.#app3D = new App3D(this);
  }

  /**
   * Render element
   */
  private render(): void {
    this.#container.insertAdjacentHTML('beforeend', appHTMLTemplate);

    this._appContainer = this.#container.querySelector(appContainerSelector) as HTMLElement;
    if (this._debug.getActive()) {
      this._appContainer.classList.add(borderedClass);
    }
  }

  /**
   * Start application
   */
  public start(): void {}
}
