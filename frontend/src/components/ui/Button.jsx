export default function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30',
    secondary:
      'border border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary',
    danger:
      'border border-danger/20 bg-danger/10 text-danger hover:-translate-y-0.5 hover:bg-danger/15',
  }

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
