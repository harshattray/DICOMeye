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
} from '@heroicons/react/24/outline';
import { ViewerRef } from './Viewer';

const TOOLGROUP_ID = 'defaultToolGroup';

interface ToolControlsProps {
  isActive: boolean;
  viewerRef: React.RefObject<ViewerRef>;
}

const ToolControls: React.FC<ToolControlsProps> = ({ isActive, viewerRef }) => {
  const { activeTool, handleToolClick } = useToolManager();
  const { tools } = useToolConfig();

  const handleDownloadClick = () => {
    if (viewerRef.current) {
      viewerRef.current.downloadImage();
    }
  };

  if (!isActive) return null;

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
        <button
          onClick={handleDownloadClick}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors bg-green-500 text-white hover:bg-green-600"
          title="Download Image"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default ToolControls; 