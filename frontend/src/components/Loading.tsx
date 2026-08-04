import type { ReactNode } from "react";

interface LoadingProps {
  message?: ReactNode;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

const spinnerSizes = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-4",
  lg: "h-14 w-14 border-4",
};

export function Loading({
  message = "Carregando...",
  fullScreen = true,
  size = "md",
}: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-10"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`animate-spin rounded-full border-accent-horizon/20 border-t-accent-horizon ${spinnerSizes[size]}`}
        />
        {message && (
          <span className="text-text-secondary">{message}</span>
        )}
      </div>
    </div>
  );
}