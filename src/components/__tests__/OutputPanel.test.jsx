import { render, screen } from '@testing-library/react'
import OutputPanel from '../OutputPanel'

test('shows nothing when idle (no output, no error, not loading)', () => {
  render(<OutputPanel output={null} error={null} loading={false} />)
  expect(screen.queryByText(/OUTPUT/i)).toBeInTheDocument()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

test('shows spinner when loading', () => {
  render(<OutputPanel output={null} error={null} loading={true} />)
  expect(screen.getByRole('status')).toBeInTheDocument()
})

test('shows stdout in green', () => {
  render(<OutputPanel output="Hello, World!\n" error={null} loading={false} />)
  const out = screen.getByText('Hello, World!')
  expect(out).toBeInTheDocument()
  expect(out.closest('.output-stdout')).toBeInTheDocument()
})

test('shows error in red', () => {
  render(<OutputPanel output={null} error="error: ; expected" loading={false} />)
  const err = screen.getByText('error: ; expected')
  expect(err).toBeInTheDocument()
  expect(err.closest('.output-error')).toBeInTheDocument()
})

test('shows missing API key message when error contains API key text', () => {
  render(<OutputPanel output={null} error="Add your Judge0 API key to .env to enable code execution." loading={false} />)
  expect(screen.getByText(/API key/i)).toBeInTheDocument()
})
