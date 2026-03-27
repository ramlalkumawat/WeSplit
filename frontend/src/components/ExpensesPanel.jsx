import GlassPanel from './GlassPanel'
import { formatCurrency } from '../utils/formatters'

export default function ExpensesPanel({ expenses, selectedGroup }) {
  if (!selectedGroup) {
    return (
      <GlassPanel className="p-6">
        <p className="section-badge">Recent Activity</p>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">No group selected yet</h3>
        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
          Create a group on the left and the activity feed will populate with dummy
          expenses you can iterate on.
        </p>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <p className="section-badge">Recent Activity</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">{selectedGroup.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{selectedGroup.description}</p>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Last updated
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-700">{selectedGroup.lastActivity}</p>
        </div>
      </div>

      {expenses.length > 0 ? (
        <div className="mt-6 space-y-3">
          {expenses.map((expense) => {
            const isPositive = expense.direction === 'owed'

            return (
              <article
                key={expense.id}
                className="rounded-3xl border border-white/60 bg-white/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 flex h-11 w-11 items-center justify-center rounded-2xl ${
                          isPositive ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 fill-none stroke-current stroke-2"
                        >
                          <path
                            d={isPositive ? 'M12 5v14M5 12h14' : 'M5 12h14'}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <h4 className="text-base font-semibold text-slate-900">{expense.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{expense.note}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{expense.paidBy}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{expense.dateLabel}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={`text-2xl font-semibold ${
                        isPositive ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {formatCurrency(expense.amount)}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        isPositive ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
                      }`}
                    >
                      {isPositive ? "You'll get back" : 'You need to pay'}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-primary/25 bg-primary/6 px-6 py-12 text-center">
          <h4 className="text-xl font-semibold text-slate-900">No expenses in this group yet</h4>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Use the floating button to add a demo expense and watch the summary update.
          </p>
        </div>
      )}
    </GlassPanel>
  )
}
