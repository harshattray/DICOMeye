import * as cornerstoneCore from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { init as initDicomLoader } from '@cornerstonejs/dicom-image-loader';

export function initCornerstone() {
  initDicomLoader();
  cornerstoneTools.init();
  cornerstoneCore.setUseCPURendering(false);
}
