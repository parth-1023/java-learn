import { renderHook, act, waitFor } from '@testing-library/react'
import { useJudge0 } from '../useJudge0'

const MOCK_KEY = 'test-api-key'

beforeEach(() => {
  vi.stubEnv('VITE_JUDGE0_API_KEY', MOCK_KEY)
  vi.stubGlobal('fetch', vi.fn())
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function mockFetch(submitResponse, pollResponse) {
  fetch
    .mockResolvedValueOnce({ json: async () => submitResponse })
    .mockResolvedValueOnce({ json: async () => pollResponse })
}

test('starts with idle state', () => {
  const { result } = renderHook(() => useJudge0())
  expect(result.current.loading).toBe(false)
  expect(result.current.output).toBeNull()
  expect(result.current.error).toBeNull()
})

test('sets loading while executing', async () => {
  mockFetch({ token: 'abc' }, { status: { id: 3 }, stdout: 'Hello\n', stderr: null, compile_output: null })
  const { result } = renderHook(() => useJudge0())
  act(() => { result.current.run('public class Main {}') })
  expect(result.current.loading).toBe(true)
  await act(() => vi.runAllTimersAsync())
  expect(result.current.loading).toBe(false)
})

test('sets output on successful execution', async () => {
  mockFetch(
    { token: 'abc' },
    { status: { id: 3 }, stdout: 'Hello, World!\n', stderr: null, compile_output: null }
  )
  const { result } = renderHook(() => useJudge0())
  await act(async () => {
    const p = result.current.run('public class Main {}')
    await vi.runAllTimersAsync()
    await p
  })
  expect(result.current.output).toBe('Hello, World!\n')
  expect(result.current.error).toBeNull()
})

test('sets error on compile failure', async () => {
  mockFetch(
    { token: 'abc' },
    { status: { id: 6 }, stdout: null, stderr: null, compile_output: 'error: ; expected' }
  )
  const { result } = renderHook(() => useJudge0())
  await act(async () => {
    const p = result.current.run('public class Main {')
    await vi.runAllTimersAsync()
    await p
  })
  expect(result.current.error).toBe('error: ; expected')
  expect(result.current.output).toBeNull()
})

test('sets error when API key is missing', async () => {
  vi.stubEnv('VITE_JUDGE0_API_KEY', '')
  const { result } = renderHook(() => useJudge0())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.error).toMatch(/API key/)
  expect(fetch).not.toHaveBeenCalled()
})

test('sets error on network failure', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'))
  const { result } = renderHook(() => useJudge0())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.error).toMatch(/unavailable/)
})

test('reset clears output and error', async () => {
  mockFetch(
    { token: 'abc' },
    { status: { id: 3 }, stdout: 'Hi\n', stderr: null, compile_output: null }
  )
  const { result } = renderHook(() => useJudge0())
  await act(async () => {
    const p = result.current.run('public class Main {}')
    await vi.runAllTimersAsync()
    await p
  })
  act(() => result.current.reset())
  expect(result.current.output).toBeNull()
  expect(result.current.error).toBeNull()
})
