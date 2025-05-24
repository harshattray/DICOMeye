/**
 * @author: Harsha Attray
 * @description: Initialization and configuration of Cornerstone3D for DICOM image rendering
 * @version: 1.0.0
 * @date: 2025-05-24
 * @license: MIT
 */

import * as cornerstoneCore from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { init as initDicomLoader } from '@cornerstonejs/dicom-image-loader';

export function initCornerstone() {
  initDicomLoader();
  cornerstoneTools.init();
  cornerstoneCore.setUseCPURendering(false);
}
