<template>
  <a-dropdown :trigger="['click']">
    <template #overlay>
      <a-menu>
        <a-menu-item key="1" @click="toggleDrawer">
          <div class="flex items-center space-x-1 font-bold">
            <user-outlined />
            <span>Tài khoản cá nhân</span>
          </div>
        </a-menu-item>
        <a-menu-item key="2" @click="handleLogout">
          <div class="flex items-center space-x-1 font-bold">
            <logout-outlined />
            <span>Thoát ứng dụng</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
    <div class="name-account flex items-center space-x-1 cursor-pointer">
      <a-avatar shape="circle" style="background-color: #fa284e" size="small">
        <span :class="`font-semibold`">{{ userInfo.userName?.slice(0, 1) }}</span>
      </a-avatar>
      <span :class="`font-bold text-xs `">{{ userInfo.userName }}</span>
      <down-outlined style="font-size: 14px" />
    </div>
  </a-dropdown>
<!--  <account-drawer
    :visible-prop="visibleDrawer"
    :user-info="userInfo"
    @on-close-drawer="toggleDrawer"
  />-->
</template>

<script lang="ts">
export default {
  name: 'AvatarHeader'
}
</script>
<script setup lang="ts">
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'
// import AccountDrawer from './AccountDrawer.vue'
import { ref } from 'vue'
import { Modal } from 'ant-design-vue'
import { useAuthStore } from '../../../stores'
import { KEY_LOCAL } from '../../../contants'
import { useUtils } from "../../../composable";
import { useLocalStorage } from "../../../composable";

const visibleDrawer = ref<boolean>(false)

const { auth, logOutServer } = useAuthStore()
const { userInfo } = auth
const toggleDrawer = () => {
  visibleDrawer.value = !visibleDrawer.value
}

const handleLogout = () => {
  Modal.confirm({
    title: 'Xác nhận đăng xuất',
    content: 'Bạn có thực sự muốn đăng xuất?',
    okText: 'OK',
    style: 'top: 80px; font-weight: 600',
    cancelText: 'Hủy',
    onOk: async () => {
      try {
        const { getItemFromCookies } = useUtils()
        const lcStorage = useLocalStorage()
        const refreshToken = getItemFromCookies(`${KEY_LOCAL}refresh_token`)
        const userInfo = lcStorage.getItem(`${KEY_LOCAL}user_info`)
        // Logout phía server
        const data = {
          clientId: import.meta.env.VITE_CLIENT_ID,
          refreshToken,
          username: userInfo?.userName || ''
        }
        await logOutServer(data)
      } finally {
        logOut()
      }
    }
  })
}
</script>

<style lang="scss">
.name-account {
  .ant-avatar {
    display: flex;
    align-items: center;
    width: 28px;
    height: 28px;
  }
}
</style>
