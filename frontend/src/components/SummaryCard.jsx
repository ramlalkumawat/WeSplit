import GlassPanel from './GlassPanel'
import { formatCurrency } from '../utils/formatters'

const toneClasses = {
  success: {
    icon: 'bg-success/12 text-success',
    value: 'text-success',
  },
  danger: {
    icon: 'bg-danger/12 text-danger',
    value: 'text-danger',
  },
  primary: {
    icon: 'bg-primary/12 text-primary',
    value: 'text-primary',
  },
}

const icons = {
  success: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="M19 12H5" strokeLinecap="round" />
      <path d="m11 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  primary: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path
        d="M5 14c0 3.314 3.134 6 7 6s7-2.686 7-6-3.134-6-7-6-7-2.686-7-6 3.134-6 7-6 7 2.686 7 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export default function SummaryCard({ label, amount, tone, caption }) {
  const styles = toneClasses[tone]

  return (
    <GlassPanel className="p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.icon}`}>
        {icons[tone]}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${styles.value}`}>
        {formatCurrency(amount)}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{caption}</p>
    </GlassPanel>
  )
}
