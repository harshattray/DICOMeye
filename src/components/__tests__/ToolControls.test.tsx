import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToolControls from '../ToolControls';
import { useToolManager } from '../../hooks/useToolManager';
import { useToolConfig } from '../../hooks/useToolConfig';

// Mock the custom hooks
jest.mock('../../hooks/useToolManager');
jest.mock('../../hooks/useToolConfig');

describe('ToolControls', () => {
  const mockHandleToolClick = jest.fn();
  const mockTools = [
    { name: 'WindowLevel', label: 'Window Level', icon: () => <div>Window Level Icon</div> },
    { name: 'Zoom', label: 'Zoom', icon: () => <div>Zoom Icon</div> },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useToolManager as jest.Mock).mockReturnValue({
      activeTool: null,
      handleToolClick: mockHandleToolClick,
    });
    (useToolConfig as jest.Mock).mockReturnValue({
      tools: mockTools,
    });
  });

  it('should not render when isActive is false', () => {
    render(<ToolControls isActive={false} />);
    expect(screen.queryByText('Tools')).not.toBeInTheDocument();
  });

  it('should render when isActive is true', () => {
    render(<ToolControls isActive={true} />);
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('should render all tools', () => {
    render(<ToolControls isActive={true} />);
    
    expect(screen.getByText('Window Level')).toBeInTheDocument();
    expect(screen.getByText('Zoom')).toBeInTheDocument();
  });

  it('should call handleToolClick when a tool is clicked', () => {
    render(<ToolControls isActive={true} />);
    
    fireEvent.click(screen.getByText('Window Level'));
    expect(mockHandleToolClick).toHaveBeenCalledWith('WindowLevel');
  });

  it('should apply active styles to the selected tool', () => {
    (useToolManager as jest.Mock).mockReturnValue({
      activeTool: 'WindowLevel',
      handleToolClick: mockHandleToolClick,
    });

    render(<ToolControls isActive={true} />);
    
    const windowLevelButton = screen.getByText('Window Level').closest('button');
    expect(windowLevelButton).toHaveClass('bg-blue-500');
    expect(windowLevelButton).toHaveClass('text-white');
  });

  it('should apply inactive styles to unselected tools', () => {
    (useToolManager as jest.Mock).mockReturnValue({
      activeTool: 'WindowLevel',
      handleToolClick: mockHandleToolClick,
    });

    render(<ToolControls isActive={true} />);
    
    const zoomButton = screen.getByText('Zoom').closest('button');
    expect(zoomButton).toHaveClass('bg-white');
    expect(zoomButton).toHaveClass('text-gray-700');
  });
}); 