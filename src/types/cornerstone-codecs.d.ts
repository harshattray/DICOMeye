declare module '@cornerstonejs/codec-libjpeg-turbo-8bit' {
  export function initialize(config?: { wasmModuleURL?: string }): Promise<void>;
}

declare module '@cornerstonejs/codec-openjpeg' {
  export function initialize(config?: { wasmModuleURL?: string }): Promise<void>;
}
