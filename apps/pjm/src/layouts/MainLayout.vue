<template>
  <a-layout has-sider>
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :collapsed-width="width > 1024 ? 64 : 44"
      width="280px"
      style="height: 100vh; position: sticky; top: 0; left: 0"
      :class="[
        'z-[1000] transition-all sm:block hidden',
        { 'slide-bar-out': !collapseSideBar && collapsed }
      ]"
    >
      <div :class="[`py-2 px-5 flex items-center justify-center h-[48px]`]">
        <router-link v-if="!collapsed" :to="{ path: '/' }">
          <img src="/logo_sider_bar_white.jpg" alt="" style="width: 75%; height: auto" />
        </router-link>
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          style="color: white; font-size: 24px"
          @click="handleCollapseMenu"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          style="color: white; font-size: 24px"
          @click="handleCollapseMenu"
        />
      </div>
      <SiderMenu :menus="menus" :collapsed="collapsed" @toggle-collapse="toggleCollapse" />
    </a-layout-sider>
    <a-layout
      class="layout-main-content transition-all"
      :class="`layout-${nameRouter?.name?.replace(/[./]/g, '-')} `"
    >
      <global-header
        class="sm:flex hidden"
        :sidebar-opened="!collapsed"
        :sidebar-slide="collapseSideBar"
      />
      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
      <global-footer />
    </a-layout>
  </a-layout>
  <modal-warning-change-password
    :visible="showModalChangePassword"
    @close-modal="closeModalWarningChangePassword"
  />
</template>

<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiderMenu from '@/components/menu/SideMenu.vue'
import GlobalHeader from '@/components/header/index.vue'
import GlobalFooter from '@/components/footer/index.vue'
import { getItemFromLocalStorage, setItemToLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import { useAuthStore } from '@/stores/authStore.ts'
import ModalWarningChangePassword from '@/components/account/ModalChangePassword.vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const width = window.screen.width
const nameRouter = useRoute()
const menus = ref([])
const collapsed = ref<boolean>(false)
const {
  auth: { showModalChangePassword }
} = useAuthStore()

const globalStore = useGlobalStore()

onMounted(() => {
  const originRouter = useRouter()
  const routerMenu = originRouter.getRoutes().find((item) => item.path === '/')
  menus.value = (routerMenu && routerMenu.children) || []

  const collapseValue = getItemFromLocalStorage(`${KEY_LOCAL}collapsedSideMenu`)
  collapsed.value = typeof collapseValue === 'boolean' ? collapseValue : false
  globalStore.setMenu(collapsed.value)
})

const toggleCollapse = () => {
  if (!collapsed.value) {
    setItemToLocalStorage(`${KEY_LOCAL}collapsedSideMenu`, true)
    collapsed.value = true
    globalStore.setMenu(true)
  }
}
const handleCollapseMenu = () => {
  collapsed.value = !collapsed.value
  setItemToLocalStorage(`${KEY_LOCAL}collapsedSideMenu`, collapsed.value)
  globalStore.setMenu(collapsed.value)
}

const closeModalWarningChangePassword = () => {
  const authStore = useAuthStore()
  authStore.setShowModalChangePassword(false)
}

const collapseSideBar = ref(true)

watch(
  nameRouter,
  () => {
    collapseSideBar.value = true
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="scss">
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  transform: scale(1.5);
}
.layout-main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 8px 0 8px 8px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.slide-bar-out {
  flex: 0 0 0 !important;
  max-width: 0 !important;
  min-width: 0 !important;
  width: 0 !important;
}
</style>
