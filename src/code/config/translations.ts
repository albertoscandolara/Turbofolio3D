import { Translation } from '../models/translation';

export const translations: Map<string, Translation> = new Map<string, Translation>([
  ['Enter this building', new Translation('Enter this building', 'l', 'Entra in questo edificio', 'n')],
  ['Talk to this character', new Translation('Talk to this character', 'l', 'Parla a questo personaggio', 'n')]
]);
