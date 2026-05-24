export default function ExampleBlock({ label, code }) {
  return (
    <div className="example-block">
      <div className="example-header">
        <span className="example-label">{label}</span>
        <span className="badge badge-yellow">JAVA</span>
      </div>
      <pre className="example-code"><code>{code}</code></pre>
    </div>
  )
}
