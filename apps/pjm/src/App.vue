<script setup lang="ts">
import { computed, onMounted } from 'vue'
import vi_VN from 'ant-design-vue/es/locale/vi_VN'
import dayjs from 'dayjs'
import { useGlobalStore } from '@/stores/globalStore.ts'
import 'dayjs/locale/vi'
import { setTheme } from '@/utils/setupDefaultSetting.ts'
import { useActiveAppStore } from "dnp-core";
import { storeToRefs } from "pinia";

const { activeApp } = storeToRefs(useActiveAppStore())
activeApp.value = "Quản lý dự án"

dayjs.locale('en')
const loading = computed(() => {
  const globalStore = useGlobalStore()
  const {
    state: { loading }
  } = globalStore
  return loading
})
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 2,
    fontFamily: "'Quicksand', sans-serif",
    fontFeatureSettings: 'tnum',
  }
}

onMounted(() => {
  setTheme()
})
</script>

<template>
  <div v-if="loading" class="h-screen flex flex-col items-center justify-center">
    <a-spin tip="Đang tải ..." />
  </div>
  <a-config-provider v-else :locale="vi_VN" :theme="theme">
    <router-view v-slot="{ Component }">
      <div>
        <component :is="Component" />
      </div>
    </router-view>
  </a-config-provider>
</template>

<style scoped></style>
