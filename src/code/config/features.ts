import { Feature } from '../models/feature';

const MDNWebDocsUrlPrefix = `https://developer.mozilla.org/{{language}}/docs/Web`;
const CanIUseUrlPrefix = `https://caniuse.com`;

export const cssFeatures: Array<Feature> = [
  new Feature(
    `CSS Container Queries`,
    `${MDNWebDocsUrlPrefix}/CSS/CSS_Container_Queries`,
    `${CanIUseUrlPrefix}/css-container-queries`
  ),
  new Feature(
    `Resize Observer API`,
    `${MDNWebDocsUrlPrefix}/API/Resize_Observer_API`,
    `${CanIUseUrlPrefix}/resizeobserver`
  )
];
