import { render, screen, fireEvent } from '@testing-library/react'
import SubSidebar from '../SubSidebar'

const section = {
  id: 'basics',
  label: 'BASICS',
  fullName: 'Java Language Basics',
  articles: [
    { id: 'basics/syntax',      title: 'Basic Syntax' },
    { id: 'basics/primitives',  title: 'Java Primitives' },
    { id: 'basics/main-method', title: 'main() Method' },
  ],
}

const defaultProps = {
  section,
  currentArticleId: 'basics/primitives',
  onArticleChange: vi.fn(),
  isComplete: (id) => id === 'basics/syntax',
  progress: { total: 3, completed: 1 },
}

test('renders all articles in the section', () => {
  render(<SubSidebar {...defaultProps} />)
  expect(screen.getByText('Basic Syntax')).toBeInTheDocument()
  expect(screen.getByText('Java Primitives')).toBeInTheDocument()
  expect(screen.getByText('main() Method')).toBeInTheDocument()
})

test('renders section title', () => {
  render(<SubSidebar {...defaultProps} />)
  expect(screen.getByText(/Java Language Basics/i)).toBeInTheDocument()
})

test('active article has active class', () => {
  render(<SubSidebar {...defaultProps} />)
  expect(screen.getByText('Java Primitives').closest('.article-item')).toHaveClass('active')
})

test('completed article has done class', () => {
  render(<SubSidebar {...defaultProps} />)
  expect(screen.getByText('Basic Syntax').closest('.article-item')).toHaveClass('done')
})

test('clicking an article calls onArticleChange with its id', () => {
  const onArticleChange = vi.fn()
  render(<SubSidebar {...defaultProps} onArticleChange={onArticleChange} />)
  fireEvent.click(screen.getByText('main() Method'))
  expect(onArticleChange).toHaveBeenCalledWith('basics/main-method')
})

test('progress bar width reflects completion percentage', () => {
  render(<SubSidebar {...defaultProps} />)
  const fill = document.querySelector('.progress-bar-fill')
  expect(fill.style.width).toBe('33%')
})

test('progress text shows completed/total', () => {
  render(<SubSidebar {...defaultProps} />)
  expect(screen.getByText('1 / 3')).toBeInTheDocument()
})
