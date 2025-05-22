import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { init as initImageLoader } from '@cornerstonejs/dicom-image-loader';

export async function initCornerstone() {
  type CodecInitFn = (config: {
    wasmModuleURL: string;
    locateFile?: (filename: string) => string;
  }) => Promise<void>;

  const jpegInit = (await import('@cornerstonejs/codec-libjpeg-turbo-8bit')).default as unknown as CodecInitFn;
  const openjpegInit = (await import('@cornerstonejs/codec-openjpeg')).default as unknown as CodecInitFn;

  await jpegInit({
    wasmModuleURL: '/codecs/libjpeg-turbo/libjpegturbowasm_decode.wasm',
    locateFile: (filename) => `/codecs/libjpeg-turbo/${filename}`,
  });

  await openjpegInit({
    wasmModuleURL: '/codecs/openjpeg/openjpegwasm_decode.wasm',
    locateFile: (filename) => `/codecs/openjpeg/${filename}`,
  });

  initImageLoader();
  cornerstoneTools.init();
  cornerstone.setUseCPURendering(false);
}
