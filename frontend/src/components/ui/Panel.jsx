export default function Panel({ children, className = '' }) {
  return <div className={`glass-panel rounded-[28px] ${className}`.trim()}>{children}</div>
}
