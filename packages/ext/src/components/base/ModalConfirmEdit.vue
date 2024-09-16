<template>
  <a-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="378"
    :mask-closable="false"
    class="modal-confirm-edit"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="flex items-center space-x-2">
        <InfoCircleOutlined style="color: orange" />
        <h4 class="m-0 text-base">Thoát khỏi trang</h4>
      </div>
    </template>
    <div class="confirm-exit-modal-wrapper">
      <span>Các thay đổi của bạn chưa được lưu. Bạn vẫn muốn thoát trang?</span>
      <div class="mt-5 flex justify-end gap-3">
        <a-button @click="onSubmit">Thoát</a-button>
        <a-button type="primary" @click="handleCancel">Ở lại</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { InfoCircleOutlined } from '@ant-design/icons-vue'

export default {
  name: 'ModalConfirmEdit',
  components: { InfoCircleOutlined },
  props: ['visible', 'onCancel', 'onSubmit'],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    handleCancel() {
      this.onCancel(false)
    }
  }
}
</script>
<style lang="scss">
.modal-confirm-edit {
  padding-bottom: 150px !important;
  .ant-modal-body {
    padding: 15px 24px 24px 24px;
  }
}
</style>
