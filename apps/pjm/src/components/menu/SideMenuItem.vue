<template>
  <a-menu-item
    v-if="!menu.hidden"
    :key="menu.path"
    :class="[{ 'menu-active': activeMenu }, 'c-menu-item']"
  >
    <template v-if="menu.meta.icon" #icon>
      <img :src="menu.meta.icon" class="w-[20px] h-[20px]" />
    </template>
    <router-link :to="menu.path">
      <span>{{ menu.meta.title }}</span>
    </router-link>
  </a-menu-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MailOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  props: {
    menu: {
      type: Object,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      activeMenu: false
    }
  },
  watch: {
    '$route.name': {
      handler: function () {
        if (this.$route.name) {
          this.activeMenu = this.$route.name.includes(this.menu.meta.page)
        }
      },
      deep: true,
      immediate: true
    }
  }
})
</script>

<style lang="scss">
.ant-menu-item.menu-active {
  background: var(--color-menu-active) !important;
}
.ant-menu .ant-menu-item.c-menu-item.ant-menu-item-selected {
  background: transparent;
}
</style>
