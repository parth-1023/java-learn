export default function OutputPanel({ output, error, loading, height }) {
  return (
    <div className="output-strip" style={height != null ? { height } : undefined}>
      <span className="output-label">OUTPUT</span>

      {loading && (
        <span className="output-spinner" role="status" aria-label="running">
          ⟳
        </span>
      )}

      {!loading && output && (
        <span className="output-stdout">{output.replace(/\\n/g, '\n').trim()}</span>
      )}

      {!loading && error && (
        <span className="output-error">{error.replace(/\\n/g, '\n').trim()}</span>
      )}
    </div>
  )
}
