export default function FeatureCard({ description, eyebrow, title }) {
  return (
    <article className="soft-card h-full p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/18">
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-5 text-2xl font-bold text-slate-950">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  )
}
