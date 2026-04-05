import { Link } from 'react-router-dom'
import OverviewCards from '../components/dashboard/OverviewCards'
import PageMeta from '../components/seo/PageMeta'
import Icon from '../components/ui/Icon'
import Panel from '../components/ui/Panel'
import { getButtonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  formatCompactCurrency,
  formatCurrency,
  formatDateTime,
  formatPercentage,
} from '../utils/formatters'

export default function DashboardPage() {
  const { user } = useAuth()
  const { groups, isLoadingGroups, overview, selectedGroupDetail } = useDashboardData()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const spotlightGroups = groups.slice(0, 3)
  const focusGroup = selectedGroupDetail?.group
  const focusSummary = selectedGroupDetail?.summary
  const focusAnalytics = selectedGroupDetail?.analytics

  return (
    <div className="space-y-8">
      <PageMeta
        description="Review your shared expense dashboard, track balances, and jump into your most active groups inside Wesplit."
        title="Dashboard | Wesplit"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <Panel className="p-7 md:p-8">
          <p className="section-badge">Dashboard</p>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Welcome back, {firstName}. Your shared money command center is ready.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Track the groups that need attention, review balance movement, and jump from
            spend tracking to settle-up decisions without losing context.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className={getButtonClasses({ variant: 'primary' })} to="/groups">
              Manage Groups
            </Link>
            <Link
              className={getButtonClasses({ variant: 'secondary' })}
              to={groups[0] ? `/groups/${groups[0].id}` : '/onboarding'}
            >
              {groups[0] ? 'Open Latest Group' : 'Start Onboarding'}
            </Link>
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="eyebrow">Today at a glance</p>
          <div className="mt-5 space-y-4">
            {[
              `You are active in ${overview.groupCount} shared ${overview.groupCount === 1 ? 'group' : 'groups'}.`,
              `${overview.pendingSettlements} settle-up ${overview.pendingSettlements === 1 ? 'action is' : 'actions are'} still open.`,
              'Analytics and recent activity update as soon as expenses or settlements are recorded.',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <OverviewCards overview={overview} />

      {!groups.length ? (
        <Panel className="p-7 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
            <div>
              <p className="section-badge">Get Started</p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                No groups yet. Create your first shared workspace in a few minutes.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Wesplit is ready for homes, trips, and team expenses. Start onboarding to create
                the first group, invite members, and log the first expense.
              </p>
              <Link className={`mt-6 ${getButtonClasses({ variant: 'primary' })}`} to="/onboarding">
                Start onboarding
              </Link>
            </div>

            <div className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="spark" />
              </div>
              <p className="mt-5 text-xl font-bold text-slate-950">Your launch checklist</p>
              <div className="mt-5 space-y-3">
                {[
                  'Create the first group with a currency and purpose',
                  'Invite people who share the expenses',
                  'Add the first bill and unlock balances',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/10 text-success">
                      <Icon name="check" size={14} />
                    </span>
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_360px]">
        <Panel className="p-6 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-badge">Focus Group</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                {focusGroup ? focusGroup.name : 'The groups worth checking today.'}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                {focusGroup?.description ||
                  'Open your groups to review balances, members, and pending settle-up actions.'}
              </p>
            </div>
            <Link className={getButtonClasses({ variant: 'secondary' })} to="/groups">
              Open workspace
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {focusGroup && focusSummary ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_1.05fr]">
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-soft">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/50">Balance view</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] bg-white/8 p-4">
                      <p className="text-sm text-white/60">Total spent</p>
                      <p className="mt-3 text-3xl font-bold">
                        {formatCompactCurrency(focusSummary.totalExpenses, focusGroup.currency)}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-white/8 p-4">
                      <p className="text-sm text-white/60">Pending settle-ups</p>
                      <p className="mt-3 text-3xl font-bold">{focusSummary.pendingSettlements}</p>
                    </div>
                    <div className="rounded-[24px] bg-white/8 p-4">
                      <p className="text-sm text-white/60">You&apos;ll receive</p>
                      <p className="mt-3 text-2xl font-bold text-emerald-300">
                        {formatCurrency(focusSummary.yourOwed, focusGroup.currency)}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-white/8 p-4">
                      <p className="text-sm text-white/60">You owe</p>
                      <p className="mt-3 text-2xl font-bold text-amber-300">
                        {formatCurrency(focusSummary.yourOwe, focusGroup.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-soft">
                  <p className="text-sm font-semibold text-slate-700">Spend by category</p>
                  <div className="mt-5 space-y-4">
                    {focusAnalytics?.categoryBreakdown?.length ? (
                      focusAnalytics.categoryBreakdown.slice(0, 4).map((item) => (
                        <div key={item.category}>
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-600">{formatPercentage(item.shareOfSpend)}</p>
                          </div>
                          <div className="mt-2 h-3 rounded-full bg-slate-100">
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
                        Add expenses inside the group workspace to unlock category analytics.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : isLoadingGroups ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`dashboard-group-skeleton-${index}`}
                  className="animate-pulse rounded-[26px] border border-white/70 bg-white/88 p-5"
                >
                  <div className="h-5 w-40 rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                  <div className="mt-4 h-4 w-32 rounded-full bg-slate-200" />
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-primary/18 bg-primary/6 p-6">
                <p className="text-lg font-semibold text-slate-950">No groups yet</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Head to the groups workspace to create your first shared expense group.
                </p>
                <Link className={`mt-5 ${getButtonClasses({ variant: 'primary' })}`} to="/groups">
                  Create Your First Group
                </Link>
              </div>
            )}
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="section-badge">Recent activity</p>
          <div className="mt-5 space-y-4">
            {focusAnalytics?.recentActivity?.length ? (
              focusAnalytics.recentActivity.slice(0, 4).map((item) => (
                <div key={`${item.type}-${item.id}`} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-slate-950">{item.title}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.type === 'expense'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-success/10 text-success'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.subtitle}
                    {item.description ? ` | ${item.description}` : ''}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>{formatDateTime(item.createdAt)}</span>
                    <span>{formatCurrency(item.amount, focusGroup?.currency || 'INR')}</span>
                  </div>
                </div>
              ))
            ) : (
              [
                {
                  description:
                    'Create your first group to unlock real-time activity across expenses and settlements.',
                  title: 'No recent activity yet',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-base font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_360px]">
        <Panel className="p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-badge">Groups Snapshot</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                The groups worth checking next.
              </h2>
            </div>
            <Link className={getButtonClasses({ variant: 'secondary' })} to="/groups">
              View all groups
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {isLoadingGroups ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`dashboard-spotlight-skeleton-${index}`}
                  className="animate-pulse rounded-[26px] border border-white/70 bg-white/88 p-5"
                >
                  <div className="h-5 w-40 rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded-full bg-slate-200" />
                  <div className="mt-4 h-4 w-32 rounded-full bg-slate-200" />
                </div>
              ))
            ) : spotlightGroups.length ? (
              spotlightGroups.map((group) => (
                <article
                  key={group.id}
                  className="rounded-[26px] border border-white/70 bg-white/88 p-5 shadow-soft"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xl font-bold text-slate-950">{group.name}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        {group.description || 'No description added yet for this group.'}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                        <span>{group.memberCount} members</span>
                        <span>{group.expenseCount} expenses</span>
                        <span>{group.pendingSettlements || 0} pending</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <p
                        className={`text-xl font-bold ${
                          group.yourBalance >= 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {formatCurrency(group.yourBalance, group.currency)}
                      </p>
                      <Link
                        className={getButtonClasses({ variant: 'secondary' })}
                        to={`/groups/${group.id}`}
                      >
                        Open Group
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : null}
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="section-badge">Why this helps</p>
          <div className="mt-5 space-y-4">
            {[
              {
                description:
                  'The dashboard gives you one place to assess whether you should collect, pay, or review more detail.',
                title: 'Faster decisions',
              },
              {
                description:
                  'The group workspace now handles both new expenses and recorded settlements, not just suggested math.',
                title: 'Complete settlement flow',
              },
              {
                description:
                  'Category and monthly analytics explain spending patterns without burying the operational tasks.',
                title: 'Better visibility',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-base font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  )
}
