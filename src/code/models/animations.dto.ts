export const enum AnimationNames {
  none = 'none',
  idle = 'idle',
  run = 'run',
  walkBackward = 'walkBackward',
  walkForward = 'walkForward'
}

export interface AnimationClips {
  idle: THREE.AnimationClip | null;
  run: THREE.AnimationClip | null;
  walkBackward: THREE.AnimationClip | null;
  walkForward: THREE.AnimationClip | null;
}

export interface AnimationActions {
  none: null;
  idle: THREE.AnimationAction | null;
  run: THREE.AnimationAction | null;
  walkBackward: THREE.AnimationAction | null;
  walkForward: THREE.AnimationAction | null;
}
