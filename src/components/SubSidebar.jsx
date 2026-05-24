export default function SubSidebar({
  section,
  currentArticleId,
  onArticleChange,
  isComplete,
  progress,
}) {
  const pct = progress.total > 0
    ? Math.round((progress.completed / progress.total) * 100)
    : 0

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">{section.fullName}</div>
        <div className="sidebar-rule" />
      </div>

      <ul className="article-list">
        {section.articles.map(article => {
          const done   = isComplete(article.id)
          const active = article.id === currentArticleId
          return (
            <li
              key={article.id}
              className={`article-item ${active ? 'active' : ''} ${done ? 'done' : ''}`}
              onClick={() => onArticleChange(article.id)}
            >
              <span className={`checkbox ${done ? 'checked' : ''} ${active ? 'active' : ''}`}>
                {done ? '✓' : ''}
              </span>
              <span className="article-name">{article.title}</span>
            </li>
          )
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="progress-label">
          <span>Progress</span>
          <span className="progress-count">{progress.completed} / {progress.total}</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </aside>
  )
}
