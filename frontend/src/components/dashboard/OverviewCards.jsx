import Panel from '../ui/Panel'
import { formatCurrency } from '../../utils/formatters'

const cards = [
  {
    key: 'totalOwed',
    label: "You'll get back",
    tone: 'text-success',
  },
  {
    key: 'totalOwe',
    label: 'You need to pay',
    tone: 'text-danger',
  },
  {
    key: 'netBalance',
    label: 'Net balance',
    tone: 'text-primary',
  },
  {
    key: 'groupCount',
    label: 'Active groups',
    tone: 'text-slate-900',
    formatter: (value) => value,
  },
]

export default function OverviewCards({ overview }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Panel
          key={card.key}
          className="p-5 transition duration-200 hover:-translate-y-1 hover:shadow-soft"
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}>
            {card.formatter ? card.formatter(overview[card.key]) : formatCurrency(overview[card.key])}
          </p>
        </Panel>
      ))}
    </div>
  )
}
