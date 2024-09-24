<template>
  <div :class="`bg-white ${customClass}`">
    <div class="p-2 flex justify-between items-center sticky top-0 left-0 right-0 z-[90]">
      <div class="flex items-center space-x-3">
        <div @click="toggleMenu">
          <menu-outlined style="font-size: 20px; color: #05428c" />
        </div>
        <router-link :to="{ path: '/' }">
          <img src="/logo.jpg" alt="" style="width: 150px; height: auto" />
        </router-link>
      </div>

      <avatar-header />
    </div>
    <div class="flex justify-between items-center px-2 pb-2 space-x-2">
      <p class="m-0 text-primary font-bold underline underline-offset-4">Quản lý mạng lưới</p>

      <a-popover placement="right">
        <template #content>
          <div v-for="app in appList" :key="app.id">
            <a
              :href="app.url || '#!'"
              target="_blank"
              :class="['text-black block p-1.5', { 'text-primary font-semibold': app.url }]"
              >{{ app.name }}</a
            >
          </div>
        </template>
        <a-button>Chuyển nghiệp vụ</a-button>
      </a-popover>
    </div>
  </div>
  <a-drawer
    class="menu-drawer fixed left-0 top-0 bottom-0"
    placement="left"
    :width="350"
    :visible="visibleMenu"
    :closable="false"
    @close="visibleMenu = false"
  >
    <div>
      <div class="pl-6 py-4 logo">
        <img src="/logo_sider_bar_white.jpg" alt="" style="width: 150px; height: auto" />
      </div>

      <a-menu mode="inline" @click="visibleMenu = false">
        <template v-for="m in menus" :key="m.path">
          <SideMenuItem :menu="m" :collapsed="false" />
        </template>
      </a-menu>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import AvatarHeader from './account/index.vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import SideMenuItem from '../menu/SideMenuItem.vue'
import { appList } from './config.ts'

const visibleMenu = ref(false)

const props = defineProps({
  menus: {
    type: Array
  },
  customClass: {
    type: String
  }
})

const toggleMenu = () => {
  visibleMenu.value = !visibleMenu.value
}
</script>

<style lang="scss">
.menu-drawer {
  .ant-drawer-body {
    padding: 0 !important;
    background: linear-gradient(180deg, #173479 0%, #199ae3 38.23%, #199ae3 100%);
  }

  .ant-menu-inline {
    border-right: unset !important;
  }
}

.logo {
  border-bottom: 1px #ccc solid;
}
</style>
