<template>
  <div class="h-screen w-full flex items-center justify-center">
    <div class="flex flex-col justify-center gap-y-2">
      <a-spin tip="Đang cập nhật ..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getItemFromLocalStorage, setItemToLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import { useAuthStore } from '@/stores/authStore.ts'
import { RouterName } from '@/routes/config.ts'
import { getUserInfo } from '@/apis/userInfoService.ts'
import { message } from 'ant-design-vue'

onMounted(async () => {
  const route = useRoute()
  const router = useRouter()
  const { refresh_token, access_token } = route.query
  const authStore = useAuthStore()
  if (refresh_token && access_token) {
    try {
      const res = await getUserInfo(access_token as string)
      if (
        res.message === 'SUCCESS' &&
        res.body.authorization &&
        res.body.authorization.length > 0
      ) {
        await setItemToLocalStorage(`${KEY_LOCAL}access_token`, access_token)
        await setItemToLocalStorage(`${KEY_LOCAL}refresh_token`, refresh_token)
        authStore.setUserInfo(res.body)
        authStore.setIsAuthentication(true)
        authStore.setShowModalChangePassword(res?.body?.rqrChangePwd || false)
        setItemToLocalStorage(`${KEY_LOCAL}user_info`, res.body)
        await router.replace({ path: '/welcome' })
        setItemToLocalStorage(`${KEY_LOCAL}client_id`, 'WP_WDNM')
      } else {
        window.location.replace(import.meta.env.VITE_REDIRECT_URL)
      }
    } catch (e) {
      console.log(e)
    }
    // router.replace({ path: '/' })
  } else if (!localStorage.getItem(`${KEY_LOCAL}_TOKEN`)) {
    window.location.replace(import.meta.env.VITE_REDIRECT_URL)
  }
})
</script>

<style scoped></style>
