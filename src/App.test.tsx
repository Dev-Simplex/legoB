import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders bootstrap message', () => {
    render(<App />);
    expect(screen.getByText(/LegoB — bootstrapping/i)).toBeInTheDocument();
  });
});
