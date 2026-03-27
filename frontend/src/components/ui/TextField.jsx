export default function TextField({
  autoComplete,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  helpText,
  id,
  inputClassName = '',
  textarea = false,
  className = '',
  ...props
}) {
  const fieldId = id || name
  const hintId = `${fieldId}-hint`
  const sharedClasses = `w-full rounded-2xl border bg-white/92 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary/30 focus:ring-2 focus:ring-primary/18 ${error ? 'border-danger/25 focus:border-danger/30 focus:ring-danger/12' : 'border-slate-200'} ${inputClassName}`.trim()

  return (
    <label className={`block ${className}`.trim()}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${sharedClasses} min-h-24 resize-none`}
          aria-describedby={error || helpText ? hintId : undefined}
          aria-invalid={Boolean(error)}
          {...props}
        />
      ) : (
        <input
          id={fieldId}
          autoComplete={autoComplete}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={sharedClasses}
          aria-describedby={error || helpText ? hintId : undefined}
          aria-invalid={Boolean(error)}
          {...props}
        />
      )}
      {error || helpText ? (
        <span
          id={hintId}
          className={`mt-2 block text-sm ${error ? 'text-danger' : 'text-slate-500'}`}
        >
          {error || helpText}
        </span>
      ) : null}
    </label>
  )
}
