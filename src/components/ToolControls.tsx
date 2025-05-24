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
          <div key={tool.name} className="group relative">
            <button
              onClick={() => handleToolClick(tool.name)}
              className={`w-full p-2 rounded-md transition-colors ${
                activeTool === tool.name
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {React.createElement(tool.icon, { className: 'h-5 w-5 mx-auto' })}
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tool.label}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <div className="group relative flex-1">
          <button
            onClick={() => viewerRef.current?.downloadImage()}
            className="w-full p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mx-auto" />
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Download Image
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
        {onToggleFullscreen && (
          <div className="group relative flex-1">
            <button
              onClick={onToggleFullscreen}
              className="w-full p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ArrowsPointingOutIcon className="h-5 w-5 mx-auto" />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Enter Fullscreen
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolControls; 