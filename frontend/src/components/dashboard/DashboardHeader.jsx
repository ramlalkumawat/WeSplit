import Button from '../ui/Button'
import Panel from '../ui/Panel'

export default function DashboardHeader({ user, onLogout }) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <p className="section-badge">India-Ready Expense Sharing</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Wesplit
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
          Welcome back, {user?.name}. Track flat rent, Goa trips, office lunches, and
          daily kharchas in a clean INR-first workspace.
        </p>
      </div>

      <Panel className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{user?.email}</p>
          <p className="mt-1 text-xs text-slate-500">All balances are shown in Indian Rupees</p>
        </div>
        <Button variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </Panel>
    </header>
  )
}
