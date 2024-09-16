import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'
import { routes } from '@/routes/routerMap'
import { checkRoles, isEmptyObject, setItemToLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import { useAuthStore } from '@/stores/authStore.ts'
import { getUserInfo } from '@/apis/userInfoService.ts'
import { RouterName } from '@/routes/config.ts'
import { useGlobalStore } from '@/stores/globalStore.ts'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (window.innerWidth < 768 && to.meta.hasMobilePage) {
      window.location.replace(`${import.meta.env.VITE_WP_WDN_MOBILE_URL}${to.fullPath}`)
    }
    if (to.meta.title) {
      document.title = typeof to.meta.title === 'string' ? to.meta.title : 'Quản lý mạng lưới'
    }

    if (to.name === RouterName.LOGIN) {
      return next()
    }
    const { auth } = useAuthStore()

    const { isAuthentication } = auth

    // Lấy thông tin user
    const authStore = useAuthStore()
    const globalStore = useGlobalStore()

    if (!isAuthentication) {
      globalStore.setLoading(true)

      try {
        const res = await getUserInfo()
        if (res?.message === 'SUCCESS') {
          authStore.setUserInfo(res.body)
          authStore.setIsAuthentication(true)
          authStore.setShowModalChangePassword(res?.body?.rqrChangePwd || false)
          setItemToLocalStorage(`${KEY_LOCAL}user_info`, res.body)
        }
      } catch (e) {
        console.log(e)
      } finally {
        globalStore.setLoading(false)
      }
    }

    const {
      auth: { userInfo }
    } = useAuthStore()

    if (to.name === 'welcome' || to.name === 'error') {
      next()
    }

    if (userInfo?.email && !userInfo?.authorization.length) {
      next('/403')
    } else {
      if (to?.meta?.uriRole && !isEmptyObject(userInfo)) {
        if (checkRoles(to?.meta?.uriRole as string)) {
          next()
        }
        next('/403')
      } else {
        next()
      }
    }
  }
)

export default router
