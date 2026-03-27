export default function Panel({ children, className = '', ...props }) {
  return (
    <div className={`glass-panel ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
