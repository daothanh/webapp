<template>
  <a-menu mode="inline" @click="handleClick">
    <template v-for="m in menus" :key="m.path">
      <SiderMenuItem :menu="m" :collapsed="collapsed" />
    </template>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, onUpdated } from 'vue'
import SiderMenuItem from '@/components/menu/SideMenuItem.vue'

export default defineComponent({
  components: {
    SiderMenuItem
  },
  props: {
    menus: {
      type: Array,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const handleClick = () => {
      emit('toggleCollapse')
    }

    return {
      handleClick
    }
  }
})
</script>

<style scoped></style>
