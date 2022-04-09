import { defaultLanguage, availableLanguages } from '../config/languages';
import { translations } from '../config/translations';
import { Logger } from './logger';

export class Language {
  private _language!: string;
  private _translations!: Map<string, string>;
  private _logger: Logger;

  /**
   * Constructor
   */
  constructor() {
    this._logger = new Logger();

    this.setLanguage();
  }

  /**
   * Set current language
   * @param language language to set
   */
  private setLanguage(language: string = ''): void {
    if (language === this._language) return;

    if (language) {
      this._language = language;
    } else {
      const navigatorLanguage = navigator.language;
      this._language = availableLanguages.includes(navigatorLanguage) ? navigatorLanguage : defaultLanguage;
    }
    this._logger.log(`${this._language} language set.`);

    this.setTranslations();
  }

  /**
   * Set translations dictionary
   */
  private setTranslations(): void {
    this._translations = new Map(
      [...translations.entries()].map(([key, value]) => [key, value.getValue(this._language)])
    );

    this._logger.log(`Translations set`, this._translations);
  }

  /**
   * Translate a sentence
   * @param sentence sentence to be translated
   * @returns translation or original sentence
   */
  public translate(sentence: string): string {
    const translation: string | undefined = this._translations.get(sentence);

    if (translation) {
      return translation;
    } else {
      this._logger.warn(`'${sentence}' was not found among '${this._language}' translations or was empty`);
      return sentence;
    }
  }
}
