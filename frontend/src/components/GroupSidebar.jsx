import GradientButton from './GradientButton'
import GlassPanel from './GlassPanel'
import { formatCurrency } from '../utils/formatters'

export default function GroupSidebar({
  groups,
  newGroupName,
  onAddGroup,
  onGroupNameChange,
  onSelectGroup,
  selectedGroupId,
  getGroupBalance,
}) {
  return (
    <GlassPanel className="p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-badge">Groups</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Shared spaces</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pick a group to see recent activity and balances update instantly.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white shadow-soft">
          <p className="text-xl font-semibold">{groups.length}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Active</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {groups.map((group) => {
          const balance = getGroupBalance(group.id)
          const isPositive = balance >= 0

          return (
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
                  <p className="mt-1 text-sm text-slate-500">{group.description}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isPositive ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
                  }`}
                >
                  {formatCurrency(balance)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                <span>{group.members} members</span>
                <span>{group.lastActivity}</span>
              </div>
            </button>
          )
        })}
      </div>

      <form className="mt-6 space-y-3" onSubmit={onAddGroup}>
        <label htmlFor="group-name" className="block text-sm font-semibold text-slate-700">
          Add a new group
        </label>
        <input
          id="group-name"
          type="text"
          value={newGroupName}
          onChange={(event) => onGroupNameChange(event.target.value)}
          placeholder="Team retreat"
          className="w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
        />
        <GradientButton className="w-full" type="submit">
          Create Group
        </GradientButton>
      </form>
    </GlassPanel>
  )
}
