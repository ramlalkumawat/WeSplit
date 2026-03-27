import Button from '../ui/Button'
import Panel from '../ui/Panel'
import TextField from '../ui/TextField'
import { formatCurrency, formatDateTime } from '../../utils/formatters'

function MemberBalancePill({ amount, currency }) {
  const tone = amount >= 0 ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {formatCurrency(amount, currency)}
    </span>
  )
}

export default function GroupWorkspace({
  currentUserId,
  detail,
  isLoading,
  isMutating,
  memberEmail,
  memberError,
  onMemberEmailChange,
  onOpenExpenseComposer,
  onRemoveMember,
  onSubmitMember,
}) {
  if (isLoading) {
    return (
      <Panel className="p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-32 rounded-full bg-slate-200" />
          <div className="h-10 w-2/3 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-3xl bg-slate-200" />
          <div className="h-56 rounded-3xl bg-slate-200" />
        </div>
      </Panel>
    )
  }

  if (!detail) {
    return (
      <Panel className="p-8">
        <p className="section-badge">Workspace</p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900">Create your first group</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Once you create a group, Wesplit will show balances, shared expenses, and
          settle-up suggestions in INR right here.
        </p>
      </Panel>
    )
  }

  const { balances, expenses, group, settlements, summary } = detail
  const balanceByUserId = balances.reduce((accumulator, entry) => {
    accumulator[entry.user.id] = entry
    return accumulator
  }, {})

  return (
    <div className="space-y-6">
      <Panel className="p-6 md:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="section-badge">Selected Group</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {group.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              {group.description ||
                'No details yet. Add rent, utility, travel, or food spends to bring this group to life.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Panel className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Last activity
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {formatDateTime(group.lastActivityAt)}
              </p>
            </Panel>
            <Button onClick={onOpenExpenseComposer} disabled={isMutating}>
              Add Expense
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-soft">
            <p className="text-sm text-white/65">Total spent</p>
            <p className="mt-3 text-3xl font-semibold">
              {formatCurrency(summary.totalExpenses, group.currency)}
            </p>
          </div>
          <div className="rounded-3xl border border-success/15 bg-success/10 p-5">
            <p className="text-sm text-slate-600">You'll get back</p>
            <p className="mt-3 text-3xl font-semibold text-success">
              {formatCurrency(summary.yourOwed, group.currency)}
            </p>
          </div>
          <div className="rounded-3xl border border-danger/15 bg-danger/10 p-5">
            <p className="text-sm text-slate-600">You need to pay</p>
            <p className="mt-3 text-3xl font-semibold text-danger">
              {formatCurrency(summary.yourOwe, group.currency)}
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Panel className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-badge">Members</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">Manage members</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add flatmates, friends, or teammates and keep each person's balance visible.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-slate-900">{member.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{member.email}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                    <span>{member.role}</span>
                    <span>{member.id === currentUserId ? 'You' : 'Member'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MemberBalancePill
                    amount={balanceByUserId[member.id]?.balance || 0}
                    currency={group.currency}
                  />
                  {group.isAdmin &&
                  member.id !== group.createdBy.id &&
                  member.id !== currentUserId ? (
                    <Button
                      variant="danger"
                      className="px-3 py-2 text-sm"
                      onClick={() => onRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {group.isAdmin ? (
            <form className="mt-6 space-y-4" onSubmit={onSubmitMember}>
              <TextField
                error={memberError}
                helpText="Invite someone who already has a Wesplit account."
                label="Invite by email"
                name="memberEmail"
                value={memberEmail}
                onChange={onMemberEmailChange}
                placeholder="friend@gmail.com"
              />
              <Button type="submit" disabled={isMutating} loading={isMutating}>
                Add Member
              </Button>
            </form>
          ) : null}
        </Panel>

        <Panel className="p-6">
          <p className="section-badge">Settlements</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Settle-up suggestions</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Best payment path based on live balances. Handy for quick UPI settle-ups.
          </p>

          <div className="mt-6 space-y-3">
            {settlements.length ? (
              settlements.map((settlement, index) => (
                <div
                  key={`${settlement.fromUser.id}-${settlement.toUser.id}-${index}`}
                  className="rounded-3xl border border-white/60 bg-white/70 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {settlement.fromUser.name} should pay {settlement.toUser.name}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-primary">
                    {formatCurrency(settlement.amount, group.currency)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-success/20 bg-success/8 px-4 py-6 text-sm text-slate-500">
                No settlements needed right now. Sab settled hai.
              </div>
            )}
          </div>
        </Panel>
      </div>

      <Panel className="p-6">
        <p className="section-badge">Recent Expenses</p>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">Latest expense activity</h3>
        <div className="mt-6 space-y-4">
          {expenses.length ? (
            expenses.map((expense) => (
              <article
                key={expense.id}
                className="rounded-3xl border border-white/60 bg-white/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{expense.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {expense.description || 'No extra note was added for this expense.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Paid by {expense.paidBy.name}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {expense.splitType === 'equal' ? 'Split equally' : 'Custom shares'}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {formatDateTime(expense.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-semibold text-slate-900">
                      {formatCurrency(expense.amount, group.currency)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
                      {expense.participants.map((participant) => (
                        <span
                          key={`${expense.id}-${participant.user.id}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
                        >
                          {participant.user.name}: {formatCurrency(participant.share, group.currency)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/6 px-4 py-8 text-sm text-slate-500">
              No expenses yet. Add rent, cab, food, or utility bills to generate balances.
            </div>
          )}
        </div>
      </Panel>
    </div>
  )
}
