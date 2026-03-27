import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { landingNavItems } from '../../data/landingContent'
import BrandMark from '../layout/BrandMark'
import { getButtonClasses } from '../ui/buttonStyles'

export default function LandingNavbar() {
  const { isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <BrandMark />

        <nav className="hidden items-center gap-8 lg:flex">
          {landingNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link className={getButtonClasses({ variant: 'ghost' })} to="/login">
            Log in
          </Link>
          <Link
            className={getButtonClasses({ variant: 'primary' })}
            to={isAuthenticated ? '/dashboard' : '/signup'}
          >
            {isAuthenticated ? 'Open Dashboard' : 'Start Free'}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="space-y-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="page-shell flex flex-col gap-3 py-4">
            {landingNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
            <Link
              className={getButtonClasses({ variant: 'secondary' })}
              onClick={() => setIsOpen(false)}
              to="/login"
            >
              Log in
            </Link>
            <Link
              className={getButtonClasses({ variant: 'primary' })}
              onClick={() => setIsOpen(false)}
              to={isAuthenticated ? '/dashboard' : '/signup'}
            >
              {isAuthenticated ? 'Open Dashboard' : 'Start Free'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
