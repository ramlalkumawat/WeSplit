import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button'
import Panel from '../ui/Panel'
import TextField from '../ui/TextField'
import Icon from '../ui/Icon'
import { formatCurrency } from '../../utils/formatters'

const buildInitialForm = (suggestions, initialSuggestionId) => {
  const selectedSuggestion =
    suggestions.find((suggestion) => suggestion.id === initialSuggestionId) || suggestions[0] || null

  return {
    amount: selectedSuggestion ? selectedSuggestion.amount.toFixed(2) : '',
    note: '',
    suggestionId: selectedSuggestion?.id || '',
  }
}

export default function SettlementComposer({
  currency = 'INR',
  initialSuggestionId,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
  suggestions = [],
}) {
  const [form, setForm] = useState(() => buildInitialForm(suggestions, initialSuggestionId))
  const [error, setError] = useState('')

  const selectedSuggestion = useMemo(
    () => suggestions.find((suggestion) => suggestion.id === form.suggestionId) || null,
    [form.suggestionId, suggestions],
  )

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setError('')
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      amount:
        name === 'suggestionId'
          ? (suggestions.find((suggestion) => suggestion.id === value)?.amount || 0).toFixed(2)
          : currentForm.amount,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedSuggestion) {
      setError('Choose a settlement path before recording the payment.')
      return
    }

    const numericAmount = Number(form.amount)

    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a valid settlement amount greater than zero.')
      return
    }

    if (numericAmount > selectedSuggestion.amount) {
      setError('Settlement amount cannot be greater than the outstanding suggestion.')
      return
    }

    try {
      await onSubmit({
        paidByUserId: selectedSuggestion.fromUser.id,
        receivedByUserId: selectedSuggestion.toUser.id,
        amount: Number(numericAmount.toFixed(2)),
        note: form.note.trim(),
      })
      onClose()
    } catch (submissionError) {
      setError(submissionError.message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <Panel
        className="w-full max-w-3xl p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-badge">Record Settlement</p>
            <h3 className="mt-4 text-3xl font-semibold text-slate-900">Save a completed payment</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pick a suggested path, record the amount that was paid, and keep the activity
              trail accurate for everyone in the group.
            </p>
          </div>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Outstanding suggestions</p>
            {suggestions.length ? (
              suggestions.map((suggestion) => {
                const isActive = form.suggestionId === suggestion.id

                return (
                  <label
                    key={suggestion.id}
                    className={`block rounded-[26px] border p-4 transition ${
                      isActive
                        ? 'border-primary/25 bg-primary/7 shadow-soft'
                        : 'border-slate-200/70 bg-white/90'
                    }`}
                  >
                    <input
                      checked={isActive}
                      className="sr-only"
                      name="suggestionId"
                      onChange={handleChange}
                      type="radio"
                      value={suggestion.id}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-950">
                          {suggestion.fromUser.name} pays {suggestion.toUser.name}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Suggested outstanding amount {formatCurrency(suggestion.amount, currency)}
                        </p>
                      </div>
                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                        Recommended
                      </span>
                    </div>
                  </label>
                )
              })
            ) : (
              <div className="rounded-[26px] border border-dashed border-success/25 bg-success/6 px-4 py-6 text-sm text-slate-600">
                No settlements are pending right now. Your group looks balanced.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <TextField
              error={error && !selectedSuggestion ? error : ''}
              label="Settlement amount"
              min="0"
              name="amount"
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              type="number"
              value={form.amount}
            />

            <TextField
              helpText="Optional note like UPI transfer, bank transfer, or cash."
              label="Note"
              name="note"
              onChange={handleChange}
              placeholder="UPI transfer completed"
              textarea
              value={form.note}
            />

            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">What this does</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Recording a settlement updates balances, refreshes suggestions, and adds a
                    permanent payment event to the group history.
                  </p>
                </div>
              </div>
            </div>

            {error && selectedSuggestion ? (
              <div className="rounded-2xl border border-danger/15 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isSubmitting || !suggestions.length} loading={isSubmitting} type="submit">
                Record settlement
              </Button>
            </div>
          </div>
        </form>
      </Panel>
    </div>
  )
}
