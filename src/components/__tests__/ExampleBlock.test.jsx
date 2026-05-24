import { render, screen } from '@testing-library/react'
import ExampleBlock from '../ExampleBlock'

test('renders the example label', () => {
  render(<ExampleBlock label="Basic constructor" code="public class Car {}" />)
  expect(screen.getByText('Basic constructor')).toBeInTheDocument()
})

test('renders the code', () => {
  render(<ExampleBlock label="Example" code="int x = 5;" />)
  expect(screen.getByText('int x = 5;')).toBeInTheDocument()
})

test('renders the JAVA badge', () => {
  render(<ExampleBlock label="Example" code="int x = 5;" />)
  expect(screen.getByText('JAVA')).toBeInTheDocument()
})

test('code is inside a pre/code block', () => {
  render(<ExampleBlock label="Example" code="int x = 5;" />)
  expect(document.querySelector('pre')).toBeInTheDocument()
})
