import { RouterName, UriRole } from '@/routes/config.ts'
import type { typeSelectRouter } from '@/types'

export const selectedRouterList: typeSelectRouter[] = [
  {
    id: 1,
    title: 'Danh sách dự án',
    name: RouterName.PROJECT_LIST,
    uriRole: UriRole.PROJECT_LIST,
    disabled: false
  },
  {
    id: 2,
    title: 'Quản lý công việc',
    name: RouterName.PROJECT_LIST,
    uriRole: UriRole.PROJECT_LIST,
    disabled: true
  },
  {
    id: 3,
    title: 'Quản lý cơ hội',
    name: RouterName.PROJECT_LIST,
    uriRole: UriRole.PROJECT_LIST,
    disabled: true
  },
  {
    id: 4,
    title: 'Mẫu hồ sơ tài liệu',
    name: RouterName.PROJECT_LIST,
    uriRole: UriRole.PROJECT_LIST,
    disabled: true
  },
  {
    id: 5,
    title: 'Danh sách nhà thầu',
    name: RouterName.PROJECT_CONTRACTOR_LIST,
    uriRole: UriRole.PROJECT_CONTRACTOR_LIST,
    disabled: false
  }
]
