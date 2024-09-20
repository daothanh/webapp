<template>
  <a-menu mode="inline" @click="onToggle">
    <template v-for="m in menus" :key="m.path">
      <MenuItem :menu="m" :collapsed="collapsed" />
    </template>
  </a-menu>
</template>

<script lang="ts" setup>
import type {RouteLocationNormalizedLoaded} from "vue-router";
import MenuItem from './SideMenuItem.vue'

defineProps({
  menus: {
    type: Array<RouteLocationNormalizedLoaded>,
    required: true
  },
  collapsed: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['toggleCollapse'])
const onToggle = () => {
  emits('toggleCollapse')
}
</script>

<style scoped></style>
