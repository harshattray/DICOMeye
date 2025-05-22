import {
  WindowLevelTool,
  ZoomTool,
  PanTool,
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

export interface ToolConfig {
  name: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const useToolConfig = () => {
  const tools: ToolConfig[] = [
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

  return { tools };
}; 