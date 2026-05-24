import Markdown from 'react-markdown'
import ExampleBlock from './ExampleBlock'
import CodeEditor from './CodeEditor'

export default function ArticleView({ article, isComplete, onMarkDone, onMarkUndone }) {
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

      <CodeEditor starterCode={article.starterCode} />
    </div>
  )
}
