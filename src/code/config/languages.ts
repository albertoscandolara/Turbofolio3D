import { Language } from '../models/language';

const english: string = 'en-En';
const french: string = 'fr-FR';
const italian: string = 'it-IT';
const russian: string = 'ru-RU';

export const defaultLanguage: string = english;
export const availableLanguages: Array<string> = [english, french, italian, russian];

export const languages: Map<string, Language> = new Map()
  .set(english, new Language(english, `English`))
  .set(french, new Language(french, `French`))
  .set(italian, new Language(italian, `Italian`))
  .set(russian, new Language(russian, `Russian`));
