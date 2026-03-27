export default function LoadingScreen({ label = 'Loading your Wesplit account...' }) {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center py-12">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center px-8 py-10 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
        <p className="mt-6 text-lg font-semibold text-slate-900">{label}</p>
        <p className="mt-2 text-sm text-slate-500">
          Preparing your workspace, balances, and secure Wesplit session.
        </p>
      </div>
    </div>
  )
}
