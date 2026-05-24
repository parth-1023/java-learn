import { useState, useCallback } from 'react'

const BASE = 'https://judge0-ce.p.rapidapi.com'
const HOST = 'judge0-ce.p.rapidapi.com'
const LANG = 62 // Java

function headers(apiKey) {
  return {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': HOST,
  }
}

export function useJudge0() {
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = useCallback(async (code) => {
    const apiKey = import.meta.env.VITE_JUDGE0_API_KEY
    if (!apiKey) {
      setError('Add your Judge0 API key to .env to enable code execution.')
      return
    }

    setLoading(true)
    setOutput(null)
    setError(null)

    try {
      const submitRes = await fetch(
        `${BASE}/submissions?base64_encoded=false&wait=false`,
        {
          method: 'POST',
          headers: headers(apiKey),
          body: JSON.stringify({ language_id: LANG, source_code: code }),
        }
      )
      const { token } = await submitRes.json()

      let result
      do {
        await new Promise(r => setTimeout(r, 1000))
        const pollRes = await fetch(
          `${BASE}/submissions/${token}?base64_encoded=false`,
          { headers: headers(apiKey) }
        )
        result = await pollRes.json()
      } while (result.status.id < 3)

      if (result.stdout)              setOutput(result.stdout)
      else if (result.compile_output) setError(result.compile_output)
      else if (result.stderr)         setError(result.stderr)
      else if (result.status.id === 5) setError('Time limit exceeded.')
      else setError('Execution failed. Try again.')
    } catch {
      setError('Code execution unavailable. Check your connection or API key.')
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
