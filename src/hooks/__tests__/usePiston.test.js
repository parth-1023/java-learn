import { renderHook, act } from '@testing-library/react'
import { usePiston } from '../usePiston'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockRun({ program_output = null, program_error = null, compiler_message = null } = {}) {
  fetch.mockResolvedValueOnce({
    text: async () => JSON.stringify({ program_output, program_error, compiler_message }),
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
  mockRun({ program_output: 'Hello, World!\n' })
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.output).toBe('Hello, World!\n')
  expect(result.current.error).toBeNull()
  expect(result.current.loading).toBe(false)
})

test('sets error on compile failure', async () => {
  mockRun({ compiler_message: 'error: ; expected' })
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {'))
  expect(result.current.error).toBe('error: ; expected')
  expect(result.current.output).toBeNull()
})

test('sets error on runtime stderr', async () => {
  mockRun({ program_error: 'Exception in thread "main" java.lang.NullPointerException' })
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.error).toBe('Exception in thread "main" java.lang.NullPointerException')
})

test('sets error on network failure', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'))
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  expect(result.current.error).toMatch(/unavailable/)
})

test('reset clears output and error', async () => {
  mockRun({ program_output: 'Hi\n' })
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  act(() => result.current.reset())
  expect(result.current.output).toBeNull()
  expect(result.current.error).toBeNull()
})

test('posts to Wandbox with correct payload', async () => {
  mockRun({ program_output: 'ok\n' })
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {}'))
  const [url, opts] = fetch.mock.calls[0]
  expect(url).toBe('https://wandbox.org/api/compile.json')
  const body = JSON.parse(opts.body)
  expect(body.compiler).toBe('openjdk-jdk-22+36')
})

test('renames public class to prog before sending', async () => {
  mockRun({ program_output: 'ok\n' })
  const { result } = renderHook(() => usePiston())
  await act(() => result.current.run('public class Main {\n  public static void main(String[] args) {}\n}'))
  const body = JSON.parse(fetch.mock.calls[0][1].body)
  expect(body.code).toContain('public class prog')
  expect(body.code).not.toContain('class Main')
})
