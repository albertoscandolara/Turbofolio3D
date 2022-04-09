import * as dat from 'lil-gui';
import { App3D } from './app-3D';

let instance!: GUI;

export class GUI {
  declare gui: dat.GUI;

  /**
   * Constructor
   */
  constructor(app3D: App3D) {
    // singleton
    if (instance) {
      return instance;
    }
    instance = this;

    if (app3D._debug.getActive()) {
      this.gui = new dat.GUI();
    }
  }
}
