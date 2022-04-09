import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Logger } from '../app/logger';

export interface IFeature {
  _name: string;
  _MDNWebDocsUrl: string;
  _isSupported: boolean;
}

export class Feature implements IFeature {
  #logger: Logger;
  declare _name: string;
  declare _MDNWebDocsUrl: string;
  declare _CanIUseUrl: string;
  declare _isSupported: boolean;

  /**
   * Constructor
   */
  constructor(name: string, MDNWebDocsUrl: string, CanIUseUrl: string) {
    this.#logger = new Logger();
    this._name = name;
    this._MDNWebDocsUrl = MDNWebDocsUrl;
    this._CanIUseUrl = CanIUseUrl;
  }

  /**
   * Get name property value
   * @returns _name property value
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Get support level property value
   * @returns _supportLevel property value
   */
  public get isSupported(): boolean {
    return this._isSupported;
  }

  /**
   * Set support level property value
   * @returns promise
   */
  public setSupportLevel(): Observable<boolean> {
    return this.fetchSupportLevel().pipe(
      map((isSupported: boolean) => {
        this._isSupported = isSupported;
        this.#logger.log(`${this.constructor.name}: ${this._name} ${this._isSupported ? 'is' : 'is not'} supported.`);
        return true;
      })
    );
    // .map((value => {}))
    // .subscribe({
    //   next: (v) => {

    //   },
    //   error: (e) => {
    //     this._isSupported = false;
    //     this.#logger.error(
    //       `${this.constructor.name}: an error happened while setting support level. ${e}`
    //     );
    //   },
    //   complete: () => of(this._isSupported),
    // });
  }

  /**
   * Fetch support level for this css property
   * @returns observable
   */
  private fetchSupportLevel(): Observable<boolean> {
    // call caniuse api
    const result: boolean = Math.random() > 0.5 ? true : false;
    return of(result);
  }
}
