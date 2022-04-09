import { Logger } from './logger';

import { cssFeatures } from '../config/features';
import {} from '../config/user-agent';
import { Feature } from '../models/feature';
import { forkJoin, Observable } from 'rxjs';

export class UserAgent {
  #logger: Logger;
  #caniuse: any;

  declare _browserName: string;
  declare _browserVersion: string;

  declare _cssFeatures: Array<Feature>;

  /**
   * Constructor
   */
  constructor() {
    this.#logger = new Logger();
    this._cssFeatures = cssFeatures;

    //this.#caniuse = caniuse;

    this.setBrowserPoperties();
    this.setFeaturesCompatibility();
  }

  /**
   * Support function to set all browser properties
   */
  private setBrowserPoperties(): void {
    const browser = this.getBrowserInfo();
    this._browserName = browser.name;
    this._browserVersion = browser.version;

    this.#logger.log(
      `User agent info:
      - browser name: ${this._browserName}
      - browser version: ${this._browserVersion}`
    );
  }

  /**
   * Fetch browser name
   * @returns browser name
   */
  private fetchBrowserName(): string {
    return navigator.userAgent;
  }

  /**
   * Set browser name property
   */
  private setBrowserName(): void {
    this._browserName = this.fetchBrowserName();
  }

  /**
   * Fetch browser version
   * @returns browser version
   */
  private fetchBrowserVersion() {
    return navigator.appVersion;
  }

  /**
   * Set browser version property
   */
  private setBrowserVersion(): void {
    this._browserVersion = this.fetchBrowserVersion();
  }

  /**
   * Query caniuse api to see unsupported cutting edge technologies on user's browser
   */
  private setFeaturesCompatibility(): void {
    let observables: Array<Observable<any>> = [];
    Object.values(this._cssFeatures).forEach((feature) => observables.push(feature.setSupportLevel()));

    forkJoin(observables)
      //.pipe(take(1))
      .pipe()
      .subscribe({
        error: (e) => {
          this.#logger.error(`${this.constructor.name}: ${e}`);
        },
        complete: () => {
          this.notifyUnsupportedFeatures();
        }
      });
  }

  /**
   * Warn the user about possible stylistic flaws due to browser incompatibility
   */
  private notifyUnsupportedFeatures(): void {
    const nonSupportedFeatures: Array<Feature> = this._cssFeatures.filter((feature) => feature.isSupported);

    if (nonSupportedFeatures.length) {
      nonSupportedFeatures.forEach((feature) => {
        document.body.insertAdjacentHTML('beforeend', `<div>${feature.name}</div>`);
      });
    }
  }

  /**
   * Get user's browser info
   * @returns current user's browser { name, version } object
   */
  private getBrowserInfo(): { name: string; version: string } {
    var ua = navigator.userAgent,
      tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE ', version: tem[1] || '' };
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/);
      if (tem != null) {
        return { name: 'Opera', version: tem[1] };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return {
      name: M[0],
      version: M[1]
    };
  }
}
