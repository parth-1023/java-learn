export default function TopNav({
  sections,
  currentSectionId,
  onSectionChange,
  progress,
  isDark,
  onThemeToggle,
}) {
  return (
    <nav className="topnav">
      <div className="logo">
        JAVA<span className="logo-dot">_</span>LEARN
      </div>

      {sections.map(section => {
        const sp = progress.bySection[section.id]
        const isDone = sp.completed === sp.total && sp.total > 0
        const isActive = section.id === currentSectionId
        return (
          <button
            key={section.id}
            className={`nav-tab ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            {isDone && <span>✓ </span>}
            {section.label}
          </button>
        )
      })}

      <div className="nav-spacer" />

      <button
        className="theme-toggle"
        onClick={onThemeToggle}
        aria-label="theme toggle"
      >
        <span>{isDark ? '☀' : '☾'}</span>
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
      </button>

      <div className="progress-chip">
        {progress.completed}/{progress.total} DONE
      </div>
    </nav>
  )
}
