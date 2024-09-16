import { RouteRecordRedirectOption } from 'vue-router'
import { defineComponent } from 'vue'
export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface RouterMeta {
  title: string
  keepAlive?: boolean
  icon?: any
  permission?: Array<string>
  target?: string
  hidden?: boolean
  hiddenHeaderContent?: boolean
  hideHeader?: boolean
  blank?: boolean
  collapsible?: boolean
  subsystem?: any
  breadcrumbText?: string
  pageName?: string
  transition?: string
  readonly?: boolean
}

export interface Router {
  name: string
  path: string
  redirect?: string | RouteRecordRedirectOption
  meta?: RouterMeta
  component?: Component | string
  children?: Router[]
  hidden?: boolean
  hideChildrenInMenu?: boolean
}
