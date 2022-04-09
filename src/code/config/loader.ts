////////////////
//   Loader   //
////////////////

export const enum LoaderType {
  MovingCharacter = `MOVING_CHARACTER`,
  LoadingBar = `LOADING_BAR`,
  Spinner = `SPINNER`,
}

export const backgroundHTMLTemplate: string = `
<div class="loader-background">
    <div class="loader-area"></div>
</div>
`;

export const loadingBarLoaderHTMLTemplate: string = `
    <div class="loading-bar-container"></div>
`;

export const spinnerLoaderHTMLTemplate: string = `
    <div class="spinner-container"></div>
`;

export const loaderBackgroundSelector: string = `.loader-background`;
export const loadingAreaSelector: string = `.loader-area`;
export const spinnerContainerSelector: string = `.spinner-container`;

////////////////////
// Default loader //
////////////////////
export const defaultLoaderHTMLTemplate: string = `
<div class="default-loader-container">
    <div class="moving-character-container"></div>
    <div class="loading-bar-container"></div>
</div>
`;

export const defaultLoaderContainerSelector: string = `.default-loader-container`;
export const movingCharacterContainerSelector: string = `.moving-character-container`;
export const loadingBarContainerSelector: string = `.loading-bar-container`;

/////////////////////
//   Loading bar   //
/////////////////////

export const loadingBarHTMLTemplate: string = `
<div class="progress-bar-container">
    <div class="progress-bar">
        <span></span>
    </div>
</div>
`;

export const progressBarContainerSelector: string = `.progress-bar-container`;
export const progressBarSelector: string = `.progress-bar`;
export const innerProgressBarSelector: string = `span`;

//////////////////////////////////
//   Loader walking character   //
//////////////////////////////////
export const movingCharacterHTMLTemplate: string = `
<img class="moving-character" alt="moving character" src=""></img>
`;

export const movingCharacterSelector: string = `.moving-character`;

export const defaultInterval: number = 500; // milliseconds
export const speedX: number = 100; // px
