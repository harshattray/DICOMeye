import * as cornerstone from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import { init as initImageLoader } from '@cornerstonejs/dicom-image-loader';

export async function initCornerstone() {
  try {
    // Type definitions for codec initialization
    type CodecInitConfig = {
      wasmModuleURL: string;
      locateFile?: (filename: string) => string;
    };
    type CodecInitFunction = (config: CodecInitConfig) => Promise<void>;

    // Import codecs with proper typing
    const jpegModule = await import('@cornerstonejs/codec-libjpeg-turbo-8bit');
    const openjpegModule = await import('@cornerstonejs/codec-openjpeg');

    // Get initialization functions - using the correct property based on actual module exports
    const jpegInit: CodecInitFunction = jpegModule.default?.initialize || jpegModule.default;
    const openjpegInit: CodecInitFunction = openjpegModule.default?.initialize || openjpegModule.default;

    if (!jpegInit || !openjpegInit) {
      throw new Error('Failed to initialize codecs: initialization functions not found');
    }

    // Initialize codecs
    await Promise.all([
      jpegInit({
        wasmModuleURL: '/codecs/libjpeg-turbo/libjpegturbowasm_decode.wasm',
        locateFile: (filename: string) => `/codecs/libjpeg-turbo/${filename}`
      }),
      openjpegInit({
        wasmModuleURL: '/codecs/openjpeg/openjpegwasm_decode.wasm',
        locateFile: (filename: string) => `/codecs/openjpeg/${filename}`
      })
    ]);

    // Initialize DICOM image loader and tools
    initImageLoader();
    cornerstoneTools.init();
    cornerstone.setUseCPURendering(false);

    console.log('Cornerstone initialized successfully');
  } catch (error) {
    console.error('Error initializing Cornerstone:', error);
    throw error;
  }
}