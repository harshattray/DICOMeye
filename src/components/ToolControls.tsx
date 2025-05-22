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
import {
  ArrowsPointingOutIcon,
  HandRaisedIcon,
  AdjustmentsHorizontalIcon,
  Square2StackIcon,
  Square3Stack3DIcon,
  CircleStackIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

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

  const tools = [
    {
      name: WindowLevelTool.toolName,
      label: 'Window Level',
      icon: AdjustmentsHorizontalIcon,
    },
    {
      name: ZoomTool.toolName,
      label: 'Zoom',
      icon: ArrowsPointingOutIcon,
    },
    {
      name: PanTool.toolName,
      label: 'Pan',
      icon: HandRaisedIcon,
    },
    {
      name: LengthTool.toolName,
      label: 'Length',
      icon: ArrowPathIcon,
    },
    {
      name: AngleTool.toolName,
      label: 'Angle',
      icon: Square2StackIcon,
    },
    {
      name: RectangleROITool.toolName,
      label: 'Rectangle',
      icon: Square3Stack3DIcon,
    },
    {
      name: CircleROITool.toolName,
      label: 'Circle',
      icon: CircleStackIcon,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">Tools</div>
      <div className="grid grid-cols-2 gap-2">
        {tools.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            onClick={() => handleToolClick(name)}
            className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              activeTool === name
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            title={label}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolControls; 