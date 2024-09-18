export type ResponseType = {
  code: string
  body: any
  message: string
}

export type APIError = {
  code: string
  message: string
  context?: any
}

export type TypeAPIError =
  | {
      response?: { data?: APIError }
    }
  | any
