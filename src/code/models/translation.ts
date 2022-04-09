export interface ITranslation {
  readonly _en_En: string;
  readonly _fr_FR: string;
  readonly _it_IT: string;
  readonly _ru_RU: string;

  getValue(language: string): string;
}

export class Translation implements ITranslation {
  _en_En: string;
  _fr_FR: string;
  _it_IT: string;
  _ru_RU: string;

  /**
   * Constructor
   */
  constructor(
    en_En: string = "",
    fr_FR: string = "",
    it_IT: string = "",
    ru_RU: string = ""
  ) {
    this._en_En = en_En;
    this._fr_FR = fr_FR;
    this._it_IT = it_IT;
    this._ru_RU = ru_RU;
  }

  /**
   * Get class translation for provided language
   * @param language language required
   * @returns matching translation
   */
  public getValue(language: string = ""): string {
    let value: string = "";
    switch (language) {
      case "en-En":
        value = this._en_En;
        break;
      case "fr-FR":
        value = this._fr_FR;
        break;
      case "it-IT":
        value = this._it_IT;
        break;
      case "ru-RU":
        value = this._ru_RU;
        break;
    }

    return value;
  }
}
