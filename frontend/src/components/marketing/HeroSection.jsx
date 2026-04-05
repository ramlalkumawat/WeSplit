import { Link } from 'react-router-dom'
import { heroStats, trustHighlights } from '../../data/landingContent'
import { useAuth } from '../../hooks/useAuth'
import { HeroProductVisual } from '../graphics/ProductVisuals'
import Icon from '../ui/Icon'
import { getButtonClasses } from '../ui/buttonStyles'

export default function HeroSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="page-shell pb-18 pt-10 md:pb-24 md:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.06fr)_minmax(380px,0.94fr)]">
        <div className="animate-fade-up">
          <p className="section-badge">Expense sharing with real financial clarity</p>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-extrabold tracking-tight text-slate-950 md:text-6xl xl:text-[4.45rem] xl:leading-[1.02]">
            Shared expenses finally feel organized, trustworthy, and ready to launch.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Wesplit helps groups track spend, understand balances, and settle faster with
            clean dashboards, guided onboarding, category-aware analytics, and secure
            account flows built for everyday use.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className={getButtonClasses({ variant: 'primary' })}
              to={isAuthenticated ? '/dashboard' : '/signup'}
            >
              {isAuthenticated ? 'Open Dashboard' : 'Start Free'}
              <Icon name="arrowUpRight" size={18} />
            </Link>
            <a className={getButtonClasses({ variant: 'secondary' })} href="#product">
              See Product Tour
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {trustHighlights.map((item) => (
              <div
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm text-slate-600 shadow-sm"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="check" size={14} />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="noise-border rounded-[24px] border border-white/70 bg-white/88 p-5 shadow-soft"
              >
                <p className="text-3xl font-extrabold text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-float-slow">
          <HeroProductVisual />
        </div>
      </div>
    </section>
  )
}
