import { renderHook } from '@testing-library/react';
import { useToolConfig } from '../useToolConfig';

describe('useToolConfig', () => {
  it('should return all tools with correct configuration', () => {
    const { result } = renderHook(() => useToolConfig());
    const { tools } = result.current;

    expect(tools).toHaveLength(7);
    
    // Check Window Level tool
    expect(tools[0]).toEqual({
      name: 'WindowLevel',
      label: 'Window Level',
      icon: expect.any(Function),
    });

    // Check Zoom tool
    expect(tools[1]).toEqual({
      name: 'Zoom',
      label: 'Zoom',
      icon: expect.any(Function),
    });

    // Check Pan tool
    expect(tools[2]).toEqual({
      name: 'Pan',
      label: 'Pan',
      icon: expect.any(Function),
    });

    // Check Length tool
    expect(tools[3]).toEqual({
      name: 'Length',
      label: 'Length',
      icon: expect.any(Function),
    });

    // Check Angle tool
    expect(tools[4]).toEqual({
      name: 'Angle',
      label: 'Angle',
      icon: expect.any(Function),
    });

    // Check Rectangle tool
    expect(tools[5]).toEqual({
      name: 'RectangleROI',
      label: 'Rectangle',
      icon: expect.any(Function),
    });

    // Check Circle tool
    expect(tools[6]).toEqual({
      name: 'CircleROI',
      label: 'Circle',
      icon: expect.any(Function),
    });
  });

  it('should maintain consistent tool order', () => {
    const { result } = renderHook(() => useToolConfig());
    const { tools } = result.current;

    const toolNames = tools.map(tool => tool.name);
    expect(toolNames).toEqual([
      'WindowLevel',
      'Zoom',
      'Pan',
      'Length',
      'Angle',
      'RectangleROI',
      'CircleROI',
    ]);
  });
}); 