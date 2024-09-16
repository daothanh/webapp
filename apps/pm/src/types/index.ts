export type MenuTopType = {
  id: number
  name: string
  clientId?: string
  url?: string
}

export type filesProps = {
  id: number
  fileUrl: string
  fileName: string
  key: string
  publicKey?: string
}

export type typeSelectRouter = {
  value?: number
  label?: string
  name: string
  uriRole?: string
  children?: any[]
}
export type typeTreeSelectRouter = {
  value: number
  label: string
  name?: string
  uriRole?: string
  children?: any
}
