import type {MenuTopType} from "../../types";

export const MENU_TOP: MenuTopType[] = [
  {
    id: 1,
    name: 'Điều hành số liệu',
    open: false,
    children: [
      {
        id: 1.1,
        name: 'Điều hành số liệu',
        clientId: 'WP_BOC',
        url: import.meta.env.VITE_WP_BOC_URL
      },
      {
        id: 1.2,
        name: 'Quản trị mục tiêu và kết quả thực hiện'
      }
    ]
  },
  {
    id: 2,
    name: 'Quản trị doanh nghiệp',
    open: false,
    children: [
      {
        id: 2.1,
        name: 'Quản lý khách hàng và dịch vụ'
      },
      {
        id: 2.2,
        name: 'Tổng đài dịch vụ',
        url: import.meta.env.VITE_WP_CCM_URL,
        clientId: 'WP_CCM'
      },
      {
        id: 2.3,
        name: 'Quản lý công việc hiện trường'
      },
      // {
      //   id: 2.4,
      //   name: 'Quản lý nhân sự, chính sách thu nhập',
      //   url: import.meta.env.VITE_WP_HRM_URL,
      //   clientId: 'WP_HRM',
      // },
      {
        id: 2.5,
        name: 'Quản lý ngân sách và thông tin dự án',
        url: import.meta.env.VITE_WP_BOC_URL,
        clientId: 'WP_BOC'
      },
      {
        id: 2.6,
        name: 'Quản lý mua sắm tập trung'
      },
      {
        id: 2.7,
        name: 'Kế toán ngành nước'
      }
    ]
  },
  {
    id: 3,
    name: 'Vận hành kỹ thuật',
    open: false,
    children: [
      {
        id: 3.1,
        name: 'Quản lý tài sản nhà máy và mạng lưới',
        url: import.meta.env.VITE_WP_ASM_URL,
        clientId: 'WP_ASM'
      },
      {
        id: 3.2,
        name: 'Quản lý, giám sát các nhà máy xử lý tập trung',
        url: import.meta.env.VITE_WP_WTPM_URL,
        clientId: 'WP_WTPM'
      },
      {
        id: 3.3,
        name: 'Quản lý, giám sát và vận hành mạng lưới cấp nước tập trung',
        url: import.meta.env.VITE_WP_WDN_DESKTOP_URL,
        clientId: 'WP_WDNM'
      },
      {
        id: 3.4,
        name: 'Các ứng dụng giám sát và vận hành tại nhà máy (SCADA)'
      }
    ]
  }
]
