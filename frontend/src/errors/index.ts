export interface DetailItem {
  loc: string[]
  msg: string
  type: string
}

export interface ApiErrorInit {
  status: number
  statusText: string
  url: string
  body?: unknown
  detail?: DetailItem[]
}

export class AppError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = "AppError"
  }
}

export class ApiError extends AppError {
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly body?: unknown
  readonly detail?: DetailItem[]

  constructor(message: string, init: ApiErrorInit, options?: ErrorOptions) {
    super(message, options)
    this.name = "ApiError"
    this.status = init.status
    this.statusText = init.statusText
    this.url = init.url
    this.body = init.body
    this.detail = init.detail
  }
}

export class NetworkError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(init.message ?? "Erro de rede. Verifique sua conexão.", { status: 0, ...init }, options)
    this.name = "NetworkError"
  }
}

export class TimeoutError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(
      init.message ?? "A requisição excedeu o tempo limite.",
      { status: 408, ...init },
      options,
    )
    this.name = "TimeoutError"
  }
}

export class ValidationError extends ApiError {
  constructor(init: ApiErrorInit & { message?: string }, options?: ErrorOptions) {
    super(init.message ?? "Dados inválidos.", init, options)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(
      init.message ?? "Não autorizado. Faça login novamente.",
      { status: 401, ...init },
      options,
    )
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(init.message ?? "Acesso proibido.", { status: 403, ...init }, options)
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(init.message ?? "Recurso não encontrado.", { status: 404, ...init }, options)
    this.name = "NotFoundError"
  }
}

export class ConflictError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(init.message ?? "Conflito ao processar a requisição.", { status: 409, ...init }, options)
    this.name = "ConflictError"
  }
}

export class ServerError extends ApiError {
  constructor(init: Omit<ApiErrorInit, "status"> & { message?: string }, options?: ErrorOptions) {
    super(init.message ?? "Erro interno do servidor.", { status: 500, ...init }, options)
    this.name = "ServerError"
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof ApiError) return error.status
  return undefined
}

export function getErrorDetail(error: unknown): DetailItem[] | undefined {
  if (error instanceof ApiError) return error.detail
  return undefined
}
