import { Logger } from '../logger';

import { characters, mainCharacterId } from '../../config/characters';
import { AssetsManager } from './assets-manager';
import { Asset, AssetCategory } from '../../models/3D/environment/asset';
import { Character } from '../../models/3D/environment/characters/character';

let instance!: CharactersManager;

export class CharactersManager {
  declare _logger: Logger;

  declare _assetsManager: AssetsManager;
  declare _characters: Array<Character>;
  declare _assets: Array<Asset>;

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

    this._characters = characters;

    this._assetsManager = new AssetsManager();
    this._assets = this._assetsManager.getAssetsWithCategory(AssetCategory.Character);
    this.setAssetIds();

    this._logger.log(`${this.constructor.name} class instantiated:`, this);
  }

  /**
   * Check if characters have unique ids
   * @returns true if ids are unique, false otherwise
   */
  private checkForDuplicateIds(): boolean {
    let parsedCharacters: Set<number> = new Set();
    const hasDuplicates: boolean = characters.some((character) => {
      return parsedCharacters.size === parsedCharacters.add(character.id).size;
    });

    if (hasDuplicates) {
      this._logger.error(`${this.constructor.name} - There are characters with duplicate ids`);
    }

    return hasDuplicates;
  }

  /**
   * Check if there are configured characters
   */
  private checkForNoCharacters(): void {
    if (!this._characters.length) {
      this._logger.error(`No characters configurations found.`);
    }
  }

  /**
   * Associate an asset id to characters who don't have one
   */
  private setAssetIds(): void {
    this._characters
      .filter((character) => character._assetId === -1)
      .forEach((character) => (character._assetId = Math.floor(Math.random() * this._assets.length)));
  }

  /**
   * Get a random character configuration
   * @returns random character configuration
   */
  public getRandomCharacter(): Character {
    this.checkForNoCharacters();

    const min: number = Math.ceil(0);
    const max: number = Math.floor(this._characters.length) - 1;
    const randomNumber: number = Math.floor(Math.random() * (max - min + 1)) + min;

    return this._characters[randomNumber];
  }

  /**
   * Get the character with given id
   * @param id id of the character to find
   * @returns character with id configuration
   */
  public getCharacterWithId(id: number): Character {
    this.checkForNoCharacters();

    let character!: Character;

    const characters: Array<Character> = this._characters.filter((character) => character.id === id);

    if (characters.length === 0) {
      this._logger.error(`No characters with id '${id}' found.`);
    } else {
      if (characters.length > 1) {
        this._logger.warn(`More characters with id '${id}' found. Got the first one.`);
      }
      character = characters[0];
    }

    return character;
  }

  /**
   * Get main character
   * @returns Main character
   */
  public getMainCharacter(): Character {
    return this.getCharacterWithId(mainCharacterId);
  }

  public loadCharacter(character: Character) {
    const c = character;
  }
}
