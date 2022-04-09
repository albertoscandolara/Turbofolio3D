let instance!: Debug;

export class Debug {
  private _active: boolean = false;

  /**
   * Constructor
   */
  constructor() {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.setActive();
  }

  /**
   * Set debug activation
   */
  private setActive(): void {
    this._active = window.location.hash === '#debug';
    console.log(`You are ${this._active ? '' : 'not'} in debug mode.`);
  }

  /**
   * Get _active parameter
   * @returns _active parameter
   */
  public getActive(): boolean {
    return this._active;
  }
}
