import { Link } from 'react-router-dom'
import OverviewCards from '../components/dashboard/OverviewCards'
import Panel from '../components/ui/Panel'
import { getButtonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import { formatCurrency, formatDateTime } from '../utils/formatters'

export default function DashboardPage() {
  const { user } = useAuth()
  const { groups, isLoadingGroups, overview } = useDashboardData()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const spotlightGroups = groups.slice(0, 3)

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <Panel className="p-7 md:p-8">
          <p className="section-badge">Dashboard</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Welcome back, {firstName}. Your shared money system is ready.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Track active groups, open the ones that need attention, and move from raw
            expenses to clear settle-up decisions with a more polished Wesplit workflow.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className={getButtonClasses({ variant: 'primary' })} to="/groups">
              Manage Groups
            </Link>
            <Link
              className={getButtonClasses({ variant: 'secondary' })}
              to={groups[0] ? `/groups/${groups[0].id}` : '/groups'}
            >
              Open Latest Group
            </Link>
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="eyebrow">Product upgrade</p>
          <div className="mt-5 space-y-4">
            {[
              'Landing, auth, and app areas now follow one consistent design system.',
              'Protected routes keep dashboard and group data behind authenticated sessions.',
              'Reusable components make the UI easier to extend as the product grows.',
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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_360px]">
        <Panel className="p-6 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-badge">Groups Snapshot</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                The groups worth checking today.
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
                  key={`dashboard-group-skeleton-${index}`}
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
                        <span>{formatDateTime(group.lastActivityAt)}</span>
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
          <p className="section-badge">Why this feels better</p>
          <div className="mt-5 space-y-4">
            {[
              {
                description:
                  'Public discovery and CTA flow makes the app feel like a product, not just a utility screen.',
                title: 'Stronger first impression',
              },
              {
                description:
                  'Dashboard and groups are separated so high-level overview and operational work each have room to breathe.',
                title: 'Cleaner route architecture',
              },
              {
                description:
                  'Responsive layout choices keep the same product identity on mobile, tablet, and desktop.',
                title: 'Mobile-first experience',
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
