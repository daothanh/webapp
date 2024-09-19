<template>
  <a-drawer
    :width="width < 768 ? '100%' : 600"
    placement="right"
    :visible="visible"
    :closable="width < 768"
    @close="onClose"
  >
    <h2 class="uppercase text-center font-bold">Thông tin tài khoản</h2>
    <div class="flex items-center space-x-5 cursor-pointer">
      <a-avatar
        shape="circle"
        style="background-color: #fa284e"
        class="w-24 h-24 text-3xl flex justify-center items-center"
      >
        <span class="font-semibold">t</span>
      </a-avatar>
      <span class="font-bold text-lg">{{ userInfo.userName }}</span>
    </div>

    <section class="font-semibold">
      <div class="flex justify-between items-center">
        <a-divider orientation="left" orientation-margin="0px" class="font-bold">
          Tuỳ chỉnh tài khoản
        </a-divider>
      </div>

      <div>
        <a-row :gutter="16" class="mb-6">
          <a-col :span="6"><span>Tài khoản:</span></a-col>
          <a-col :span="13">
            <span class="flex truncate">{{ userInfo.userName }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mb-6">
          <a-col :span="6"><span>Email thông báo:</span></a-col>
          <a-col>
            <span class="flex truncate">{{ userInfo.contactEmail }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mb-6">
          <a-col :span="6"><span>Email xác thực:</span></a-col>
          <a-col>
            <span class="flex truncate">{{ userInfo.email }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mb-6">
          <a-col :span="6"><span>Số điện thoại:</span></a-col>
          <a-col>
            <span class="flex truncate">{{ userInfo.mobile }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="16" class="mb-6 flex items-center">
          <a-col :span="6"><span>Mật khẩu:</span></a-col>
          <a-col :span="13">
            <span class="flex truncate">{{ 'thuanhoangquang'.replace(/./g, '*') }}</span>
          </a-col>
          <a-col :span="5" class="flex">
            <EditOutlined class="text-primary text-lg" @click="showModalChangePassword = true" />
          </a-col>
        </a-row>
      </div>
    </section>
    <setting-theme />
    <a-modal
      :open="showModalChangePassword"
      :confirm-loading="loadingSendMail"
      :body-style="{ textAlign: 'center' }"
      :closable="false"
      :centered="true"
      @ok="handleSendMail"
    >
      <h1 style="text-align: center; font-weight: 700; font-size: 20px">Thông báo</h1>
      <p>Bạn hãy kiểm tra mail để thực hiện thay đổi mật khẩu này!</p>
    </a-modal>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EditOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import SettingTheme from '@/components/account/SettingTheme.vue'
import { changePassword } from '@/apis/userInfoService.ts'

const width = window.screen.width
const props = defineProps<{ visibleProp: boolean; userInfo: any }>()
const visible = computed(() => props.visibleProp)

const loadingSendMail = ref(false)
const showModalChangePassword = ref(false)

const emit = defineEmits(['onCloseDrawer'])
const onClose = () => {
  emit('onCloseDrawer')
}

const handleSendMail = async () => {
  loadingSendMail.value = true
  try {
    await changePassword()
  } catch (error) {
    message.error(error?.response?.data?.message)
  } finally {
    loadingSendMail.value = false
    showModalChangePassword.value = false
  }
}
</script>

<style scoped></style>
