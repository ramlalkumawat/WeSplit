const iconPaths = {
  analytics: (
    <>
      <path d="M4 18.5h16" />
      <path d="M7 15V9" />
      <path d="M12 15V6" />
      <path d="M17 15v-3" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </>
  ),
  balance: (
    <>
      <path d="M3.5 8.5 12 4l8.5 4.5L12 13 3.5 8.5Z" />
      <path d="M6.5 10.5v5.25c0 1.8 2.46 3.25 5.5 3.25s5.5-1.45 5.5-3.25V10.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 17.5h16" />
      <path d="m6.5 14 3-3 2.5 1.75 5-5.25" />
      <path d="m15 7.5 2-.1-.15 2" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4.25 4.25L19 6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3 1.75" />
    </>
  ),
  group: (
    <>
      <path d="M9 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M15.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M4.75 18c.4-2.25 2.35-3.75 4.75-3.75s4.35 1.5 4.75 3.75" />
      <path d="M14.25 18c.3-1.5 1.55-2.55 3.25-2.8" />
    </>
  ),
  lightning: (
    <>
      <path d="m11 3.75-4 7h3l-1 9.5 6-9h-3l3-7h-4Z" />
    </>
  ),
  message: (
    <>
      <path d="M5.5 7.5A3.5 3.5 0 0 1 9 4h6a3.5 3.5 0 0 1 3.5 3.5v4A3.5 3.5 0 0 1 15 15h-3.5l-4 3v-3H9a3.5 3.5 0 0 1-3.5-3.5v-4Z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2.5" />
      <path d="M8.5 10V8a3.5 3.5 0 0 1 7 0v2" />
    </>
  ),
  receipt: (
    <>
      <path d="M7 4.5h10v15l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5V4.5Z" />
      <path d="M9.5 8.5h5" />
      <path d="M9.5 12h5" />
      <path d="M9.5 15.5h3.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M19 7.5V4h-3.5" />
      <path d="M18.2 11A6.5 6.5 0 1 1 11 5.5c1.7 0 3.25.65 4.4 1.7L19 10.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6v5c0 4.15-2.9 7.9-7 9-4.1-1.1-7-4.85-7-9V6l7-2.5Z" />
      <path d="m9.2 11.8 1.9 1.9 3.75-4" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3.5 1.2 3.3 3.3 1.2-3.3 1.2L12 12.5l-1.2-3.3-3.3-1.2 3.3-1.2L12 3.5Z" />
      <path d="m18 14 0.8 2.2 2.2 0.8-2.2 0.8L18 20l-0.8-2.2-2.2-0.8 2.2-0.8L18 14Z" />
      <path d="m6 14 0.75 2.05L8.8 16.8l-2.05 0.75L6 19.6l-0.75-2.05L3.2 16.8l2.05-0.75L6 14Z" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5h13.5A2.5 2.5 0 0 1 20 10v6a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 16V10A2.5 2.5 0 0 1 6 7.5" />
      <path d="M4.5 7.5V6A2.5 2.5 0 0 1 7 3.5h9" />
      <path d="M15.5 13h4" />
    </>
  ),
}

export default function Icon({
  className = '',
  name,
  size = 20,
  strokeWidth = 1.8,
}) {
  const paths = iconPaths[name]

  if (!paths) {
    return null
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths}
    </svg>
  )
}
