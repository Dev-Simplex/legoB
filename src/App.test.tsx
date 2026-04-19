import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

// R3F touches WebGL APIs happy-dom can't simulate. Stub the SceneCanvas shell to a simple div
// so we can still smoke-test the App chrome (header, status, mounting).
vi.mock('./scene/SceneCanvas', () => ({
  SceneCanvas: () => <div data-testid="scene-canvas-stub" />,
}));

describe('App', () => {
  it('renders top bar with project name', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'LegoB', level: 1 })).toBeInTheDocument();
  });

  it('mounts the scene canvas', () => {
    render(<App />);
    expect(screen.getByTestId('scene-canvas-stub')).toBeInTheDocument();
  });
});
