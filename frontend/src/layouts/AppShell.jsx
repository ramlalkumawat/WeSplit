import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import BrandMark from '../components/layout/BrandMark'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import StatusBanner from '../components/ui/StatusBanner'
import { formatCurrency } from '../utils/formatters'

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Groups', to: '/groups' },
  { label: 'Onboarding', to: '/onboarding' },
]

function AppNavLink({ label, to, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-slate-950 text-white shadow-[0_16px_35px_rgba(15,23,42,0.14)]'
            : 'text-slate-600 hover:bg-white hover:text-slate-950'
        }`
      }
    >
      <span>{label}</span>
      {badge ? (
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">{badge}</span>
      ) : null}
    </NavLink>
  )
}

export default function AppShell() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { feedback, groups, overview } = useDashboardData()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-[-4rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-96 w-96 rounded-full bg-highlight/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-8">
            <BrandMark />
            <nav className="hidden items-center gap-2 lg:flex">
              {navigationItems.map((item) => (
                <AppNavLink
                  key={item.to}
                  badge={item.to === '/groups' && groups.length ? groups.length : undefined}
                  label={item.label}
                  to={item.to}
                />
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-[24px] border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-soft">
              <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
              <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 px-4 py-3 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="balance" size={18} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Net balance</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {formatCurrency(overview.netBalance, overview.primaryCurrency)}
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle app navigation"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="page-shell space-y-4 py-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
                <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
              </div>
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <Button className="w-full" onClick={handleLogout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="page-shell pb-12 pt-8" id="main-content">
        {feedback ? (
          <div className="mb-6">
            <StatusBanner message={feedback.message} tone={feedback.type || 'info'} />
          </div>
        ) : null}
        <Outlet />
      </main>
    </div>
  )
}
