export default function FloatingActionButton({ disabled = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="gradient-button fixed bottom-6 right-6 z-20 rounded-full px-5 py-4 shadow-2xl shadow-primary/25 sm:px-6"
      aria-label="Add Expense"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
      <span className="hidden sm:inline">Add Expense</span>
    </button>
  )
}
