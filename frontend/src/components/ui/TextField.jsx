export default function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  textarea = false,
  className = '',
  ...props
}) {
  const sharedClasses =
    'w-full rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-2 focus:ring-primary/20'

  return (
    <label className={`block ${className}`.trim()}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${sharedClasses} min-h-24 resize-none`}
          {...props}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={sharedClasses}
          {...props}
        />
      )}
      {error ? <span className="mt-2 block text-sm text-danger">{error}</span> : null}
    </label>
  )
}
