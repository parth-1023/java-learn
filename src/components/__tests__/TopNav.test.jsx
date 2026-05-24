import { render, screen, fireEvent } from '@testing-library/react'
import TopNav from '../TopNav'
import { sections } from '../../content/index'

const progress = {
  total: 86,
  completed: 2,
  bySection: Object.fromEntries(
    sections.map(s => [s.id, { total: s.articles.length, completed: 0 }])
  ),
}
// Mark basics as fully complete for testing
progress.bySection['basics'] = { total: 13, completed: 13 }

const defaultProps = {
  sections,
  currentSectionId: 'oop',
  onSectionChange: vi.fn(),
  progress,
  isDark: true,
  onThemeToggle: vi.fn(),
}

test('renders all 9 section tabs', () => {
  render(<TopNav {...defaultProps} />)
  expect(screen.getByText('OOP')).toBeInTheDocument()
  expect(screen.getByText('STRINGS')).toBeInTheDocument()
  expect(screen.getByText('EXCEPTIONS')).toBeInTheDocument()
  expect(screen.getByText('DEV ENV')).toBeInTheDocument()
})

test('active section tab has active class', () => {
  render(<TopNav {...defaultProps} />)
  expect(screen.getByText('OOP').closest('.nav-tab')).toHaveClass('active')
})

test('completed section shows checkmark', () => {
  render(<TopNav {...defaultProps} />)
  const basicsTab = screen.getByText(/BASICS/)
  expect(basicsTab.closest('.nav-tab')).toHaveClass('done')
})

test('clicking a tab calls onSectionChange with section id', () => {
  const onSectionChange = vi.fn()
  render(<TopNav {...defaultProps} onSectionChange={onSectionChange} />)
  fireEvent.click(screen.getByText('STRINGS'))
  expect(onSectionChange).toHaveBeenCalledWith('strings')
})

test('shows overall progress chip', () => {
  render(<TopNav {...defaultProps} />)
  expect(screen.getByText('2/86 DONE')).toBeInTheDocument()
})

test('clicking theme toggle calls onThemeToggle', () => {
  const onThemeToggle = vi.fn()
  render(<TopNav {...defaultProps} onThemeToggle={onThemeToggle} />)
  fireEvent.click(screen.getByRole('button', { name: /theme/i }))
  expect(onThemeToggle).toHaveBeenCalled()
})
