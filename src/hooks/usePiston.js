import { useState, useCallback } from 'react'

// Wandbox — free, no API key, CORS-enabled
// Docs: https://github.com/melpon/wandbox/blob/master/kennel/API.rst
const WANDBOX_URL = 'https://wandbox.org/api/compile.json'

export function usePiston() {
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = useCallback(async (code) => {
    setLoading(true)
    setOutput(null)
    setError(null)

    try {
      const res = await fetch(WANDBOX_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: 'openjdk-jdk-22+36',
          code,
        }),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        setError(`Execution failed: ${text.slice(0, 200)}`)
        return
      }

      // Compile error
      if (data.compiler_message) {
        setError(data.compiler_message)
      } else if (data.program_output) {
        setOutput(data.program_output)
      } else if (data.program_error) {
        setError(data.program_error)
      } else {
        setOutput('(no output)')
      }
    } catch (err) {
      setError(`Code execution unavailable: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setOutput(null)
    setError(null)
  }, [])

  return { run, output, error, loading, reset }
}
