import React from 'react';
import { useToolManager } from '../hooks/useToolManager';
import { useToolConfig } from '../hooks/useToolConfig';
import { ViewerRef } from './Viewer';
import {
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  PencilIcon,
  Square2StackIcon,
  CircleStackIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface FloatingToolsProps {
  isActive: boolean;
  viewerRef: React.RefObject<ViewerRef>;
  onExitFullscreen: () => void;
}

interface Tool {
  name: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const FloatingTools = ({ isActive, viewerRef, onExitFullscreen }: FloatingToolsProps) => {
  const { activeTool, handleToolClick } = useToolManager();
  const { tools } = useToolConfig();

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700">
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
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => viewerRef.current?.downloadImage()}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Download Image"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      <button
        onClick={onExitFullscreen}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Exit Fullscreen"
      >
        <ArrowsPointingOutIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FloatingTools; 