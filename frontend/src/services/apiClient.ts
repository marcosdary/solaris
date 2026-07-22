import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ValidationError,
} from "../errors";

import type { DetailItem } from "../errors";

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new TimeoutError({ url, statusText: "Timeout" });
    }
    throw new NetworkError({
      url,
      statusText: err instanceof Error ? err.message : "Network Error",
    });
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail: DetailItem[] | undefined = (
      body as { detail?: DetailItem[] } | null
    )?.detail;

    const errorCtx = {
      status: response.status,
      statusText: response.statusText,
      url,
      body: body ?? undefined,
      detail,
    };

    switch (response.status) {
      case 400:
        throw new ValidationError(errorCtx);
      case 401:
        throw new AuthenticationError(errorCtx);
      case 403:
        throw new AuthorizationError(errorCtx);
      case 404:
        throw new NotFoundError(errorCtx);
      case 409:
        throw new ConflictError(errorCtx);
      case 422:
        throw new ValidationError(errorCtx);
      default:
        if (response.status >= 500) {
          throw new ServerError(errorCtx);
        }
        throw new ApiError(`Erro HTTP: ${response.status}`, errorCtx);
    }
  }

  return body as T;
}
