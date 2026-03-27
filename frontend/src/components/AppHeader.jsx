import GlassPanel from './GlassPanel'

export default function AppHeader({ selectedGroup, totalGroups, onLogout }) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <p className="section-badge">Expense Sharing SaaS MVP</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Wesplit
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
          Track shared costs, keep group balances transparent, and stay ready for the
          next split in one calm workspace.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <GlassPanel className="flex items-center gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Focus Group
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {selectedGroup?.name ?? 'Create your first group'}
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            {totalGroups} active
          </div>
        </GlassPanel>

        <button type="button" onClick={onLogout} className="ghost-button">
          Logout
        </button>
      </div>
    </header>
  )
}
