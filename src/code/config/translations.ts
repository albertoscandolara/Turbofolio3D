import { Translation } from '../models/translation';

export const translations: Map<string, Translation> = new Map<string, Translation>([
  ['a', new Translation('a', 'b', 'c', 'd')],
  ['h', new Translation('i', 'l', 'm', 'n')]
]);
