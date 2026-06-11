export function Loading() {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <span className="text-gray-600">
        Gerando seu currículo...
      </span>
    </div>
  );
}