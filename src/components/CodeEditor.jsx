import { useRef, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useJudge0 } from '../hooks/useJudge0'
import OutputPanel from './OutputPanel'

export default function CodeEditor({ starterCode }) {
  const editorRef = useRef(null)
  const [code, setCode] = useState(starterCode)
  const { run, reset, output, error, loading } = useJudge0()

  // Reset editor content when the article changes
  useEffect(() => {
    setCode(starterCode)
    reset()
  }, [starterCode])

  function handleEditorMount(editor) {
    editorRef.current = editor
  }

  async function handleRun() {
    const current = editorRef.current?.getValue() ?? code
    await run(current)
  }

  function handleReset() {
    setCode(starterCode)
    editorRef.current?.setValue(starterCode)
    reset()
  }

  return (
    <div className="editor-pane">
      <div className="editor-toolbar">
        <div className="editor-label">
          <span className="editor-label-text">Practice Editor</span>
          <span className="badge badge-yellow">JAVA</span>
        </div>
        <div className="editor-actions">
          <button className="btn btn-primary" onClick={handleRun} disabled={loading}>
            {loading ? '⟳ RUNNING…' : '▶ RUN'}
          </button>
          <button className="btn" onClick={handleReset} disabled={loading}>
            ↺ RESET
          </button>
        </div>
      </div>

      <div className="editor-body">
        <Editor
          height="100%"
          defaultLanguage="java"
          value={code}
          onChange={val => setCode(val ?? '')}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            padding: { top: 12 },
          }}
        />
      </div>

      <OutputPanel output={output} error={error} loading={loading} />
    </div>
  )
}
