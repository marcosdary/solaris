import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

/*
Hook 2: Identifica a capacidade do Hardware (CPU e RAM)
*/
export function usePostHogDevice() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog || typeof window === "undefined") return;
      posthog.register({
         device_memory_gb: (navigator as any).deviceMemory || "undefined",
         device_cpu_cpres: navigator.hardwareConcurrency || "undefined",
      });
  }, [posthog]);
}

/*
Hook 3: Captura erros de JavaScript e Promises não tratadas
*/
export function usePostHogErrorTracking() {
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog || typeof window === "undefined") return;

    const handleError = (event: ErrorEvent) => {
      posthog.capture('$exception', {
        $exception_message: event.message,
        $exception_type: 'UncaughtError',
        source_file: event.filename,
        line_number: event.lineno,
        column_number: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      posthog.capture('$exception', {
        $exception_message: event.reason?.message || String(event.reason),
        $exception_type: 'UnhandledPromiseRejection',
      });
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [posthog]);
};

/**
Hook Mestre: Agrupa todas as telemetrias em uma única chamada
*/
export function usePostHogTelemetry() {
  usePostHogDevice();
  usePostHogErrorTracking();
}