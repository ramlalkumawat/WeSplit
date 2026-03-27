export default function GlassPanel({ children, className = '' }) {
  return <div className={`glass-panel rounded-[28px] ${className}`.trim()}>{children}</div>
}
