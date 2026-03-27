import FeatureCard from '../components/marketing/FeatureCard'
import Footer from '../components/marketing/Footer'
import HeroSection from '../components/marketing/HeroSection'
import LandingNavbar from '../components/marketing/LandingNavbar'
import SectionHeader from '../components/marketing/SectionHeader'
import StepCard from '../components/marketing/StepCard'
import TestimonialCard from '../components/marketing/TestimonialCard'
import { productFeatures, testimonials, workflowSteps } from '../data/landingContent'

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <LandingNavbar />
      <HeroSection />

      <section id="features" className="page-shell py-16 md:py-24">
        <SectionHeader
          badge="Features"
          description="Every part of the experience is designed to feel intentional: polished entry points, clear protected routes, responsive layouts, and reusable interface components."
          title="The product flow now looks and behaves like a modern SaaS app."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {productFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white/55 py-16 md:py-24">
        <div className="page-shell">
          <SectionHeader
            align="center"
            badge="How It Works"
            description="Instead of sending people straight into login, Wesplit now guides them through a public product story and then into protected internal routes with a cleaner UX handoff."
            title="A smoother journey from discovery to active group management."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {workflowSteps.map((step) => (
              <StepCard key={step.index} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="page-shell py-16 md:py-24">
        <SectionHeader
          badge="Testimonials"
          description="The new structure is built to feel credible and scalable for real-world users, whether they are splitting rent, organizing travel, or coordinating team expenses."
          title="A product experience that feels ready for everyday use."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
