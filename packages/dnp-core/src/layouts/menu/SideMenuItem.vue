<template>
  <a-menu-item
    v-if="!menu.hidden"
    :key="menu.path"
    :class="[{ 'menu-active': activeMenu }, 'c-menu-item']"
  >
    <template v-if="menu.meta.icon" #icon>
      <img :alt="menu.meta.title" :src="menu.meta.icon" class="w-[20px] h-[20px]" />
    </template>
    <router-link :to="menu.path">
      <span>{{ menu.meta.title }}</span>
    </router-link>
  </a-menu-item>
</template>

<script lang="ts" setup>
import {type PropType, ref, watch} from 'vue'
import {type RouteLocationNormalizedLoaded, useRoute} from "vue-router";

const props = defineProps({
  menu: {
    type: Object as PropType<RouteLocationNormalizedLoaded>,
    required: true
  },
  collapsed: {
    type: Boolean,
    required: true
  }
})
const activeMenu = ref(false)
const route = useRoute()
watch(route, (val) => {
  if (val) {
    activeMenu.value = val?.name?.includes(props.menu.meta.page)
  }
}, {deep: true, immediate: true})
</script>

<style lang="scss">
.ant-menu-item.menu-active {
  background: var(--color-menu-active) !important;
}
.ant-menu .ant-menu-item.c-menu-item.ant-menu-item-selected {
  background: transparent;
}
</style>
