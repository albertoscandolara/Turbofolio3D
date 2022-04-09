import { Logger } from '../logger';

import { environments } from '../../config/environments';
import { Environment } from '../../models/3D/environment/environment';

let instance!: EnvironmentsManager;

export class EnvironmentsManager {
  declare _logger: Logger;

  declare _environments: Array<Environment>;

  /**
   * Constructor
   */
  constructor() {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this._logger = new Logger();

    if (this.checkForDuplicateIds()) return;

    this._environments = environments;

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Check if environments have unique ids
   * @returns true if ids are unique, false otherwise
   */
  private checkForDuplicateIds(): boolean {
    let parsedEnvironments: Set<number> = new Set();
    const hasDuplicates: boolean = environments.some((environment) => {
      return parsedEnvironments.size === parsedEnvironments.add(environment._id).size;
    });

    if (hasDuplicates) {
      this._logger.error(`${this.constructor.name} - There are environments with duplicate ids`);
    }

    return hasDuplicates;
  }

  /**
   * Check if there are configured environments
   */
  private checkForNoEnvironments(): void {
    if (!this._environments.length) {
      this._logger.error(`No environments configurations found.`);
    }
  }

  /**
   * Get the environment with given id
   * @param id id of the environment to find
   * @returns environment with id configuration
   */
  public getEnvironmentWithId(id: number): Environment {
    this.checkForNoEnvironments();

    let environment!: Environment;

    const environments: Array<Environment> = this._environments.filter((environment) => environment._id === id);

    if (environments.length === 0) {
      this._logger.error(`No environments with id '${id}' found.`);
    } else {
      if (environments.length > 1) {
        this._logger.warn(`More environments with id '${id}' found. Got the first one.`);
      }
      environment = environments[0];
    }

    return environment;
  }

  /**
   * Get default environment
   * @returns default environment
   */
  public getDefaultEnvironment(): Environment {
    this.checkForNoEnvironments();

    let environment: Environment = environments.find((environment) => environment.getIsDefault()) as Environment;

    return environment;
  }
}
