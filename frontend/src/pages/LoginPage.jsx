import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Panel from '../components/ui/Panel'
import TextField from '../components/ui/TextField'
import { useAuth } from '../hooks/useAuth'

const benefits = [
  'INR-first balances with secure JWT login',
  'Great for flat rent, trips, office lunches, and daily spends',
  'Equal and custom split support for real Indian group expenses',
]

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isBootstrapping, login } = useAuth()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, isBootstrapping, navigate, redirectPath])

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
      await login(form)
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
        <div className="absolute left-[-8%] top-[-8%] h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-4%] h-72 w-72 rounded-full bg-violet-400/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_minmax(0,1.05fr)]">
        <Panel className="p-8 md:p-10">
          <p className="section-badge">Built For India</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Sign in to manage shared kharchas with clarity.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
            Wesplit helps you manage rent, trips, office lunches, cab splits, and
            everyday shared spends in a clean India-first workflow.
          </p>

          <div className="mt-8 grid gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-600"
              >
                {benefit}
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-8 md:p-10">
          <p className="section-badge">Login</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
            />
            {error ? (
              <div className="rounded-2xl border border-danger/15 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {error}
              </div>
            ) : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New to Wesplit?{' '}
            <Link to="/signup" className="font-semibold text-primary">
              Create your account
            </Link>
          </p>
        </Panel>
      </div>
    </div>
  )
}
