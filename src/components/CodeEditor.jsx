import { useRef, useState, useEffect, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { usePiston } from '../hooks/usePiston'
import OutputPanel from './OutputPanel'

const MIN_OUTPUT = 32
const MAX_OUTPUT = 300
const DEFAULT_OUTPUT = 40

export default function CodeEditor({ starterCode }) {
  const editorRef = useRef(null)
  const [code, setCode] = useState(starterCode)
  const [outputHeight, setOutputHeight] = useState(DEFAULT_OUTPUT)
  const { run, reset, output, error, loading } = usePiston()

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

  const handleOutputDragStart = useCallback((e) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = outputHeight

    const onMouseMove = (e) => {
      const delta = startY - e.clientY  // drag up → taller output
      const next = Math.max(MIN_OUTPUT, Math.min(MAX_OUTPUT, startHeight + delta))
      setOutputHeight(next)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [outputHeight])

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

      {/* Output resize handle */}
      <div
        className="output-resize-handle"
        onMouseDown={handleOutputDragStart}
        title="Drag to resize output"
      />

      <OutputPanel output={output} error={error} loading={loading} height={outputHeight} />
    </div>
  )
}
