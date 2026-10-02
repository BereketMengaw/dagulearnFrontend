export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status">
      <span className="sr-only">Loading…</span>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-brand-600 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-brand-500 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-brand-400" />
      </div>
    </div>
  );
}
