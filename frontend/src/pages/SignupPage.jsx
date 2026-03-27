import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import TextField from '../components/ui/TextField'
import { useAuth } from '../hooks/useAuth'

const highlights = [
  'Create groups for flat rent, trips, food, and office expenses',
  'Track equal or custom shares in Indian Rupees',
  'See settle-up suggestions instantly for quick UPI-style paybacks',
]

export default function SignupPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isBootstrapping, signup } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, isBootstrapping, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signup(form)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-8%] h-72 w-72 rounded-full bg-violet-400/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_minmax(0,0.95fr)]">
        <Panel className="p-8 md:p-10">
          <p className="section-badge">India-First Signup</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Start splitting smarter from day one.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            Wesplit gives you a secure way to manage shared spends across India with
            real groups, real balances, and clear settle-up flows.
          </p>

          <div className="mt-8 grid gap-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600"
              >
                {highlight}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-8 md:p-10">
          <p className="section-badge">Signup</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <TextField
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Aarav Sharma"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />
            {error ? (
              <div className="rounded-2xl border border-danger/15 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {error}
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </p>
        </Panel>
      </div>
    </div>
  )
}
