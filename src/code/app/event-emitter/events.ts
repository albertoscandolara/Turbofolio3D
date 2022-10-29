import { Model } from '../../models/3D/environment/model';
import { TypedEvent } from './typed-event';

export const tickEventEmitter: TypedEvent<void> = new TypedEvent<void>();
export const resizeEventEmitter: TypedEvent<void> = new TypedEvent<void>();

/**
 * Notify that an asset has been loaded.
 * The loaded asset id is passed as parameter.
 */
export const assetLoadedEventEmitter: TypedEvent<number> = new TypedEvent<number>();

/**
 * Notify that a cube texture has been loaded.
 * The loaded texture id is passed as parameter.
 */
export const cubeTextureLoadedEventEmitter: TypedEvent<number> = new TypedEvent<number>();

/**
 * Notify that a different environment has been requested.
 */
export const changeEnvironmentEventEmitter: TypedEvent<number> = new TypedEvent<number>();

/**
 * Notify that a tab has to be shown.
 */
export const showInteractionTabEventEmitter: TypedEvent<Model> = new TypedEvent<Model>();
