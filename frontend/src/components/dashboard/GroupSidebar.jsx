import Button from '../ui/Button'
import Panel from '../ui/Panel'
import TextField from '../ui/TextField'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

export default function GroupSidebar({
  errors = {},
  form,
  groups,
  isLoading = false,
  isMutating,
  onChange,
  onSelectGroup,
  onSubmit,
  selectedGroupId,
}) {
  return (
    <div className="space-y-6">
      <Panel className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-badge">Groups</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Your groups</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage rent, trips, food orders, office spends, and shared daily bills in
              one place.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white shadow-soft">
            <p className="text-xl font-semibold">{groups.length}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">Groups</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`group-skeleton-${index}`}
                className="animate-pulse rounded-3xl border border-white/60 bg-white/70 p-4"
              >
                <div className="h-5 w-32 rounded-full bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                <div className="mt-4 h-4 w-40 rounded-full bg-slate-200" />
              </div>
            ))
          ) : groups.length ? (
            groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => onSelectGroup(group.id)}
                className={`w-full rounded-3xl border px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-soft ${
                  selectedGroupId === group.id
                    ? 'border-primary/20 bg-primary/10 shadow-soft'
                    : 'border-white/60 bg-white/70 hover:border-primary/15'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{group.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {group.description || 'No details added yet.'}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      group.yourBalance >= 0 ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
                    }`}
                  >
                    {formatCurrency(group.yourBalance, group.currency)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <span>{group.memberCount} members</span>
                  <span>{group.expenseCount} expenses</span>
                  <span>{formatDateTime(group.lastActivityAt)}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/6 px-4 py-6 text-sm text-slate-500">
              No groups yet. Create your first India-ready expense group below.
            </div>
          )}
        </div>
      </Panel>

      <Panel className="p-5 md:p-6">
        <p className="section-badge">Create Group</p>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          <TextField
            error={errors.name}
            label="Group name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Goa Trip"
          />
          <TextField
            error={errors.description}
            label="Description"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Stay, cabs, meals, shopping, and local travel"
            textarea
          />
          <TextField
            error={errors.memberEmails}
            helpText="Separate multiple email addresses with commas."
            label="Add members by email"
            name="memberEmails"
            value={form.memberEmails}
            onChange={onChange}
            placeholder="friend@gmail.com, flatmate@company.com"
          />
          <Button type="submit" className="w-full" disabled={isMutating} loading={isMutating}>
            Create Group
          </Button>
        </form>
      </Panel>
    </div>
  )
}
