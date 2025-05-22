declare module '@cornerstonejs/codec-libjpeg-turbo-8bit' {
  export default {
    initialize(config: { wasmModuleURL: string, locateFile?: (filename: string) => string }): Promise<void>;
  };
}

declare module '@cornerstonejs/codec-openjpeg' {
  export default {
    initialize(config: { wasmModuleURL: string, locateFile?: (filename: string) => string }): Promise<void>;
  };
}