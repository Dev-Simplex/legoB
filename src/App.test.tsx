import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

vi.mock('./scene/SceneCanvas', () => ({
  SceneCanvas: () => <div data-testid="scene-canvas-stub" />,
}));
vi.mock('./scene/SandboxScene', () => ({
  SandboxScene: () => null,
}));

describe('App', () => {
  it('renders top bar with project name', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'LegoB', level: 1 })).toBeInTheDocument();
  });

  it('renders key sandbox actions', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /^Save scene$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export as/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import/ })).toBeInTheDocument();
  });

  it('renders palette and toast container', () => {
    render(<App />);
    expect(screen.getByRole('complementary', { name: /parts palette/i })).toBeInTheDocument();
  });
});
