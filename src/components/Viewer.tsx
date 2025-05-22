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

    let renderingEngine: RenderingEngine | null = null;
    let toolGroup = ToolGroupManager.getToolGroup(TOOLGROUP_ID);

    const initializeViewer = async () => {
      try {
        // Get or create rendering engine
        const existingEngine = getRenderingEngine(RENDERING_ENGINE_ID);
        renderingEngine = existingEngine || new RenderingEngine(RENDERING_ENGINE_ID);

        // Enable the viewport
        renderingEngine.enableElement({
          viewportId: VIEWPORT_ID,
          element,
          type: Enums.ViewportType.STACK,
        });

        // Create tool group if it doesn't exist
        if (!toolGroup) {
          addTool(ZoomTool);
          addTool(PanTool);
          addTool(WindowLevelTool);

          toolGroup = ToolGroupManager.createToolGroup(TOOLGROUP_ID);
          if (!toolGroup) {
            throw new Error('Failed to create tool group');
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
        const image = await imageLoader.loadImage(imageId);
        const pixelData = image.getPixelData();
        
        // Calculate min and max more efficiently
        let min = Infinity;
        let max = -Infinity;
        for (let i = 0; i < pixelData.length; i++) {
          const value = pixelData[i];
          if (value < min) min = value;
          if (value > max) max = value;
        }

        const windowCenter = Number(image.windowCenter || (min + max) / 2);
        const windowWidth = Number(image.windowWidth || (max - min));

        // Get a fresh reference to the viewport
        const viewport = renderingEngine.getViewport(VIEWPORT_ID) as StackViewport;
        
        viewport.setStack([imageId]);
        viewport.setProperties({
          voiRange: {
            lower: windowCenter - windowWidth / 2,
            upper: windowCenter + windowWidth / 2,
          },
        });

        viewport.render();
      } catch (error) {
        console.error('Error initializing viewer:', error);
      }
    };

    initializeViewer();

    // Cleanup on unmount
    return () => {
      try {
        if (renderingEngine) {
          renderingEngine.disableElement(VIEWPORT_ID);
        }
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
