export interface ILanguage {
  _ISOCode: string;
  _translationAttribute: string;
  _description: string;
}

export class Language implements ILanguage {
  _ISOCode: string;
  _description: string;
  _translationAttribute: string;

  /**
   * Constructor
   */
  constructor(
    ISOCode: string,
    description: string,
    translationAttribute: string = `_${ISOCode}`
  ) {
    this._ISOCode = ISOCode;
    this._description = description;
    this._translationAttribute = translationAttribute;
  }
}
