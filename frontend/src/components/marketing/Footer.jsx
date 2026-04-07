import { Link } from 'react-router-dom'
import { footerLinks } from '../../data/landingContent'
import BrandMark from '../layout/BrandMark'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/84 py-12">
      <div className="page-shell grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_0.8fr_0.8fr]">
        <div className="max-w-lg">
          <BrandMark interactive={false} muted />
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Wesplit gives groups a cleaner way to log shared expenses, understand balances,
            and settle with confidence. Built for travel, homes, teams, and every money
            conversation that deserves better clarity.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Product</p>
          <div className="mt-4 space-y-3">
            {footerLinks.product.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm text-slate-600 transition hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Access</p>
          <div className="mt-4 space-y-3">
            {footerLinks.access.map((item) => (
              <Link
                key={item.href}
                className="block text-sm text-slate-600 transition hover:text-slate-950"
                to={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="page-shell mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <p>
          Designed & Developed by{' '}
          <a
            className="font-semibold text-slate-700 transition hover:text-primary"
            href="https://instagram.com/ramlalkumawat"
            rel="noreferrer"
            target="_blank"
          >
            Ramlal Kumawat
          </a>
        </p>
      </div>
    </footer>
  )
}
