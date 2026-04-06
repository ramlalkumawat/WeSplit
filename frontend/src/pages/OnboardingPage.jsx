import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageMeta from '../components/seo/PageMeta'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import TextField from '../components/ui/TextField'
import { getButtonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../hooks/useAuth'
import { useDashboardData } from '../hooks/useDashboardData'
import { currencyOptions } from '../data/financeOptions'
import { validateGroupForm } from '../utils/validation/workspaceValidation'

const onboardingSteps = [
  {
    title: 'Create your first group',
    description: 'Choose a name, purpose, and currency so the workspace matches the context.',
  },
  {
    title: 'Invite the people involved',
    description: 'Add members by email now or start with yourself and expand the group later.',
  },
  {
    title: 'Log the first expense',
    description: 'Once the group is created, add rent, food, travel, or any shared bill to unlock balances.',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createGroup, groups, isMutating, overview } = useDashboardData()
  const [form, setForm] = useState({
    name: '',
    description: '',
    currency: 'INR',
    memberEmails: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validation = validateGroupForm(form)

    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors)
      return
    }

    try {
      const data = await createGroup({
        name: form.name.trim(),
        description: form.description.trim(),
        currency: validation.currency,
        memberEmails: validation.memberEmails,
      })

      navigate(`/groups/${data.group.id}`, {
        replace: true,
        state: { onboardingComplete: true },
      })
    } catch {
      // Shared feedback is handled by the dashboard data context.
    }
  }

  return (
    <div className="space-y-8">
      <PageMeta
        description="Set up your first Wesplit group and start tracking shared expenses with guided onboarding."
        title="Onboarding | Wesplit"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_380px]">
        <Panel className="p-7 md:p-8">
          <p className="section-badge">Onboarding</p>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            Start strong, {user?.name?.split(' ')[0] || 'there'}. Let&apos;s build your first expense-sharing workspace.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            Wesplit is ready to help you move from scattered spending to a clean group flow:
            create the group, invite people, add the first expense, and settle with clarity.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {onboardingSteps.map((step, index) => (
              <div key={step.title} className="rounded-[28px] border border-slate-200/70 bg-white/88 p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary/70">
                  Step 0{index + 1}
                </p>
                <h2 className="mt-3 text-xl font-bold text-slate-950">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <p className="eyebrow">Current account snapshot</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[24px] border border-slate-200/70 bg-white/88 p-4">
              <p className="text-sm text-slate-500">Active groups</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">{overview.groupCount}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/88 p-4">
              <p className="text-sm text-slate-500">Pending settle-ups</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">{overview.pendingSettlements}</p>
            </div>
            {groups.length ? (
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-slate-950"
                to={`/groups/${groups[0].id}`}
              >
                Continue in latest group
                <Icon name="arrowUpRight" size={16} />
              </Link>
            ) : null}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-badge">Create your first group</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                Launch the workspace your group will actually use.
              </h2>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Icon name="group" />
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <TextField
              className="md:col-span-2"
              error={errors.name}
              label="Group name"
              name="name"
              onChange={handleChange}
              placeholder="Goa Trip 2026"
              value={form.name}
            />
            <TextField
              className="md:col-span-2"
              error={errors.description}
              label="Description"
              name="description"
              onChange={handleChange}
              placeholder="Villa, airport transfers, food runs, beach activities, and shared shopping"
              textarea
              value={form.description}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Currency</span>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white/94 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/18"
                name="currency"
                onChange={handleChange}
                value={form.currency}
              >
                {currencyOptions.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.label}
                  </option>
                ))}
              </select>
              {errors.currency ? (
                <span className="mt-2 block text-sm text-danger">{errors.currency}</span>
              ) : null}
            </label>

            <TextField
              error={errors.memberEmails}
              helpText="Optional. Separate multiple addresses with commas. People without Wesplit accounts will be skipped for now."
              label="Invite members"
              name="memberEmails"
              onChange={handleChange}
              placeholder="aditi@email.com, karan@email.com"
              value={form.memberEmails}
            />

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link className={getButtonClasses({ variant: 'secondary' })} to="/dashboard">
                Skip for now
              </Link>
              <Button disabled={isMutating} loading={isMutating} type="submit">
                Create group
              </Button>
            </div>
          </form>
        </Panel>

        <Panel className="p-6">
          <p className="section-badge">What happens next</p>
          <div className="mt-5 space-y-4">
            {[
              'You will land inside the group workspace with balances, activity, and member management ready.',
              'From there you can add the first expense, choose equal or custom splits, and see live settle-up suggestions.',
              'Recorded settlements will update history and analytics so the group keeps one trustworthy financial trail.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[24px] border border-slate-200/70 bg-white/88 p-4">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-success/10 text-success">
                  <Icon name="check" size={16} />
                </span>
                <p className="text-sm leading-7 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  )
}
