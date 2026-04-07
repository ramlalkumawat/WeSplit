import Button from '../ui/Button'
import Panel from '../ui/Panel'
import TextField from '../ui/TextField'
import Icon from '../ui/Icon'
import { expenseCategoryMap } from '../../data/financeOptions'
import {
  formatCompactCurrency,
  formatCurrency,
  formatDateTime,
  formatPercentage,
  formatRelativeDate,
} from '../../utils/formatters'

function MemberBalancePill({ amount, currency }) {
  const tone = amount >= 0 ? 'bg-success/12 text-success' : 'bg-danger/12 text-danger'
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      {formatCurrency(amount, currency)}
    </span>
  )
}

function SummaryTile({ label, value, tone = 'text-slate-950', icon }) {
  return (
    <div className="min-w-0 rounded-[26px] border border-slate-200/70 bg-white/88 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{label}</p>
          <p className={`mt-3 text-3xl font-semibold ${tone}`}>{value}</p>
        </div>
        <div className="rounded-2xl bg-primary/8 p-3 text-primary">
          <Icon name={icon} size={18} />
        </div>
      </div>
    </div>
  )
}

function ResponsiveContainer({ children, className = '' }) {
  return <div className={`h-full w-full overflow-hidden ${className}`.trim()}>{children}</div>
}

function MonthlyActivityChart({ currency, items = [] }) {
  const maxValue = Math.max(...items.map((item) => item.activityTotal), 0)

  if (!items.length) {
    return (
      <div className="flex h-full items-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
        Add a few expenses or settlements to unlock monthly activity trends.
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-4">
      <div
        className="grid flex-1 min-h-0 gap-3"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const expenseHeight = maxValue ? (item.expenseTotal / maxValue) * 100 : 0
          const settlementHeight = maxValue ? (item.settlementTotal / maxValue) * 100 : 0

          return (
            <div key={item.key} className="flex min-w-0 flex-col justify-end gap-3">
              <div className="flex min-h-0 flex-1 items-end justify-center gap-2 rounded-[22px] bg-slate-50/80 px-2 py-4 sm:px-3">
                <div className="flex h-full w-3 items-end rounded-full bg-primary/10 sm:w-4">
                  <div
                    className="w-full rounded-full bg-primary"
                    style={{ height: `${Math.max(expenseHeight, 8)}%` }}
                  />
                </div>
                <div className="flex h-full w-3 items-end rounded-full bg-success/10 sm:w-4">
                  <div
                    className="w-full rounded-full bg-success"
                    style={{ height: `${Math.max(settlementHeight, item.settlementTotal ? 8 : 0)}%` }}
                  />
                </div>
              </div>
              <div className="w-full text-center">
                <p className="truncate text-sm font-semibold text-slate-700">{item.label}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatCompactCurrency(item.activityTotal, currency)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Expenses
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          Settlements
        </span>
      </div>
    </div>
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
  onOpenSettlementComposer,
  onRemoveMember,
  onShareGroupSummary,
  onShareSettlementReminder,
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

  const {
    analytics,
    balances,
    expenses,
    group,
    settlementRecords,
    settlements,
    summary,
  } = detail
  const balanceByUserId = balances.reduce((accumulator, entry) => {
    accumulator[entry.user.id] = entry
    return accumulator
  }, {})

  return (
    <div className="min-w-0 space-y-6">
      <Panel className="p-6 md:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl min-w-0">
            <p className="section-badge">Selected Group</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {group.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              {group.description ||
                'No details yet. Add rent, utility, travel, or food spends to bring this group to life.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
              <span>{group.currency}</span>
              <span>{group.members.length} members</span>
              <span>{summary.expenseCount} expenses</span>
              <span>{summary.settlementCount} settlements</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 xl:w-auto">
            <Panel className="w-full px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Last activity
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {formatDateTime(group.lastActivityAt)}
              </p>
            </Panel>
            <div className="flex flex-col justify-end gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                className="w-full sm:w-auto"
                disabled={isMutating}
                onClick={onShareGroupSummary}
                variant="secondary"
              >
                <Icon name="message" size={18} />
                Share on WhatsApp
              </Button>
              <Button className="w-full sm:w-auto" onClick={onOpenExpenseComposer} disabled={isMutating}>
                Add Expense
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={!settlements.length}
                onClick={() => onOpenSettlementComposer(settlements[0]?.id)}
                variant="secondary"
              >
                Record Settlement
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryTile
            icon="wallet"
            label="Total spent"
            value={formatCurrency(summary.totalExpenses, group.currency)}
          />
          <SummaryTile
            icon="check"
            label="Settled so far"
            value={formatCurrency(summary.totalSettled, group.currency)}
          />
          <SummaryTile
            icon="arrowUpRight"
            label="You'll receive"
            tone="text-success"
            value={formatCurrency(summary.yourOwed, group.currency)}
          />
          <SummaryTile
            icon="clock"
            label="You owe"
            tone="text-danger"
            value={formatCurrency(summary.yourOwe, group.currency)}
          />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Panel className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-badge">Analytics</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">Where group money is moving</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Category mix and monthly movement help everyone understand the story behind the numbers.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0 rounded-[28px] border border-slate-200/70 bg-white/88 p-5">
              <p className="text-sm font-semibold text-slate-700">Category breakdown</p>
              <div className="mt-5 space-y-4">
                {analytics.categoryBreakdown.length ? (
                  analytics.categoryBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{formatPercentage(item.shareOfSpend)}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          {formatCurrency(item.total, group.currency)}
                        </p>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: item.color,
                            width: `${Math.max(item.shareOfSpend, 6)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Add expenses to see which categories are driving the group&apos;s spend.
                  </p>
                )}
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/88 p-5">
              <p className="text-sm font-semibold text-slate-700">Monthly activity</p>
              <ResponsiveContainer className="mt-5 h-[300px] sm:h-[350px] md:h-[400px]">
                <MonthlyActivityChart currency={group.currency} items={analytics.monthlyActivity} />
              </ResponsiveContainer>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-badge">Settlements</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">Recommended payment paths</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                These suggestions use live balances and recorded settlements to reduce unnecessary transfers.
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={!settlements.length}
              onClick={() => onOpenSettlementComposer(settlements[0]?.id)}
              variant="secondary"
            >
              Record payment
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {settlements.length ? (
              settlements.map((settlement) => (
                <div
                  key={settlement.id}
                  className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-soft"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-950">
                        {settlement.fromUser.name} should pay {settlement.toUser.name}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        This clears an outstanding balance using the current optimal path.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <p className="text-2xl font-semibold text-primary">
                        {formatCurrency(settlement.amount, group.currency)}
                      </p>
                      <Button
                        className="w-full px-4 py-2.5 sm:w-auto"
                        onClick={() => onShareSettlementReminder(settlement.id)}
                        variant="ghost"
                      >
                        <Icon name="message" size={18} />
                        WhatsApp reminder
                      </Button>
                      <Button
                        className="w-full px-4 py-2.5 sm:w-auto"
                        onClick={() => onOpenSettlementComposer(settlement.id)}
                        variant="secondary"
                      >
                        Mark settled
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-success/25 bg-success/8 px-4 py-6 text-sm text-slate-500">
                No payments are pending right now. The group is already settled.
              </div>
            )}
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-700">Recent settlement history</p>
            <div className="mt-4 space-y-3">
              {settlementRecords.length ? (
                settlementRecords.slice(0, 4).map((record) => (
                  <div
                    key={record.id}
                    className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {record.paidBy.name} paid {record.receivedBy.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {record.note || 'Settlement recorded without an additional note.'}
                        </p>
                      </div>
                        <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(record.amount, group.currency)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{formatRelativeDate(record.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No settlements have been recorded yet.</p>
              )}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Panel className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-badge">Members</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">Member balances and access</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep every member visible, along with how much they paid, owe, settled, or should receive.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {group.members.map((member) => {
              const financialEntry = balanceByUserId[member.id]

              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/88 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900">{member.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{member.email}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      <span>{member.role}</span>
                      <span>{member.id === currentUserId ? 'You' : 'Member'}</span>
                      <span>Joined {formatRelativeDate(member.joinedAt)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Paid {formatCurrency(financialEntry?.paid || 0, group.currency)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Owes {formatCurrency(financialEntry?.owes || 0, group.currency)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        Settled {formatCurrency(financialEntry?.settled || 0, group.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <MemberBalancePill
                      amount={financialEntry?.balance || 0}
                      currency={group.currency}
                    />
                    {group.isAdmin &&
                    member.id !== group.createdBy.id &&
                    member.id !== currentUserId ? (
                      <Button
                        variant="danger"
                        className="w-full px-3 py-2 text-sm sm:w-auto"
                        onClick={() => onRemoveMember(member.id)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              )
            })}
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
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isMutating}
                loading={isMutating}
              >
                Add Member
              </Button>
            </form>
          ) : null}
        </Panel>

        <Panel className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="section-badge">Recent activity</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">Expenses and payment history</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A combined feed makes it easy to explain what changed and why balances moved.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.recentActivity.length ? (
              analytics.recentActivity.map((item) => (
                <article
                  key={`${item.type}-${item.id}`}
                  className="rounded-[28px] border border-white/70 bg-white/88 p-4 shadow-soft"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.type === 'expense'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {item.type === 'expense' ? 'Expense' : 'Settlement'}
                        </span>
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.subtitle}
                        {item.description ? ` | ${item.description}` : ''}
                      </p>
                      {item.type === 'expense' ? (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background:
                                expenseCategoryMap[item.category]?.color || expenseCategoryMap.other.color,
                            }}
                          />
                          {expenseCategoryMap[item.category]?.label || 'Other'}
                        </div>
                      ) : null}
                    </div>

                    <p className="text-left text-2xl font-semibold text-slate-950 lg:text-right">
                      {formatCurrency(item.amount, group.currency)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-primary/20 bg-primary/6 px-4 py-8 text-sm text-slate-500">
                No activity yet. Add the first expense to bring the group timeline to life.
              </div>
            )}
          </div>

          {expenses.length ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-700">Latest expense splits</p>
              <div className="mt-4 space-y-3">
                {expenses.slice(0, 4).map((expense) => (
                  <div
                    key={expense.id}
                    className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{expense.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Paid by {expense.paidBy.name} | {expense.splitType === 'equal' ? 'Equal split' : 'Custom split'}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(expense.amount, group.currency)}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
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
                ))}
              </div>
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  )
}
