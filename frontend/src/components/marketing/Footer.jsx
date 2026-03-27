import { Link } from 'react-router-dom'
import { landingNavItems } from '../../data/landingContent'
import BrandMark from '../layout/BrandMark'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 py-10">
      <div className="page-shell flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-lg">
          <BrandMark interactive={false} muted />
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Wesplit is designed to make shared money flows feel organized, transparent,
            and modern across public onboarding and authenticated workspaces.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Product
            </p>
            <div className="mt-4 space-y-3">
              {landingNavItems.map((item) => (
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
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">
              Access
            </p>
            <div className="mt-4 space-y-3">
              <Link className="block text-sm text-slate-600 transition hover:text-slate-950" to="/login">
                Login
              </Link>
              <Link className="block text-sm text-slate-600 transition hover:text-slate-950" to="/signup">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500">
        <p>Designed & Developed by Ramlal Kumawat</p>
        <p className="mt-2">Instagram: @yourhandle</p>
      </div>
    </footer>
  )
}
