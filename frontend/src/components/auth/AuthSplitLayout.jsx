import { Link } from 'react-router-dom'
import BrandMark from '../layout/BrandMark'
import Panel from '../ui/Panel'

export default function AuthSplitLayout({
  badge,
  description,
  highlights,
  title,
  children,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-6rem] top-[-8rem] h-72 w-72 rounded-full bg-primary/16 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-80 w-80 rounded-full bg-highlight/16 blur-3xl" />
      </div>

      <div className="page-shell py-6 sm:py-8">
        <div className="flex items-center justify-between gap-4">
          <BrandMark />
          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:mt-12 lg:grid-cols-[1fr_minmax(0,460px)]">
          <Panel className="overflow-hidden p-8 md:p-10">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <p className="section-badge">{badge}</p>
                <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">{description}</p>
              </div>

              <div className="grid gap-3">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-[26px] border border-white/70 bg-white/86 p-5 shadow-soft"
                  >
                    <p className="text-sm font-semibold text-slate-900">{highlight.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel className="p-8 md:p-10">{children}</Panel>
        </div>
      </div>
    </div>
  )
}
