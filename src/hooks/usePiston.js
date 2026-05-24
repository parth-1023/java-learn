import { useState, useCallback } from 'react'

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute'

export function usePiston() {
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = useCallback(async (code) => {
    setLoading(true)
    setOutput(null)
    setError(null)

    try {
      const res = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'java',
          version: '*',
          files: [{ name: 'Main.java', content: code }],
        }),
      })

      const data = await res.json()
      const { stdout, stderr, code: exitCode } = data.run

      if (stdout) setOutput(stdout)
      else if (stderr) setError(stderr)
      else if (exitCode !== 0) setError('Program exited with a non-zero status.')
      else setOutput('(no output)')
    } catch {
      setError('Code execution unavailable. Check your connection.')
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
