import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import TextField from '../ui/TextField'

export default function AuthForm({
  detailMessages,
  errors,
  formError,
  handleChange,
  handleSubmit,
  isSubmitting,
  mode,
  values,
}) {
  const isLogin = mode === 'login'

  return (
    <>
      <div>
        <p className="section-badge">{isLogin ? 'Login' : 'Create Account'}</p>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
          {isLogin
            ? 'Welcome back to your shared-finance workspace.'
            : 'Start with a cleaner shared-expense workflow.'}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          {isLogin
            ? 'Access balances, activity history, and settle-up actions with a secure JWT session.'
            : 'Create your account to launch groups, capture expenses, and move toward clear balances faster.'}
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {!isLogin ? (
          <TextField
            autoComplete="name"
            error={errors.name}
            label="Full name"
            name="name"
            onChange={handleChange}
            placeholder="Ramlal Kumawat"
            value={values.name}
          />
        ) : null}

        <TextField
          autoComplete="email"
          error={errors.email}
          label="Email address"
          name="email"
          onChange={handleChange}
          placeholder="name@company.com"
          type="email"
          value={values.email}
        />

        <TextField
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          error={errors.password}
          helpText={
            isLogin
              ? 'Use the same password you created during signup.'
              : 'Use at least 8 characters for a secure account password.'
          }
          label="Password"
          name="password"
          onChange={handleChange}
          placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
          type="password"
          value={values.password}
        />

        {formError ? (
          <div className="rounded-2xl border border-danger/15 bg-danger/10 px-4 py-3 text-sm text-danger">
            <p className="font-semibold">{formError}</p>
            {detailMessages.length ? (
              <div className="mt-2 space-y-1 text-danger/90">
                {detailMessages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <Button className="w-full" loading={isSubmitting} type="submit">
          {isLogin ? 'Sign In' : 'Create Account'}
          <Icon name="arrowUpRight" size={18} />
        </Button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        {isLogin ? 'New to Wesplit?' : 'Already have an account?'}{' '}
        <Link
          to={isLogin ? '/signup' : '/login'}
          className="font-semibold text-primary transition hover:text-slate-950"
        >
          {isLogin ? 'Create your account' : 'Sign in'}
        </Link>
      </p>
    </>
  )
}
