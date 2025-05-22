import { renderHook, act } from '@testing-library/react';
import { useToolManager } from '../useToolManager';
import { ToolGroupManager } from '@cornerstonejs/tools';

// Mock the ToolGroupManager
jest.mock('@cornerstonejs/tools', () => ({
  ToolGroupManager: {
    getToolGroup: jest.fn(),
  },
  WindowLevelTool: { toolName: 'WindowLevel' },
  ZoomTool: { toolName: 'Zoom' },
  PanTool: { toolName: 'Pan' },
  LengthTool: { toolName: 'Length' },
  AngleTool: { toolName: 'Angle' },
  RectangleROITool: { toolName: 'RectangleROI' },
  CircleROITool: { toolName: 'CircleROI' },
}));

describe('useToolManager', () => {
  const mockToolGroup = {
    setToolPassive: jest.fn(),
    setToolActive: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ToolGroupManager.getToolGroup as jest.Mock).mockReturnValue(mockToolGroup);
  });

  it('should initialize with no active tool', () => {
    const { result } = renderHook(() => useToolManager());
    expect(result.current.activeTool).toBeNull();
  });

  it('should activate a tool when clicked', () => {
    const { result } = renderHook(() => useToolManager());
    
    act(() => {
      result.current.handleToolClick('WindowLevel');
    });

    expect(result.current.activeTool).toBe('WindowLevel');
    expect(mockToolGroup.setToolActive).toHaveBeenCalledWith('WindowLevel', {
      bindings: [{ mouseButton: 1 }],
    });
  });

  it('should deactivate a tool when clicked again', () => {
    const { result } = renderHook(() => useToolManager());
    
    // First click to activate
    act(() => {
      result.current.handleToolClick('WindowLevel');
    });

    // Second click to deactivate
    act(() => {
      result.current.handleToolClick('WindowLevel');
    });

    expect(result.current.activeTool).toBeNull();
  });

  it('should deactivate previous tool when activating a new one', () => {
    const { result } = renderHook(() => useToolManager());
    
    // Activate first tool
    act(() => {
      result.current.handleToolClick('WindowLevel');
    });

    // Activate second tool
    act(() => {
      result.current.handleToolClick('Zoom');
    });

    expect(result.current.activeTool).toBe('Zoom');
    expect(mockToolGroup.setToolPassive).toHaveBeenCalledWith('WindowLevel');
  });

  it('should handle case when tool group is not found', () => {
    (ToolGroupManager.getToolGroup as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useToolManager());
    
    act(() => {
      result.current.handleToolClick('WindowLevel');
    });

    expect(result.current.activeTool).toBeNull();
    expect(mockToolGroup.setToolActive).not.toHaveBeenCalled();
  });
}); 