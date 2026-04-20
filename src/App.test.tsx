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

  it('renders key sandbox actions in pt-BR', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Salvar cena/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exportar como/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Importar arquivo/ })).toBeInTheDocument();
  });

  it('renders palette and toast container', () => {
    render(<App />);
    expect(screen.getByRole('complementary', { name: /paleta de peças/i })).toBeInTheDocument();
  });
});
