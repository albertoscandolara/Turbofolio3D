import { Model } from '../../models/3D/environment/model';
import { TypedEvent } from './typed-event';

export const tickEventEmitter = new TypedEvent<void>();
export const resizeEventEmitter = new TypedEvent<void>();

/**
 * Notify that an asset has been loaded.
 * The loaded asset id is passed as parameter.
 */
export const assetLoadedEventEmitter = new TypedEvent<number>();

/**
 * Notify that a cube texture has been loaded.
 * The loaded texture id is passed as parameter.
 */
export const cubeTextureLoadedEventEmitter = new TypedEvent<number>();

/**
 * Notify that an interaction is ongoing.
 */
export const requestInteractionEventEmitter = new TypedEvent<Model>();
