<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore.ts'
import { computed, onMounted } from 'vue'
import vi_VN from 'ant-design-vue/es/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { setTheme } from '@/utils/setupDefaultSetting.ts'

dayjs.locale('en')
const loading = computed(() => {
  const globalStore = useGlobalStore()
  const {
    state: { loading }
  } = globalStore
  return loading
})

onMounted(() => {
  setTheme()
})
</script>

<template>
  <div v-if="loading" class="h-screen flex flex-col items-center justify-center">
    <a-spin tip="Đang tải ..." />
  </div>
  <a-config-provider v-else :locale="vi_VN">
    <router-view v-slot="{ Component }">
      <div>
        <component :is="Component" />
      </div>
    </router-view>
  </a-config-provider>
</template>

<style scoped></style>
