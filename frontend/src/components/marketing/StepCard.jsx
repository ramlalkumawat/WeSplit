export default function StepCard({ description, index, title }) {
  return (
    <article className="soft-card h-full p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="section-badge">Step {index}</p>
        <span className="text-sm font-bold tracking-[0.24em] text-slate-300">{index}</span>
      </div>
      <h3 className="mt-6 text-2xl font-bold text-slate-950">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  )
}
