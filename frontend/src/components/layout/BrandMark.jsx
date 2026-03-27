import { Link } from 'react-router-dom'

export default function BrandMark({ className = '', interactive = true, muted = false }) {
  const wrapperClassName = `inline-flex items-center gap-3 ${className}`.trim()
  const label = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0f766e_0%,#0f172a_100%)] text-sm font-black tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(15,118,110,0.22)]">
        WS
      </span>
      <span>
        <span className={`block text-lg font-bold ${muted ? 'text-slate-900' : 'text-slate-950'}`}>
          Wesplit
        </span>
        <span className="block text-xs uppercase tracking-[0.22em] text-slate-400">
          Shared money, simplified
        </span>
      </span>
    </>
  )

  if (!interactive) {
    return <div className={wrapperClassName}>{label}</div>
  }

  return (
    <Link to="/" className={wrapperClassName}>
      {label}
    </Link>
  )
}
