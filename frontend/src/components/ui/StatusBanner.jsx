export default function StatusBanner({ tone = 'info', message }) {
  if (!message) {
    return null
  }

  const tones = {
    info: 'border-primary/15 bg-primary/10 text-primary',
    success: 'border-success/15 bg-success/10 text-success',
    error: 'border-danger/15 bg-danger/10 text-danger',
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${tones[tone]}`}>
      {message}
    </div>
  )
}
