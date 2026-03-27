export default function SectionHeader({ badge, description, title, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="section-badge">{badge}</p>
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
    </div>
  )
}
