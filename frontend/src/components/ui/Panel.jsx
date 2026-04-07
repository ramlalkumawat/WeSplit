export default function Panel({ children, className = '', ...props }) {
  return (
    <div className={`glass-panel min-w-0 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
