import { getButtonClasses } from './buttonStyles'

export default function Button({
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      type={type}
      className={getButtonClasses({ variant, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
}
