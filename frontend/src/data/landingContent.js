export const landingNavItems = [
  { href: '#features', label: 'Features' },
  { href: '#product', label: 'Product' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
]

export const heroStats = [
  { label: 'Expense categories tracked', value: '9' },
  { label: 'Currencies ready at launch', value: '6' },
  { label: 'Recommended settle-up path', value: 'Instant' },
]

export const trustHighlights = [
  'Roommates and shared homes',
  'Travel groups and friend circles',
  'Teams, founders, and operators',
  'Events, clubs, and community budgets',
]

export const productFeatures = [
  {
    eyebrow: 'Shared Visibility',
    title: 'Every expense, payer, participant, and split stays clear.',
    description:
      'Wesplit turns scattered payments into a readable system with categories, notes, member balances, and a full activity trail.',
  },
  {
    eyebrow: 'Balance Intelligence',
    title: 'Know exactly who owes, who is owed, and what to settle next.',
    description:
      'Net balances and recommended payment paths update the moment a bill or settlement is recorded, so no one needs to do the math manually.',
  },
  {
    eyebrow: 'Fast Collaboration',
    title: 'Invite members, launch groups, and get everyone aligned fast.',
    description:
      'Move from signup to a working expense-sharing workspace with onboarding that fits homes, trips, and operating teams.',
  },
  {
    eyebrow: 'Flexible Splits',
    title: 'Handle equal splits, uneven shares, and real-world edge cases.',
    description:
      'Dinner can split equally, the Airbnb can split by room, and utilities can stay categorized for cleaner month-end reviews.',
  },
  {
    eyebrow: 'Analytics That Explain',
    title: 'Charts and summaries reveal where money is actually going.',
    description:
      'Track category mix, monthly activity, settlement volume, and the members carrying the biggest balance positions.',
  },
  {
    eyebrow: 'Trust By Design',
    title: 'JWT auth, error handling, validation, and accessible flows built in.',
    description:
      'From login through settlement confirmation, the product is designed to feel secure, polished, and ready for daily use.',
  },
]

export const workflowSteps = [
  {
    index: '01',
    title: 'Create your account and enter a guided onboarding flow.',
    description:
      'Sign up, land in a clean product space, and create your first shared group with currency, members, and a purpose.',
  },
  {
    index: '02',
    title: 'Capture real expenses with the right split and category.',
    description:
      'Log who paid, who participated, and whether the amount should split equally or by custom shares.',
  },
  {
    index: '03',
    title: 'Review balances, analytics, and the best settle-up path.',
    description:
      'Wesplit shows who should pay whom, what has already been settled, and which groups need attention today.',
  },
]

export const productShowcaseStats = [
  {
    label: 'Monthly spend tracked',
    value: 'Rs 1.24L',
    note: 'Across rent, food, transport, and travel.',
  },
  {
    label: 'Pending settle-ups',
    value: '3',
    note: 'Resolved with one suggested payment graph.',
  },
  {
    label: 'Recorded settlements',
    value: '28',
    note: 'Saved in a searchable activity history.',
  },
]

export const testimonials = [
  {
    body: 'We stopped reconciling trip costs in chat screenshots. Wesplit finally gave us one trustworthy view of shared spend and who needed to settle.',
    name: 'Aditi Mehra',
    role: 'Trip organizer, Bengaluru',
  },
  {
    body: 'The dashboard makes reimbursements feel operational instead of chaotic. I can see category trends, pending balances, and recent activity in minutes.',
    name: 'Karan Joshi',
    role: 'Operations lead, Jaipur',
  },
  {
    body: 'Our flat uses it for rent, Wi-Fi, groceries, and repairs. The settlement flow is the first one that feels simple enough for everyone to actually use.',
    name: 'Sana Khan',
    role: 'Household coordinator, Mumbai',
  },
]

export const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For roommates, trips, and smaller circles who want shared clarity without friction.',
    cta: 'Start Free',
    featured: false,
    bullets: [
      'Unlimited personal account access',
      'Create shared groups and invite members',
      'Equal and custom split tracking',
      'Balance summaries and settle-up suggestions',
    ],
  },
  {
    name: 'Pro',
    price: 'Rs 499',
    period: '/month',
    description: 'For power users and small teams that want premium reporting and more operational confidence.',
    cta: 'Join Waitlist',
    featured: true,
    bullets: [
      'Everything in Starter',
      'Advanced analytics and export-ready summaries',
      'Recurring templates for routine expenses',
      'Priority support and launch concierge',
    ],
  },
  {
    name: 'Business',
    price: 'Custom',
    description: 'For larger communities, operators, or finance-heavy workflows that need tailored rollout support.',
    cta: 'Talk to Sales',
    featured: false,
    bullets: [
      'Custom onboarding support',
      'Policy-aware approval workflows',
      'Admin reporting and reconciliation exports',
      'Dedicated implementation guidance',
    ],
  },
]

export const faqItems = [
  {
    question: 'How does Wesplit decide who should pay whom?',
    answer:
      'Wesplit calculates each member\'s net balance from expenses and recorded settlements, then suggests the smallest set of payments needed to clear outstanding balances.',
  },
  {
    question: 'Can I split a bill unevenly?',
    answer:
      'Yes. Each expense supports equal splits and custom shares, so rent, travel rooms, or team reimbursements can match real contribution logic.',
  },
  {
    question: 'Do settlements stay visible after they are paid?',
    answer:
      'Yes. Recorded settlements appear in the activity history and analytics so groups can track what has already been settled and what remains open.',
  },
  {
    question: 'Is Wesplit only for friends and roommates?',
    answer:
      'No. Wesplit is designed for households, travel crews, founding teams, clubs, event organizers, and any group that needs a reliable shared-expense workflow.',
  },
]

export const footerLinks = {
  product: [
    { href: '#features', label: 'Features' },
    { href: '#product', label: 'Product Tour' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ],
  access: [
    { href: '/login', label: 'Login', type: 'route' },
    { href: '/signup', label: 'Create account', type: 'route' },
    { href: '/dashboard', label: 'Open dashboard', type: 'route' },
  ],
}
