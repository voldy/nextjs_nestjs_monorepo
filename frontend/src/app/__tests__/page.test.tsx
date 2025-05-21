import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home page', () => {
  it('renders Notifications card', () => {
    render(<Home />);
    expect(
      screen.getByText(/Save and see your changes instantly/i),
    ).toBeInTheDocument();
  });
});
