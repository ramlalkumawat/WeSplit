import AuthSplitLayout from './AuthSplitLayout'
import AuthForm from './AuthForm'
import { useAuthForm } from '../../hooks/useAuthForm'
import { useAuth } from '../../hooks/useAuth'

const authContent = {
  login: {
    badge: 'Secure Login',
    description:
      'Wesplit brings your shared expenses, balances, and settle-up actions into one responsive workspace built for modern teams, trips, flatmates, and operators.',
    highlights: [
      {
        title: 'Live balance tracking',
        description: 'See what you owe, what you should receive, and where action is needed instantly.',
      },
      {
        title: 'Built for real group spending',
        description: 'From rent and office lunches to travel and subscriptions, every group stays easy to manage.',
      },
      {
        title: 'Protected by JWT sessions',
        description: 'Once authenticated, your dashboard and group routes stay behind secure route guards.',
      },
    ],
    title: 'Sign in and pick up exactly where your last split ended.',
  },
  signup: {
    badge: 'SaaS-Style Onboarding',
    description:
      'Create an account, invite people into groups, and turn ad-hoc expense sharing into a crisp product experience that feels ready for scale.',
    highlights: [
      {
        title: 'Create groups quickly',
        description: 'Launch rent, travel, food, and team spend groups without switching tools or tabs.',
      },
      {
        title: 'Clear settlement flow',
        description: 'Wesplit converts messy shared bills into readable balances and next-step suggestions.',
      },
      {
        title: 'Designed for responsiveness',
        description: 'Your login and dashboard journey works cleanly from phones to larger team workstations.',
      },
    ],
    title: 'Create your account and turn group spending into an organized system.',
  },
}

export default function AuthPage({ mode }) {
  const { login, signup } = useAuth()
  const authAction = mode === 'login' ? login : signup
  const form = useAuthForm({
    mode,
    onSubmit: authAction,
  })
  const content = authContent[mode]

  return (
    <AuthSplitLayout
      badge={content.badge}
      description={content.description}
      highlights={content.highlights}
      title={content.title}
    >
      <AuthForm mode={mode} {...form} />
    </AuthSplitLayout>
  )
}
