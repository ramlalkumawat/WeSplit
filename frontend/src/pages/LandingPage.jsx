import Footer from '../components/marketing/Footer'
import HeroSection from '../components/marketing/HeroSection'
import LandingNavbar from '../components/marketing/LandingNavbar'
import PageMeta from '../components/seo/PageMeta'
import Icon from '../components/ui/Icon'
import { getButtonClasses } from '../components/ui/buttonStyles'
import {
  faqItems,
  pricingPlans,
  productFeatures,
  productShowcaseStats,
  testimonials,
  workflowSteps,
} from '../data/landingContent'
import { Link } from 'react-router-dom'

function SectionLead({ badge, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="section-badge">{badge}</p>
      <h2 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <PageMeta
        description="Wesplit helps roommates, travellers, and teams split expenses, track balances, and settle faster with clean dashboards and secure authentication."
        title="Wesplit | Shared Expenses With Financial Clarity"
      />
      <LandingNavbar />
      <HeroSection />

      <section id="features" className="page-shell py-16 md:py-24">
        <SectionLead
          badge="Features"
          description="Everything in Wesplit is designed around one outcome: helping a group understand shared money quickly, then act on it without confusion."
          title="A calmer way to track spend, explain balances, and move toward settlement."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {productFeatures.map((feature) => (
            <article
              key={feature.title}
              className="noise-border rounded-[30px] border border-white/70 bg-white/88 p-6 shadow-soft"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon
                  name={
                    feature.eyebrow === 'Shared Visibility'
                      ? 'receipt'
                      : feature.eyebrow === 'Balance Intelligence'
                        ? 'balance'
                        : feature.eyebrow === 'Fast Collaboration'
                          ? 'group'
                          : feature.eyebrow === 'Flexible Splits'
                            ? 'refresh'
                            : feature.eyebrow === 'Analytics That Explain'
                              ? 'analytics'
                              : 'shield'
                  }
                />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-primary/70">
                {feature.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="product" className="bg-white/55 py-16 md:py-24">
        <div className="page-shell grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_1.1fr]">
          <SectionLead
            badge="Product Tour"
            description="From the homepage through the authenticated workspace, every step is designed to remove ambiguity: faster input, clearer output, and less manual follow-up."
            title="Wesplit turns raw expenses into a living picture of who paid, who owes, and what to settle next."
          />

          <div className="grid gap-5">
            <div className="rounded-[32px] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.25)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
                Inside the dashboard
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {productShowcaseStats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] bg-white/7 p-4">
                    <p className="text-sm text-white/60">{stat.label}</p>
                    <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-3 text-sm text-white/65">{stat.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                  <Icon name="chart" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-950">Balance summaries that speak clearly</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Members can instantly see receivables, payables, recorded settlements,
                  and where the next move should happen.
                </p>
              </div>

              <div className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-soft">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-highlight/10 text-highlight">
                  <Icon name="spark" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-950">Analytics that explain the "why"</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Spending trends, category mix, and member activity help a group understand
                  patterns instead of only reacting to the latest bill.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="page-shell py-16 md:py-24">
        <SectionLead
          align="center"
          badge="How It Works"
          description="The product is structured around the real flow people follow when sharing money: account creation, onboarding, group setup, expense capture, and settlement."
          title="A complete path from signup to settle-up."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {workflowSteps.map((step) => (
              <article
                key={step.index}
                className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-soft"
              >
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary/70">
                  Step {step.index}
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{step.description}</p>
              </article>
            ))}
        </div>
      </section>

      <section id="pricing" className="bg-white/55 py-16 md:py-24">
        <div className="page-shell">
          <SectionLead
            align="center"
            badge="Pricing"
            description="Launch-ready products need a credible monetization story, even when users start free. Wesplit is positioned to grow from individuals into teams."
            title="Simple plans for groups today, with room to scale tomorrow."
          />

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[32px] border p-7 shadow-soft ${
                  plan.featured
                    ? 'border-primary/20 bg-[linear-gradient(180deg,rgba(21,94,239,0.08),rgba(255,255,255,0.96))]'
                    : 'border-slate-200/70 bg-white/90'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary/70">
                      {plan.name}
                    </p>
                    <div className="mt-4 flex items-end gap-2">
                      <p className="text-4xl font-extrabold tracking-tight text-slate-950">
                        {plan.price}
                      </p>
                      {plan.period ? <p className="pb-1 text-sm text-slate-500">{plan.period}</p> : null}
                    </div>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">
                      Popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>

                <div className="mt-6 space-y-3">
                  {plan.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-success">
                        <Icon name="check" size={14} />
                      </span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <Link
                  className={`mt-8 w-full ${getButtonClasses({
                    variant: plan.featured ? 'primary' : 'secondary',
                  })}`}
                  to="/signup"
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="page-shell py-16 md:py-24">
        <SectionLead
          badge="Testimonials"
          description="Wesplit is built to feel credible in the exact situations where trust matters most: homes, trips, and team reimbursements."
          title="People remember how a money product makes them feel. Wesplit aims for calm."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-soft"
            >
              <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                Customer voice
              </div>
              <p className="mt-5 text-lg leading-8 text-slate-700">"{testimonial.body}"</p>
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="font-bold text-slate-950">{testimonial.name}</p>
                <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-white/55 py-16 md:py-24">
        <div className="page-shell grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionLead
            badge="FAQ"
            description="A good launch-ready product answers the practical questions up front: how splits work, how settlements are tracked, and who the platform is built for."
            title="Questions people ask before trusting a shared money tool."
          />

          <div className="space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-soft"
              >
                <summary className="cursor-pointer list-none text-lg font-bold text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16 md:py-24">
        <div className="noise-border rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(21,94,239,0.12),rgba(15,23,42,0.95))] px-6 py-10 text-white shadow-[0_28px_90px_rgba(15,23,42,0.24)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/55">Ready to launch</p>
              <h2 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
                Replace messy expense threads with one shared source of truth.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                Create a group, log the first expense, and let Wesplit handle the balance math,
                settlement suggestions, and visibility your group has been missing.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link className={getButtonClasses({ variant: 'primary' })} to="/signup">
                Create account
              </Link>
              <Link
                className={getButtonClasses({ variant: 'secondary', className: 'bg-white text-slate-950' })}
                to="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
