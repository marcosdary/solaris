export function Loading() {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-horizon/20 border-t-accent-horizon" />
      <span className="text-text-secondary">
        Gerando seu currículo...
      </span>
    </div>
  );
}