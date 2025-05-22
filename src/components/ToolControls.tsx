import React from 'react';
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

interface ToolControlsProps {
  isActive: boolean;
}

const ToolControls: React.FC<ToolControlsProps> = ({ isActive }) => {
  const [activeTool, setActiveTool] = React.useState<string | null>(null);

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

  if (!isActive) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">Tools</div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleToolClick(WindowLevelTool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === WindowLevelTool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Window Level
        </button>
        <button
          onClick={() => handleToolClick(ZoomTool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === ZoomTool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Zoom
        </button>
        <button
          onClick={() => handleToolClick(PanTool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === PanTool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pan
        </button>
        <button
          onClick={() => handleToolClick(LengthTool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === LengthTool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Length
        </button>
        <button
          onClick={() => handleToolClick(AngleTool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === AngleTool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Angle
        </button>
        <button
          onClick={() => handleToolClick(RectangleROITool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === RectangleROITool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={() => handleToolClick(CircleROITool.toolName)}
          className={`px-3 py-2 text-sm rounded-md ${
            activeTool === CircleROITool.toolName
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Circle
        </button>
      </div>
    </div>
  );
};

export default ToolControls; 