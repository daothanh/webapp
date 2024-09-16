<template>
  <div
    :class="`header px-3 h-[50px] flex items-center justify-between  ${
      $route?.name === RouterName.ANOMALY_MONITORING_ALERT_WARNING_STATISTICS
        ? 'bg-[#1e293b] pl-10'
        : 'bg-white '
    } ${
      isOpenSideBar ? (sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed') : null
    }`"
  >
    <menu-top />
    <!--    <notication-header class="mr-[10px]" />-->
    <avatar-header />
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlobalHeader'
}
</script>
<script setup lang="ts">
import MenuTop from '@/components/menu-top/index.vue'
import AvatarHeader from '@/components/account/index.vue'
import { RouterName } from '@/routes/config.ts'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import NoticationHeader from '@/components/notication/index.vue'

const props = defineProps<{
  sidebarOpened: boolean
  sidebarSlide: boolean
}>()

const route = useRoute()

const pageList = [
  RouterName.ANOMALY_MONITORING_ALERT_WARNING_STATISTICS,
  RouterName.ANOMALY_MONITORING_ALERT_DMX,
  RouterName.ANOMALY_MONITORING_ALERT_GENERAL
]
const isOpenSideBar = computed(() => {
  return props.sidebarSlide ? true : !pageList.includes(route?.name)
})
</script>
<style lang="scss" scoped>
.header {
  border-bottom: 2px solid #f5f5f5;
  z-index: 999;
  width: 100%;
  right: 0;
  transition: width 0.2s;
}
</style>
