import { useLocation, useNavigate } from 'react-router-dom'
import AuthSplitLayout from './AuthSplitLayout'
import AuthForm from './AuthForm'
import { useAuthForm } from '../../hooks/useAuthForm'
import { useAuth } from '../../hooks/useAuth'
import PageMeta from '../seo/PageMeta'

const authContent = {
  login: {
    badge: 'Secure Login',
    description:
      'Return to your groups, balances, and settlement history with a secure account session and a cleaner shared-finance workspace.',
    highlights: [
      {
        title: 'Live balance tracking',
        description: 'See what you owe, what you should receive, and which groups still need action.',
      },
      {
        title: 'Built for real group spending',
        description: 'From rent and office lunches to travel and subscriptions, every split stays readable.',
      },
      {
        title: 'Protected by JWT sessions',
        description: 'Dashboard and group routes stay behind authenticated access with graceful session handling.',
      },
    ],
    title: 'Sign in and reopen the full picture of your shared money.',
  },
  signup: {
    badge: 'Guided Onboarding',
    description:
      'Create your account, set up your first group, and turn messy shared spending into a cleaner operating system for everyday money.',
    highlights: [
      {
        title: 'Create groups quickly',
        description: 'Launch a home, trip, event, or team spend group without bouncing between apps.',
      },
      {
        title: 'Clear settlement flow',
        description: 'Wesplit converts raw expenses into clear balances and recommended settle-up actions.',
      },
      {
        title: 'Designed for responsiveness',
        description: 'Onboarding, dashboard, and group workspaces stay polished from mobile to desktop.',
      },
    ],
    title: 'Create your account and start with a shared-expense flow that feels launch-ready.',
  },
}

export default function AuthPage({ mode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const authAction = mode === 'login' ? login : signup
  const form = useAuthForm({
    mode,
    onSubmit: authAction,
    onSuccess: () => {
      const fallbackPath = mode === 'signup' ? '/onboarding' : '/dashboard'
      const nextPath = mode === 'login' ? location.state?.from?.pathname || fallbackPath : fallbackPath
      navigate(nextPath, { replace: true })
    },
  })
  const content = authContent[mode]

  return (
    <>
      <PageMeta
        description={
          mode === 'login'
            ? 'Sign in to Wesplit and continue tracking shared expenses, balances, and settlements.'
            : 'Create your Wesplit account and start managing shared expenses with better clarity.'
        }
        title={mode === 'login' ? 'Login | Wesplit' : 'Create Account | Wesplit'}
      />
      <AuthSplitLayout
        badge={content.badge}
        description={content.description}
        highlights={content.highlights}
        title={content.title}
      >
        <AuthForm mode={mode} {...form} />
      </AuthSplitLayout>
    </>
  )
}
