import { renderHook, act } from '@testing-library/react'
import { useProgress } from '../useProgress'
import { sections } from '../../content/index'

beforeEach(() => localStorage.clear())

test('isComplete returns false for unknown article', () => {
  const { result } = renderHook(() => useProgress())
  expect(result.current.isComplete('basics/syntax')).toBe(false)
})

test('markComplete makes isComplete return true', () => {
  const { result } = renderHook(() => useProgress())
  act(() => { result.current.markComplete('basics/syntax') })
  expect(result.current.isComplete('basics/syntax')).toBe(true)
})

test('markIncomplete reverses markComplete', () => {
  const { result } = renderHook(() => useProgress())
  act(() => { result.current.markComplete('basics/syntax') })
  act(() => { result.current.markIncomplete('basics/syntax') })
  expect(result.current.isComplete('basics/syntax')).toBe(false)
})

test('progress persists across hook re-renders', () => {
  const { result: r1 } = renderHook(() => useProgress())
  act(() => { r1.current.markComplete('basics/syntax') })
  const { result: r2 } = renderHook(() => useProgress())
  expect(r2.current.isComplete('basics/syntax')).toBe(true)
})

test('getProgress returns correct totals', () => {
  const { result } = renderHook(() => useProgress())
  act(() => {
    result.current.markComplete('basics/syntax')
    result.current.markComplete('basics/primitives')
  })
  const prog = result.current.getProgress(sections)
  expect(prog.completed).toBe(2)
  expect(prog.total).toBe(86)
  expect(prog.bySection['basics'].completed).toBe(2)
  expect(prog.bySection['basics'].total).toBe(13)
})

test('getProgress bySection is 0 for untouched sections', () => {
  const { result } = renderHook(() => useProgress())
  const prog = result.current.getProgress(sections)
  expect(prog.bySection['oop'].completed).toBe(0)
})
