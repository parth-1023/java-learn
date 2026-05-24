import { render, screen, fireEvent } from '@testing-library/react'
import ArticleView from '../ArticleView'

const article = {
  id: 'basics/syntax',
  title: 'Introduction to Basic Syntax in Java',
  body: 'Java programs are made up of **classes** containing **methods**.',
  examples: [
    { label: 'Hello World', code: 'System.out.println("Hello");' },
  ],
  starterCode: 'public class Main { }',
}

test('renders the article title', () => {
  render(<ArticleView article={article} isComplete={false} onMarkDone={vi.fn()} onMarkUndone={vi.fn()} />)
  expect(screen.getByText(/Basic Syntax in Java/i)).toBeInTheDocument()
})

test('renders the article body as markdown', () => {
  render(<ArticleView article={article} isComplete={false} onMarkDone={vi.fn()} onMarkUndone={vi.fn()} />)
  expect(screen.getByText('classes')).toBeInTheDocument()
})

test('renders example blocks', () => {
  render(<ArticleView article={article} isComplete={false} onMarkDone={vi.fn()} onMarkUndone={vi.fn()} />)
  expect(screen.getByText('Hello World')).toBeInTheDocument()
})

test('shows Mark Done button when not complete', () => {
  render(<ArticleView article={article} isComplete={false} onMarkDone={vi.fn()} onMarkUndone={vi.fn()} />)
  expect(screen.getByRole('button', { name: /mark done/i })).toBeInTheDocument()
})

test('shows Mark Undone button when complete', () => {
  render(<ArticleView article={article} isComplete={true} onMarkDone={vi.fn()} onMarkUndone={vi.fn()} />)
  expect(screen.getByRole('button', { name: /mark undone/i })).toBeInTheDocument()
})

test('clicking Mark Done calls onMarkDone with article id', () => {
  const onMarkDone = vi.fn()
  render(<ArticleView article={article} isComplete={false} onMarkDone={onMarkDone} onMarkUndone={vi.fn()} />)
  fireEvent.click(screen.getByRole('button', { name: /mark done/i }))
  expect(onMarkDone).toHaveBeenCalledWith('basics/syntax')
})

test('clicking Mark Undone calls onMarkUndone with article id', () => {
  const onMarkUndone = vi.fn()
  render(<ArticleView article={article} isComplete={true} onMarkDone={vi.fn()} onMarkUndone={onMarkUndone} />)
  fireEvent.click(screen.getByRole('button', { name: /mark undone/i }))
  expect(onMarkUndone).toHaveBeenCalledWith('basics/syntax')
})
