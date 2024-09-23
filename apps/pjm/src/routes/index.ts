import {
    createRouter,
    createWebHistory
} from 'vue-router'
import type {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import {useAuthStore,KEY_LOCAL, useUtils, useLocalStorage } from 'dnp-core'
import {routes} from '@/routes/routerMap'
import {RouterName} from '@/routes/config.ts'
import {useGlobalStore} from '@/stores/globalStore.ts'

const lc = useLocalStorage()
const { isEmptyObject } = useUtils()
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
        // Lấy thông tin user
        const authStore = useAuthStore()
        const globalStore = useGlobalStore()

        if (!authStore.auth.isAuthentication) {
            globalStore.setLoading(true)

            try {
                const res = await authStore.getUserInfo()
                if (res?.message === 'SUCCESS') {
                    authStore.setAuth({
                        userInfo: res.body,
                        isAuthentication: true,
                        showModalChangePassword: res?.body?.rqrChangePwd || false
                    })
                }
            } catch (e) {
                console.log(e)
            } finally {
                globalStore.setLoading(false)
            }
        }

        if (to.name === 'welcome' || to.name === 'error') {
            next()
        } else if (authStore.auth.userInfo?.email && !authStore.auth.userInfo?.authorization.length) {
                next('/403')
            } else if (to?.meta?.uriRole && !isEmptyObject(authStore.auth.userInfo)) {
                if (authStore.hasRole(to?.meta?.uriRole as string)) {
                    next()
                } else {
                    next('/403')
                }
            } else {
                next()
            }
    }
)

export default router
