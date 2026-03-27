export const getButtonClasses = ({ variant = 'primary', className = '' } = {}) => {
  const variants = {
    primary:
      'bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_100%)] text-white shadow-[0_18px_40px_rgba(15,118,110,0.2)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,118,110,0.25)]',
    secondary:
      'border border-slate-200 bg-white/90 text-slate-700 hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary',
    ghost: 'bg-transparent text-slate-700 hover:bg-white/75 hover:text-slate-950',
    danger: 'border border-danger/18 bg-danger/10 text-danger hover:-translate-y-0.5 hover:bg-danger/15',
  }

  return `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${className}`.trim()
}
