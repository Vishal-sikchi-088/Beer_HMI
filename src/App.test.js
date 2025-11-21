import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('beer cards render', () => {
  render(<App />);
  const beerHeadings = screen.getAllByRole('heading', { name: 'Beer' });
  expect(beerHeadings.length).toBe(2);
});

test('video elements exist', () => {
  render(<App />);
  const videos = screen.getAllByLabelText('Beer animated graphic');
  expect(videos.length).toBe(2);
});