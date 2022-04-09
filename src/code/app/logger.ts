import { Debug } from './debug';

let instance!: Logger;

export class Logger {
  private debug!: Debug;
  /**
   * Constructor
   */
  constructor() {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.debug = new Debug();
  }

  /**
   * Prints a message to console only if in debug mode
   * @param message message to be printed
   * @param optionalParams additional optional parameters
   */
  public log(message?: any, ...optionalParams: any[]): void {
    this.debug.getActive() && console.log(message, ...optionalParams);
  }

  /**
   * Prints a warning to console only if in debug mode
   * @param message message to be printed
   * @param optionalParams additional optional parameters
   */
  public warn(message?: any, ...optionalParams: any[]): void {
    this.debug.getActive() && console.warn(message, ...optionalParams);
  }

  /**
   * Prints an error to console only if in debug mode
   * @param message message to be printed
   * @param optionalParams additional optional parameters
   */
  public error(message?: any, ...optionalParams: any[]): void {
    console.error(message, ...optionalParams);
  }
}
