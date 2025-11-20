import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.useFakeTimers();

test('shows only beer content and no Coca-Cola', () => {
  render(<App />);
  const beerHeadings = screen.getAllByRole('heading', { name: 'Beer' });
  expect(beerHeadings.length).toBeGreaterThan(0);
  expect(screen.queryByText(/Coca-Cola/i)).toBeNull();
});

test('both beer cards are visible', () => {
  render(<App />);
  const headings = screen.getAllByRole('heading', { name: 'Beer' });
  expect(headings.length).toBe(2);
});

test('arrow keys do not move cards', async () => {
  render(<App />);
  const headingsBefore = screen.getAllByRole('heading', { name: 'Beer' });
  expect(headingsBefore.length).toBe(2);
  userEvent.keyboard('{ArrowRight}');
  const headingsAfter = screen.getAllByRole('heading', { name: 'Beer' });
  expect(headingsAfter.length).toBe(2);
});

test('both cards are visible', () => {
  render(<App />);
  const headings = screen.getAllByRole('heading', { name: 'Beer' });
  expect(headings.length).toBe(2);
});
test('preparation panel shows when clicking prepare and hides on close', async () => {
  render(<App />);
  const buttons = screen.getAllByRole('button', { name: /Prepare Beer/i });
  await userEvent.click(buttons[0]);
  const dialog = await screen.findByRole('dialog', { name: 'Beer preparation' });
  expect(dialog).toBeInTheDocument();
  const close = screen.getByRole('button', { name: 'Close' });
  await userEvent.click(close);
  expect(screen.queryByRole('dialog', { name: 'Beer preparation' })).toBeNull();
});
test('loop status toggles when pressing video control', async () => {
  render(<App />);
  const statusBefore = screen.getAllByText(/Looping 5s|Loop stopped/i)[0];
  const toggle = screen.getAllByRole('button', { name: /Start 5s loop|Stop 5s loop/i })[0];
  await userEvent.click(toggle);
  const statusAfter = screen.getAllByText(/Looping 5s|Loop stopped/i)[0];
  expect(statusAfter.textContent).not.toEqual(statusBefore.textContent);
});