import { renderHook, act } from '@testing-library/react'
import { usePiston } from '../usePiston'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockRun(stdout, stderr = null, code = 0) {
  fetch.mockResolvedValueOnce({
    json: async () => ({ run: { stdout, stderr, code } }),
  })
}

test('starts with idle state', () => {
  const { result } = renderHook(() => usePiston())
  expect(result.current.loading).toBe(false)
  expect(result.current.output).toBeNull()
  expect(result.current.error).toBeNull()
})

test('sets loading while executing', async () => {
  fetch.mockImplementationOnce(() => new Promise(() => {})) // never resolves
  const { result } = renderHook(() => usePiston())
  act(() => { result.current.run('public class Main {}') })
  expect(result.current.loading).toBe(true)
})

test('sets output on successful execution', async () => {
  mockRun('Hello, World!\n')
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.output).toBe('Hello, World!\n')
  expect(result.current.error).toBeNull()
  expect(result.current.loading).toBe(false)
})

test('sets error on stderr output', async () => {
  mockRun(null, 'error: ; expected', 1)
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {'))
  expect(result.current.error).toBe('error: ; expected')
  expect(result.current.output).toBeNull()
})

test('sets error on network failure', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'))
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.error).toMatch(/unavailable/)
})

test('reset clears output and error', async () => {
  mockRun('Hi\n')
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  act(() => result.current.reset())
  expect(result.current.output).toBeNull()
  expect(result.current.error).toBeNull()
})

test('posts to Piston with correct payload', async () => {
  mockRun('ok\n')
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  const [url, opts] = fetch.mock.calls[0]
  expect(url).toBe('https://emkc.org/api/v2/piston/execute')
  const body = JSON.parse(opts.body)
  expect(body.language).toBe('java')
  expect(body.files[0].name).toBe('Main.java')
  expect(body.files[0].content).toBe('public class Main {}')
})
