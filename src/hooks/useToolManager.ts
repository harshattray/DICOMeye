import { useState } from 'react';
import {
  ToolGroupManager,
  ZoomTool,
  PanTool,
  WindowLevelTool,
  LengthTool,
  AngleTool,
  RectangleROITool,
  CircleROITool,
} from '@cornerstonejs/tools';

const TOOLGROUP_ID = 'defaultToolGroup';

export const useToolManager = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleToolClick = (toolName: string) => {
    const toolGroup = ToolGroupManager.getToolGroup(TOOLGROUP_ID);
    if (!toolGroup) return;

    // Deactivate all tools first
    toolGroup.setToolPassive(WindowLevelTool.toolName);
    toolGroup.setToolPassive(ZoomTool.toolName);
    toolGroup.setToolPassive(PanTool.toolName);
    toolGroup.setToolPassive(LengthTool.toolName);
    toolGroup.setToolPassive(AngleTool.toolName);
    toolGroup.setToolPassive(RectangleROITool.toolName);
    toolGroup.setToolPassive(CircleROITool.toolName);

    // Activate the selected tool
    if (activeTool === toolName) {
      setActiveTool(null);
    } else {
      toolGroup.setToolActive(toolName, { bindings: [{ mouseButton: 1 }] });
      setActiveTool(toolName);
    }
  };

  return {
    activeTool,
    handleToolClick,
  };
}; 