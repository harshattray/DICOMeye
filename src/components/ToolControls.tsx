import React from 'react';
import { useToolManager } from '../hooks/useToolManager';
import { useToolConfig } from '../hooks/useToolConfig';
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
  ArrowDownTrayIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { ViewerRef } from './Viewer';

const TOOLGROUP_ID = 'defaultToolGroup';

interface ToolControlsProps {
  isActive: boolean;
  viewerRef: React.RefObject<ViewerRef>;
  onToggleFullscreen?: () => void;
}

interface Tool {
  name: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const ToolControls = ({ isActive, viewerRef, onToggleFullscreen }: ToolControlsProps) => {
  const { activeTool, handleToolClick } = useToolManager();
  const { tools } = useToolConfig();

  if (!isActive) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-2">Tools</div>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool: Tool) => (
          <button
            key={tool.name}
            onClick={() => handleToolClick(tool.name)}
            className={`p-2 rounded-md transition-colors ${
              activeTool === tool.name
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
            title={tool.label}
          >
            {React.createElement(tool.icon, { className: 'h-5 w-5' })}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => viewerRef.current?.downloadImage()}
          className="flex-1 p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Download Image"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mx-auto" />
        </button>
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="flex-1 p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Enter Fullscreen"
          >
            <ArrowsPointingOutIcon className="h-5 w-5 mx-auto" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ToolControls; 