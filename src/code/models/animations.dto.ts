export const enum AnimationNames {
  none = 'none',
  greet = 'greet',
  idle = 'idle',
  run = 'run',
  talk = 'talk',
  walkBackward = 'walkBackward',
  walkForward = 'walkForward'
}

export interface AnimationClips {
  greet: THREE.AnimationClip | null;
  idle: THREE.AnimationClip | null;
  run: THREE.AnimationClip | null;
  talk: THREE.AnimationClip | null;
  walkBackward: THREE.AnimationClip | null;
  walkForward: THREE.AnimationClip | null;
}

export interface AnimationActions {
  none: null;
  greet: THREE.AnimationAction | null;
  idle: THREE.AnimationAction | null;
  run: THREE.AnimationAction | null;
  talk: THREE.AnimationAction | null;
  walkBackward: THREE.AnimationAction | null;
  walkForward: THREE.AnimationAction | null;
}
