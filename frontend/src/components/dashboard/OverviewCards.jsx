import Panel from '../ui/Panel'
import Icon from '../ui/Icon'
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters'

const cards = [
  {
    key: 'totalOwed',
    label: "You'll receive",
    tone: 'text-success',
    icon: 'arrowUpRight',
  },
  {
    key: 'totalOwe',
    label: 'You owe',
    tone: 'text-danger',
    icon: 'receipt',
  },
  {
    key: 'netBalance',
    label: 'Net balance',
    tone: 'text-primary',
    icon: 'balance',
  },
  {
    key: 'groupCount',
    label: 'Active groups',
    tone: 'text-slate-900',
    formatter: (value) => value,
    icon: 'group',
  },
  {
    key: 'totalSettled',
    label: 'Settled so far',
    tone: 'text-slate-900',
    formatter: (value) => formatCompactCurrency(value),
    icon: 'check',
  },
  {
    key: 'pendingSettlements',
    label: 'Pending actions',
    tone: 'text-slate-900',
    formatter: (value) => value,
    icon: 'clock',
  },
]

export default function OverviewCards({ overview }) {
  return (
    <div className="space-y-4">
      {overview.hasMixedCurrencies ? (
        <div className="rounded-[24px] border border-primary/15 bg-primary/7 px-4 py-3 text-sm text-slate-600">
          Portfolio totals are shown in {overview.primaryCurrency} for the first currency set.
          Multi-currency groups are tracked separately inside each group workspace.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Panel
            key={card.key}
            className="p-6 transition duration-200 hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}>
                  {card.formatter
                    ? card.formatter(overview[card.key])
                    : formatCurrency(overview[card.key], overview.primaryCurrency)}
                </p>
              </div>
              <div className="rounded-2xl bg-primary/8 p-3 text-primary">
                <Icon name={card.icon} size={18} />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  )
}
