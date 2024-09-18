type MenuTopType = {
  id: number
  name: string
  clientId?: string
  url?: string
}


type typeSelectRouter = {
  value?: number
  label?: string
  name: string
  uriRole?: string
  children?: any[]
}
type typeTreeSelectRouter = {
  value: number
  label: string
  name?: string
  uriRole?: string
  children?: any
}
export type { MenuTopType, typeSelectRouter, typeTreeSelectRouter}