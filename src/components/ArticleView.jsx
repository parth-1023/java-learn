import { useState, useCallback } from 'react'
import Markdown from 'react-markdown'
import ExampleBlock from './ExampleBlock'
import CodeEditor from './CodeEditor'

const MIN_HEIGHT = 120
const MAX_HEIGHT = 700
const DEFAULT_HEIGHT = 280

export default function ArticleView({ article, isComplete, onMarkDone, onMarkUndone }) {
  const [editorHeight, setEditorHeight] = useState(DEFAULT_HEIGHT)

  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = editorHeight

    const onMouseMove = (e) => {
      const delta = startY - e.clientY   // drag up → bigger editor
      const next = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + delta))
      setEditorHeight(next)
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
  }, [editorHeight])

  if (!article) return <div className="article-pane"><p className="placeholder">Select an article to begin.</p></div>

  return (
    <div className="content-area">
      <div className="article-pane">
        <div className="article-header-row">
          <div>
            <div className="article-meta">{article.id.replace('/', ' → ').toUpperCase()}</div>
            <h1 className="article-title">{article.title}</h1>
          </div>
          {isComplete ? (
            <button
              className="btn btn-yellow"
              onClick={() => onMarkUndone(article.id)}
              aria-label="mark undone"
            >
              ✓ MARK UNDONE
            </button>
          ) : (
            <button
              className="btn btn-yellow"
              onClick={() => onMarkDone(article.id)}
              aria-label="mark done"
            >
              ✓ MARK DONE
            </button>
          )}
        </div>

        <div className="article-body">
          <Markdown>{article.body}</Markdown>
        </div>

        {article.examples.map((ex, i) => (
          <ExampleBlock key={i} label={ex.label} code={ex.code} />
        ))}
      </div>

      {/* Drag handle */}
      <div className="editor-resize-handle" onMouseDown={handleDragStart} title="Drag to resize editor" />

      {/* Editor wrapper — height controlled by drag */}
      <div style={{ height: editorHeight, flexShrink: 0, overflow: 'hidden' }}>
        <CodeEditor starterCode={article.starterCode} />
      </div>
    </div>
  )
}
