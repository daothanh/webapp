<template>
  <div class="menu-top w-full h-full mr-4 flex items-center space-x-12 overflow-x-auto flex-nowrap">
    <div v-for="menu in menus" :key="menu.id" class="h-full flex items-center">
      <div
        class="list !hidden md:!flex flex-center"
        :class="{
          'menu-active': menu.clientId === clientId,
          'cursor-pointer': menu.clientId && menu.clientId !== clientId
        }"
        @click="menu.clientId && menu.clientId !== clientId ? handleClickMenu(menu) : null"
      >
        {{ menu.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuTop'
}
</script>

<script setup>
import { ref, h, computed } from 'vue'
import { authAPI } from '@/apis/auth'
import { getItemFromLocalStorage, setItemToLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import { Modal } from 'ant-design-vue'
import { MENU_TOP } from '@/components/menu-top/config.ts'
import { RouterName } from '@/routes/config.ts'

const menus = ref(MENU_TOP)
const clientId = computed(() => import.meta.env.VITE_CLIENT_ID || 'WP_BOC')

const handleClickMenu = async (menu) => {
  Modal.confirm({
    title: h('p', ['Bạn có muốn tiếp tục đăng nhập với ứng dụng ', h('strong', menu.name), '?']),
    okText: 'Tiếp tục',
    cancelText: 'Hủy bỏ',
    width: 450,
    onOk() {
      return new Promise((resolve, reject) => {
        const refreshToken = getItemFromLocalStorage(`${KEY_LOCAL}refresh_token`)

        authAPI
          .exchangeToken({ refreshToken, newClientId: menu.clientId })
          .then((res) => {
            if (res.message === 'SUCCESS') {
              const { refresh_token, access_token } = res.body
              // setItemToLocalStorage(`${KEY_LOCAL}refresh_token`, refresh_token)
              // setItemToLocalStorage(`${KEY_LOCAL}access_token`, access_token)
              window.open(
                `${menu.url}/login?refresh_token=${refresh_token}&access_token=${access_token}`,
                // `http://localhost:3001/user/login?refresh_token=${refresh_token}&access_token=${access_token}`,
                '_blank'
              )

              resolve()
            }
          })
          .catch((e) => reject(e))
      })
    }
  })
}
</script>

<style lang="scss">
.menu-top {
  .list {
    text-transform: uppercase;
    height: 100%;
    text-wrap: nowrap;
    transition: all 0.3s;
    color: #05428c;
    font-style: normal;
    font-size: 15px;
    line-height: 19px;
    font-weight: 700;
  }

  .list + .list {
    margin-left: 40px;
    @media (max-width: 767px) {
      margin-left: 0px;
    }
  }
  .menu-active {
    border-bottom: 2px solid #05428c;
    display: flex !important;
    @media (max-width: 767px) {
      border-bottom: none;
    }
  }
}
</style>
