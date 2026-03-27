import { Link } from 'react-router-dom'
import { landingStats } from '../../data/landingContent'
import { useAuth } from '../../hooks/useAuth'
import Panel from '../ui/Panel'
import { getButtonClasses } from '../ui/buttonStyles'

export default function HeroSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="page-shell pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)]">
        <div>
          <p className="section-badge">Modern Shared Expense Platform</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-slate-950 md:text-6xl xl:text-7xl">
            Make group expenses feel like a product your team actually wants to use.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Wesplit turns a basic MERN expense tracker into a cleaner SaaS-style experience
            with public onboarding, protected workspaces, live balances, and a responsive
            flow that feels ready for scale.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className={getButtonClasses({ variant: 'primary' })}
              to={isAuthenticated ? '/dashboard' : '/signup'}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Create Your Account'}
            </Link>
            <a className={getButtonClasses({ variant: 'secondary' })} href="#features">
              Explore Features
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {landingStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-white/70 bg-white/88 p-5 shadow-soft"
              >
                <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-10 top-4 h-32 rounded-full bg-primary/12 blur-3xl" />
          <Panel className="relative overflow-hidden p-5 sm:p-6">
            <div className="rounded-[26px] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
                    Workspace Preview
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">Q2 Team Ops</h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/75">
                  4 active groups
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/8 p-4">
                  <p className="text-sm text-white/60">You’ll get back</p>
                  <p className="mt-3 text-3xl font-bold">₹4,520</p>
                  <p className="mt-2 text-sm text-emerald-300">2 groups are net positive</p>
                </div>
                <div className="rounded-[24px] bg-white/8 p-4">
                  <p className="text-sm text-white/60">Pending settle-ups</p>
                  <p className="mt-3 text-3xl font-bold">3</p>
                  <p className="mt-2 text-sm text-amber-300">Average completion in 2 min</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
              <div className="soft-card p-5">
                <p className="eyebrow">Recent activity</p>
                <div className="mt-5 space-y-3">
                  {[
                    'Flat rent split updated for March cycle',
                    'Goa trip cab expense added with custom shares',
                    'Office lunch group settled via one payment path',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="soft-card p-5">
                  <p className="eyebrow">Top group</p>
                  <h3 className="mt-4 text-xl font-bold text-slate-950">Bangalore Flat</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Rent, Wi-Fi, groceries, and utilities tracked in one place.
                  </p>
                </div>
                <div className="soft-card p-5">
                  <p className="eyebrow">Mobile-ready</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Add expenses from your phone, review balances on desktop, and keep the
                    same clean flow across breakpoints.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  )
}
