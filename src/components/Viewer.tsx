import React, { useEffect, useRef } from 'react';
import {
  RenderingEngine,
  Enums,
  getRenderingEngine,
  StackViewport,
  imageLoader,
} from '@cornerstonejs/core';
import {
  addTool,
  ToolGroupManager,
  ZoomTool,
  PanTool,
  WindowLevelTool,
} from '@cornerstonejs/tools';

interface ViewerProps {
  imageId: string;
}

const VIEWPORT_ID = 'defaultViewport';
const RENDERING_ENGINE_ID = 'defaultRenderingEngine';
const TOOLGROUP_ID = 'defaultToolGroup';

const Viewer: React.FC<ViewerProps> = ({ imageId }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Get or create rendering engine
    let renderingEngine = getRenderingEngine(RENDERING_ENGINE_ID);
    if (!renderingEngine) {
      renderingEngine = new RenderingEngine(RENDERING_ENGINE_ID);
    }

    // Enable the viewport if not already
    try {
      renderingEngine.enableElement({
        viewportId: VIEWPORT_ID,
        element,
        type: Enums.ViewportType.STACK,
      });
    } catch (err) {
      // Already enabled
    }

    const viewport = renderingEngine.getViewport(VIEWPORT_ID) as StackViewport;

    // Create tool group only once
    let toolGroup = ToolGroupManager.getToolGroup(TOOLGROUP_ID);

    if (!toolGroup) {
      addTool(ZoomTool);
      addTool(PanTool);
      addTool(WindowLevelTool);

      toolGroup = ToolGroupManager.createToolGroup(TOOLGROUP_ID);

      if (!toolGroup) {
        console.error('Failed to create tool group');
        return;
      }

      toolGroup.addTool(ZoomTool.toolName);
      toolGroup.addTool(PanTool.toolName);
      toolGroup.addTool(WindowLevelTool.toolName);

      toolGroup.setToolActive(WindowLevelTool.toolName, { bindings: [{ mouseButton: 1 }] });
      toolGroup.setToolActive(ZoomTool.toolName, { bindings: [{ mouseButton: 2 }] });
      toolGroup.setToolActive(PanTool.toolName, { bindings: [{ mouseButton: 4 }] });

      toolGroup.addViewport(VIEWPORT_ID, RENDERING_ENGINE_ID);
    }

    // Load and render the image
    imageLoader.loadImage(imageId).then((image) => {
      const pixelData = image.getPixelData();
      const min = Math.min(...pixelData);
      const max = Math.max(...pixelData);

      const windowCenter = Number(image.windowCenter || (min + max) / 2);
      const windowWidth = Number(image.windowWidth || (max - min));

      viewport.setStack([imageId]);

      viewport.setProperties({
        voiRange: {
          lower: windowCenter - windowWidth / 2,
          upper: windowCenter + windowWidth / 2,
        },
      });

      viewport.render();
    });

    // Cleanup on unmount
    return () => {
      try {
        renderingEngine.disableElement(VIEWPORT_ID);
        ToolGroupManager.destroyToolGroup(TOOLGROUP_ID);
      } catch (err) {
        console.warn('Viewer cleanup failed:', err);
      }
    };
  }, [imageId]);

  return (
    <div
      ref={elementRef}
      className="w-full h-[512px] border bg-black"
      style={{ width: '512px', height: '512px' }}
    />
  );
};

export default Viewer;
