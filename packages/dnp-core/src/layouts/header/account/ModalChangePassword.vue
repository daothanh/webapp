<template>
  <a-modal
    v-model:visible="visibleModal"
    type="success"
    ok-text="Đóng"
    :cancel-button-props="{ style: 'display: none' }"
    centered
    @ok="closeModal"
  >
    <template #title>
      <div class="flex items-center space-x-2">
        <InfoCircleOutlined style="color: orange" />
        <h4 class="uppercase m-0 font-bold">Cảnh báo</h4>
      </div>
    </template>
    <p>Bạn cần thay đổi mật khẩu trong vòng 24h kể từ khi cấp tài khoản truy cập.</p>
    <p>Nếu không thực hiện thay đổi, tài khoản của bạn sẽ bị khóa!</p>
    <div class="italic font-normal">
      <p>Hướng dẫn truy cập chức năng Đổi mật khẩu:</p>
      <div class="ml-4">
        <div>Bước 1: Tại góc phải màn hình, người dùng nhấn chuột vào Tên đăng nhập.</div>
        <div>Bước 2: Chọn mục Tài khoản cá nhân.</div>
        <div>
          Bước 3: Nhấn chuột vào <EditOutlined class="text-primary mx-1" /> chỉnh sửa và thực hiện
          theo chỉ dẫn.
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ModalWarningChangePassword'
}
</script>

<script setup>
import { ref, watch } from 'vue'
import { InfoCircleOutlined, EditOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})
const visibleModal = ref(false)

watch(
  () => props.visible,
  () => {
    visibleModal.value = props.visible
  },
  {
    immediate: true
  }
)
const emits = defineEmits(['closeModal'])

const closeModal = () => {
  visibleModal.value = false
  emits('closeModal')
}
</script>

<style scoped></style>
