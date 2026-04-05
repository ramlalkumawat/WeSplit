import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Panel from '../ui/Panel'
import TextField from '../ui/TextField'
import { formatCurrency } from '../../utils/formatters'
import { expenseCategoryOptions } from '../../data/financeOptions'
import Icon from '../ui/Icon'

function buildEqualShares(amount, participantIds) {
  const numericAmount = Number(amount || 0)

  if (!numericAmount || !participantIds.length) {
    return {}
  }

  const totalCents = Math.round(numericAmount * 100)
  const baseShareCents = Math.floor(totalCents / participantIds.length)
  const remainder = totalCents % participantIds.length

  return participantIds.reduce((accumulator, participantId, index) => {
    accumulator[participantId] = ((baseShareCents + (index < remainder ? 1 : 0)) / 100).toFixed(2)
    return accumulator
  }, {})
}

function buildInitialForm(members, currentUserId) {
  const participantUserIds = members.map((member) => member.id)
  const defaultPayer =
    members.find((member) => member.id === currentUserId)?.id || members[0]?.id || ''

  return {
    title: '',
    description: '',
    amount: '',
    category: 'other',
    paidByUserId: defaultPayer,
    participantUserIds,
    splitType: 'equal',
    customShares: buildEqualShares('', participantUserIds),
  }
}

export default function ExpenseComposer({
  currentUserId,
  currency = 'INR',
  isOpen,
  isSubmitting,
  members,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => buildInitialForm(members, currentUserId))
  const [error, setError] = useState('')

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

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    setError('')
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      customShares:
        name === 'amount' && currentForm.splitType === 'custom'
          ? buildEqualShares(value, currentForm.participantUserIds)
          : currentForm.customShares,
    }))
  }

  const handleToggleParticipant = (memberId) => {
    setError('')
    setForm((currentForm) => {
      const participantUserIds = currentForm.participantUserIds.includes(memberId)
        ? currentForm.participantUserIds.filter((participantId) => participantId !== memberId)
        : [...currentForm.participantUserIds, memberId]

      return {
        ...currentForm,
        participantUserIds,
        customShares:
          currentForm.splitType === 'custom'
            ? buildEqualShares(currentForm.amount, participantUserIds)
            : currentForm.customShares,
      }
    })
  }

  const handleSplitTypeChange = (nextSplitType) => {
    setError('')
    setForm((currentForm) => ({
      ...currentForm,
      splitType: nextSplitType,
      customShares:
        nextSplitType === 'custom'
          ? buildEqualShares(currentForm.amount, currentForm.participantUserIds)
          : currentForm.customShares,
    }))
  }

  const handleCustomShareChange = (memberId, value) => {
    setError('')
    setForm((currentForm) => ({
      ...currentForm,
      customShares: {
        ...currentForm.customShares,
        [memberId]: value,
      },
    }))
  }

  const equalSharePreview = buildEqualShares(form.amount, form.participantUserIds)
  const customSplitTotal = form.participantUserIds.reduce(
    (sum, participantUserId) => sum + Number(form.customShares[participantUserId] || 0),
    0,
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    const numericAmount = Number(form.amount)

    if (!form.title.trim()) {
      setError('Expense title is required.')
      return
    }

    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a valid amount greater than zero.')
      return
    }

    if (!form.participantUserIds.length) {
      setError('Select at least one participant.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      amount: Number(numericAmount.toFixed(2)),
      category: form.category,
      paidByUserId: form.paidByUserId,
      participantUserIds: form.participantUserIds,
      splitType: form.splitType,
      splits:
        form.splitType === 'custom'
          ? form.participantUserIds.map((participantUserId) => ({
              userId: participantUserId,
              share: Number(form.customShares[participantUserId] || 0),
            }))
          : [],
    }

    if (payload.splitType === 'custom') {
      const customTotal = payload.splits.reduce((sum, split) => sum + split.share, 0)

      if (Number(customTotal.toFixed(2)) !== Number(payload.amount.toFixed(2))) {
        setError('Custom split total must exactly match the expense amount.')
        return
      }
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (submissionError) {
      setError(submissionError.message)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <Panel
        className="w-full max-w-3xl p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-badge">Add Expense</p>
            <h3 className="mt-4 text-3xl font-semibold text-slate-900">Add a new shared expense</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Capture the payer, category, participants, and whether the split should be
              equal or custom.
            </p>
          </div>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <TextField
            label="Expense title"
            name="title"
            value={form.title}
            onChange={handleFieldChange}
            placeholder="Swiggy dinner"
            className="md:col-span-2"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleFieldChange}
            placeholder="Optional note, for example airport cabs or monthly Wi-Fi bill"
            textarea
            className="md:col-span-2"
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleFieldChange}
            placeholder="0.00"
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white/94 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/18"
              name="category"
              onChange={handleFieldChange}
              value={form.category}
            >
              {expenseCategoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Paid by</span>
            <select
              name="paidByUserId"
              value={form.paidByUserId}
              onChange={handleFieldChange}
              className="w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Split type</span>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={form.splitType === 'equal' ? 'primary' : 'secondary'}
                onClick={() => handleSplitTypeChange('equal')}
              >
                Split equally
              </Button>
              <Button
                type="button"
                variant={form.splitType === 'custom' ? 'primary' : 'secondary'}
                onClick={() => handleSplitTypeChange('custom')}
              >
                Custom shares
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Participants</span>
            <div className="grid gap-3 md:grid-cols-2">
              {members.map((member) => {
                const isSelected = form.participantUserIds.includes(member.id)
                const sharePreview =
                  form.splitType === 'custom'
                    ? Number(form.customShares[member.id] || 0)
                    : Number(equalSharePreview[member.id] || 0)

                return (
                  <div
                    key={member.id}
                    className={`rounded-3xl border p-4 ${
                      isSelected ? 'border-primary/25 bg-primary/8' : 'border-white/60 bg-white/70'
                    }`}
                  >
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleParticipant(member.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{member.email}</p>
                        {isSelected ? (
                          form.splitType === 'custom' ? (
                            <div className="mt-3">
                              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Share (INR)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.customShares[member.id] || ''}
                                onChange={(event) =>
                                  handleCustomShareChange(member.id, event.target.value)
                                }
                                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          ) : (
                            <p className="mt-3 text-sm font-medium text-primary">
                              {formatCurrency(sharePreview, currency)}
                            </p>
                          )
                        ) : null}
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>
            {form.splitType === 'custom' ? (
              <p className="mt-3 text-sm text-slate-500">
                Custom total: {formatCurrency(customSplitTotal, currency)} of{' '}
                {formatCurrency(form.amount || 0, currency)}
              </p>
            ) : null}
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-2xl border border-danger/15 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2 rounded-[24px] border border-slate-200/70 bg-slate-50/70 px-4 py-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="analytics" size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">This expense updates live analytics</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Category breakdown, member balances, and settlement suggestions refresh
                  after the expense is recorded.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
              Save Expense
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  )
}
