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
      <LeftSideMenu :menus="menus" :collapsed="collapsed" @toggle-collapse="toggleCollapse" />
    </a-layout-sider>
    <a-layout
        class="layout-main-content transition-all"
        :class="`layout-${nameRouter?.name?.replace(/[./]/g, '-')} `"
    >
      <app-header
          class="hidden sm:flex"
          :sidebar-opened="!collapsed"
          :sidebar-slide="collapseSideBar"
      />
      <mobile-header custom-class="sm:hidden block" :menus="menus" />
      <a-layout-content
          class="main-content sm:my-12"
          :style="{
          padding: '8px',
          backgroundColor: '#f5f5f5'
        }"
      >
        <router-view />
      </a-layout-content>
      <app-footer />
    </a-layout>
  </a-layout>
<!--  <modal-warning-change-password
    :visible="showModalChangePassword"
    @close-modal="closeModalWarningChangePassword"
  />-->
</template>

<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalStorage } from "../composable";
import { KEY_LOCAL } from '../contants'
import { useThemeStore } from "../stores"
import LeftSideMenu from './menu/SideMenu.vue'
import AppHeader from './header/index.vue'
import AppFooter from './footer/index.vue'
// import ModalWarningChangePassword from './account/ModalChangePassword.vue'

const lcStorage = useLocalStorage()
const width = window.screen.width
const nameRouter = useRoute()
const menus = ref([])
const collapsed = ref<boolean>(false)

const { setMenu } = useThemeStore()
onMounted(() => {
  const originRouter = useRouter()
  const routerMenu = originRouter.getRoutes().find((item) => item.path === '/')
  menus.value = (routerMenu && routerMenu.children) || []

  const collapseValue = lcStorage.getItem(`${KEY_LOCAL}collapsedSideMenu`)
  collapsed.value = typeof collapseValue === 'boolean' ? collapseValue : false
  setMenu(collapsed.value)
})

const toggleCollapse = () => {
  if (!collapsed.value) {
    lcStorage.setItem(`${KEY_LOCAL}collapsedSideMenu`, true)
    collapsed.value = true
    setMenu(true)
  }
}
const handleCollapseMenu = () => {
  collapsed.value = !collapsed.value
  lcStorage.setItem(`${KEY_LOCAL}collapsedSideMenu`, collapsed.value)
  setMenu(collapsed.value)
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
