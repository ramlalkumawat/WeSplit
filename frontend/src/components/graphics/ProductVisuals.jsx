import Icon from '../ui/Icon'

function MiniBar({ color, height }) {
  return (
    <div className="flex flex-1 items-end">
      <div
        className="w-full rounded-t-[14px]"
        style={{
          background: color,
          height,
        }}
      />
    </div>
  )
}

export function HeroProductVisual() {
  return (
    <div className="relative">
      <div className="absolute inset-x-8 top-10 h-40 rounded-full bg-primary/16 blur-3xl" />
      <div className="relative rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,248,255,0.94))] p-4 shadow-[0_36px_110px_rgba(17,24,39,0.18)] backdrop-blur-xl sm:p-6">
        <div className="rounded-[30px] bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                Active workspace
              </p>
              <h3 className="mt-3 text-2xl font-bold">Goa House Trip</h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold text-white/75">
              7 members
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-[26px] border border-white/10 bg-white/6 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Net balance snapshot</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-300">Rs 8,420</p>
                </div>
                <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-200">
                  <Icon name="balance" size={22} />
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] bg-white/8 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Spend</p>
                  <p className="mt-2 text-lg font-semibold">Rs 46,300</p>
                </div>
                <div className="rounded-[22px] bg-white/8 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Settled</p>
                  <p className="mt-2 text-lg font-semibold">Rs 18,920</p>
                </div>
                <div className="rounded-[22px] bg-white/8 p-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Pending</p>
                  <p className="mt-2 text-lg font-semibold">3 actions</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm text-white/60">Category mix</p>
              <div className="mt-5 flex h-36 items-end gap-3">
                <MiniBar color="#155EEF" height="88px" />
                <MiniBar color="#F79009" height="60px" />
                <MiniBar color="#12B76A" height="44px" />
                <MiniBar color="#7A5AF8" height="92px" />
                <MiniBar color="#EF6820" height="54px" />
              </div>
              <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
                <span>Housing</span>
                <span>Food</span>
                <span>Travel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-7 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Activity feed
                </p>
                <h4 className="mt-2 text-xl font-bold text-slate-950">Latest money movement</h4>
              </div>
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Icon name="refresh" size={20} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  title: 'Villa booking added',
                  note: 'Paid by Aditi, split between 7 travellers',
                },
                {
                  title: 'UPI settlement recorded',
                  note: 'Raghav paid Mehak Rs 2,400',
                },
                {
                  title: 'Airport cabs updated',
                  note: 'Transport category now leads this week',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-slate-200/70 bg-slate-50/80 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">Suggested settlement</p>
                <Icon className="text-success" name="lightning" size={18} />
              </div>
              <p className="mt-3 text-xl font-bold text-slate-950">Pay one person, close three balances.</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Wesplit reduces overlapping debts into the smallest sensible payment path.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(21,94,239,0.08),rgba(14,116,144,0.1))] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
                  <Icon name="shield" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">Secure by default</p>
                  <p className="text-sm text-slate-600">JWT sessions, validation, and graceful errors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthInsightVisual() {
  return (
    <div className="rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(8,15,33,0.98),rgba(15,23,42,0.96))] p-6 text-white shadow-[0_28px_90px_rgba(2,6,23,0.3)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Financial clarity
          </p>
          <h3 className="mt-3 text-2xl font-bold">Know your next action in seconds.</h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-emerald-200">
          <Icon name="analytics" size={22} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="text-sm text-white/60">This month</p>
          <p className="mt-3 text-3xl font-bold">Rs 23,480</p>
          <p className="mt-2 text-sm text-emerald-300">6 expenses logged, 2 settlements cleared.</p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="text-sm text-white/60">Balance summary</p>
          <p className="mt-3 text-3xl font-bold text-amber-300">3 pending</p>
          <p className="mt-2 text-sm text-white/65">Optimized into two recommended settle-up actions.</p>
        </div>
      </div>
    </div>
  )
}
