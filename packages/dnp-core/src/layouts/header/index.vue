<template>
  <div
      :class="`header px-3 h-[50px] flex items-center justify-between  bg-white ${
      isOpenSideBar ? (sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed') : null
    }`"
  >
    <menu-top />
    <div class="flex items-center space-x-6">
<!--      <avatar-header />-->
    </div>
  </div>
</template>

<script lang="ts">
</script>
<script setup lang="ts">
import { computed } from 'vue'
import MenuTop from '../menu-top/index.vue'

const props = defineProps<{
  sidebarOpened: boolean
  sidebarSlide: boolean
}>()

const isOpenSideBar = computed(() => {
  return props.sidebarSlide
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
