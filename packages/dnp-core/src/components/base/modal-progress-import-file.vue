<template>
  <a-modal
    class="modal-progress-import-file"
    :visible="visible"
    :width="450"
    :title="!isSuccess ? 'Mã không thể import vui lòng kiểm tra lại' : ''"
    :footer="null"
    @cancel="handleClose"
  >
    <a-table
      bordered
      :pagination="false"
      :scroll="{ x: 'max-content', y: 300 }"
      :data-source="data"
      :columns="columnsTable"
    >
      <template #bodyCell="{ column, index, record }">
        <template v-if="column.dataIndex === 'index'"> {{ index + 1 }} </template>
        <template v-if="column.dataIndex === 'code'">
          <div class="h-full w-full relative">
            <span>{{ record.code }}</span>
            <div
              class="button-copy cursor-pointer absolute"
              @click="copyTextToClipboard(record.code)"
            >
              <CopyOutlined />
            </div>
          </div>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>
<script lang="ts">
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { useUtils } from '../../composable/utils.ts'

defineProps({
  visible: Boolean,
  loading: Boolean,
  isSuccess: {
    type: Boolean,
    default: false
  },
  data: Array
})

const { copyTextToClipboard } = useUtils()
const columnsTable = ref([
  {
    title: 'STT',
    dataIndex: 'index',
    align: 'center',
    width: 50
  },
  {
    title: 'Code',
    dataIndex: 'code',
    align: 'center'
  }
])

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss">
.modal-progress-import-file {
  .ant-table-cell {
    padding: 5px 10px;
  }
  .button-copy {
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    z-index: 10000;
  }
}
</style>
