export default function LoadingScreen({ label = 'Loading your Wesplit account...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center rounded-[28px] px-8 py-10 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-6 text-lg font-semibold text-slate-900">{label}</p>
        <p className="mt-2 text-sm text-slate-500">
          Preparing your groups, balances, and settle-up data in INR.
        </p>
      </div>
    </div>
  )
}
