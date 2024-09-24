<template>
  <div class="flex items-center gap-8 overflow-auto">
    <div v-for="menu in MENU_TOP" :key="menu.id" class="px-2">
      <a-dropdown>
        <a class="flex items-center gap-1" :class="activeApp.menuId === menu.id ? 'text-[#fa284e]' : ''" @click.prevent>
          <strong class="uppercase text-[15px] text-primary block whitespace-nowrap">
            {{ menu.name }}</strong
          >
          <DownOutlined :style="{ color: 'var(--color-primary)' }" class="w-3 h-3" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item
                v-for="m in menu.children"
                :key="m.id"
                class="font-semibold hover:bg-primary hover:text-white"
                :class="activeApp.menuId === m.id ? '!text-[#fa284e]' : 'text-primary'"
                @click="handleMenuClick(menu, m)"
            >{{ m.name }}</a-menu-item
            >
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <strong
        class="uppercase text-[15px] mr-1 text-[#fa284e] border-b-2 border-b-[#fa284e] whitespace-nowrap"
    >
      {{ activeApp.label }}
    </strong>
  </div>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { h } from 'vue'
import { useUtils } from '../../composable'
import { KEY_LOCAL } from '../../contants'
import { MENU_TOP } from './config.ts'
import { useActiveAppStore } from '../../stores'
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores";

const { activeApp } = storeToRefs(useActiveAppStore())
const { getItemFromCookies } = useUtils()
const handleMenuClick = async (
    parent: { open: boolean },
    menu: { url: string; name: string; clientId: string }
) => {
  parent.open = false
  if (!menu.url) return
  Modal.confirm({
    title: h('p', ['Bạn có muốn tiếp tục đăng nhập với ứng dụng ', h('strong', menu.name), '?']),
    okText: 'Tiếp tục',
    cancelText: 'Hủy bỏ',
    width: 450,
    onOk() {
      return new Promise((resolve, reject) => {
        const refreshToken = getItemFromCookies(`${KEY_LOCAL}refresh_token`)
        const { exchangeToken } = useAuthStore()
        exchangeToken({ refreshToken, newClientId: menu.clientId })
            .then((res) => {
              if (res.message === 'SUCCESS') {
                const { refresh_token, access_token } = res.body
                window.open(
                    `${menu.url}/login?refresh_token=${refresh_token}&access_token=${access_token}`,
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
console.log(MENU_TOP)
</script>
