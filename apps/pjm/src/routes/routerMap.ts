import { MainLayout } from 'dnp-core'
import overviewIcon from '@/assets/icons/sidebar/overview.svg'
import contractIcon from '@/assets/icons/sidebar/contract.svg'
import taskIcon from '@/assets/icons/sidebar/todo-list.svg'
import balanceIcon from '@/assets/icons/sidebar/dutoan.svg'
import projectIcon from '@/assets/icons/sidebar/project.svg'
import { RouterName, UriRole } from '@/routes/config.ts'

export const routes = [
  {
    path: '/',
    name: RouterName.HOME,
    component: MainLayout,
    redirect: '/welcome',
    hidden: false,
    meta: {
      title: 'Trang chủ',
      page: 'home'
    },
    children: [
      {
        hidden: true,
        path: '/welcome',
        name: RouterName.WELCOME,
        component: () => import('@/views/Welcome.vue'),
        meta: {
          page: 'welcome'
        }
      },
      {
        path: '/dashboard',
        name: RouterName.DASHBOARD,
        component: () => import('@/views/ComingSoon.vue'),
        meta: {
          title: 'Tổng quan',
          icon: overviewIcon,
          page: 'dashboard'
        },
        hidden: false
      },
      {
        path: '/project-management',
        name: RouterName.PROJECT_MANAGEMENT,
        component: () => import('@/views/project-management/index.vue'),
        meta: {
          title: 'Thông tin dự án',
          icon: projectIcon,
          page: 'project-management'
        },
        hidden: false,
        children: [
          {
            path: '/project-management/project-list',
            name: RouterName.PROJECT_LIST,
            component: () => import('@/views/project-management/project-list/index.vue'),
            meta: {
              title: 'Danh sách dự án'
              // uriRole: UriRole.PROJECT_LIST
            }
          },
          {
            path: '/project-management/project-list/:id',
            name: RouterName.PROJECT_DETAIL,
            component: () =>
                import('@/views/project-management/project-list/project-detail/index.vue'),
            meta: {
              title: 'Chi tiết dự án'
              // uriRole: UriRole.PROJECT_DETAIL
            }
          },
          {
            path: '/project-management/contractor',
            name: RouterName.PROJECT_CONTRACTOR_LIST,
            component: () => import('@/views/project-management/contractor/index.vue'),
            meta: {
              title: 'Danh sách nhà thầu'
              // uriRole: UriRole.PROJECT_LIST
            }
          }
        ]
      },
      {
        path: '/customer-service',
        name: RouterName.CUSTOMER_SERVICE,
        component: () => import('@/views/ComingSoon.vue'),
        meta: {
          title: 'Quản lý hợp đồng',
          icon: contractIcon,
          page: RouterName.CUSTOMER_SERVICE
        },
        hidden: false
      },
      {
        path: '/production-operation',
        name: RouterName.PRODUCTION_OPERATION,
        component: () => import('@/views/ComingSoon.vue'),
        meta: {
          title: 'Quản lý công việc',
          icon: taskIcon,
          page: RouterName.PRODUCTION_OPERATION
        },
        hidden: false
      },
      {
        path: '/network-manage',
        name: RouterName.NETWORK_MANAGE,
        component: () => import('@/views/ComingSoon.vue'),
        meta: {
          title: 'Quản lý dự toán',
          icon: balanceIcon,
          page: RouterName.NETWORK_MANAGE
        },
        hidden: false
      }
    ]
  },
  {
    path: '/login',
    name: RouterName.LOGIN,
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouterName.NOT_FOUND,
    component: () => import('@/views/exception/404.vue')
  },
  {
    path: '/403',
    name: RouterName.NOT_HAVE_PERMISSION,
    component: () => import('@/views/exception/403.vue')
  }
]
