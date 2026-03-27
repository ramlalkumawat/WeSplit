export default function TestimonialCard({ body, name, role }) {
  return (
    <article className="soft-card h-full p-6">
      <div className="flex items-center gap-2 text-highlight">
        <span className="h-2 w-2 rounded-full bg-highlight" />
        <span className="text-xs font-bold uppercase tracking-[0.24em]">Customer note</span>
      </div>
      <p className="mt-5 text-base leading-8 text-slate-700">“{body}”</p>
      <div className="mt-6 border-t border-slate-200 pt-4">
        <p className="font-semibold text-slate-950">{name}</p>
        <p className="mt-1 text-sm text-slate-500">{role}</p>
      </div>
    </article>
  )
}
