export default function GradientButton({
  children,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={`gradient-button ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
