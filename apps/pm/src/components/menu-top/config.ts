import type { MenuTopType } from '@/types'

export const MENU_TOP: MenuTopType[] = [
  {
    id: 1,
    name: 'Điều hành số liệu',
    clientId: 'WP_BOC'
  },
  {
    id: 2,
    name: 'Khách hàng và dịch vụ'
  },
  {
    id: 3,
    name: 'Quản lý tài sản',
    clientId: 'WP_ASM',
    url: import.meta.env.VITE_WP_ASM_URL
  },
  {
    id: 4,
    name: 'Vận hành sản xuất',
    clientId: 'WP_WTPM',
    url: import.meta.env.VITE_WP_WTPM_URL
  },
  {
    id: 5,
    name: 'Quản lý mạng lưới',
    clientId: 'WP_WDNM',
    url: import.meta.env.VITE_WP_WDNM_URL
  },
  {
    id: 6,
    name: 'Quản lý nhân sự',
    clientId: 'WP_HRM',
    url: import.meta.env.VITE_WP_HRM_URL
  }
]
