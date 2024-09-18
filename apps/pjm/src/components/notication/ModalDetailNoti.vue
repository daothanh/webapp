<template>
  <a-modal
    class="modal-noti-detail"
    :width="'45%'"
    :visible="visible"
    :footer="null"
    @cancel="onClose"
  >
    <template #title>
      <div class="title space-x-1 font-bold">
        <span class="font-bold">{{ record.title }}</span>
        <span class="text-[22px] text-gray-400">.</span>
        <a-tooltip :title="record.createTime" placement="bottom">
          <span v-if="record.createTime" class="text-[13px] text-gray-400 hover:underline">{{
            formatRelativeTime(record.createTime)
          }}</span>
        </a-tooltip>
      </div>
    </template>

    <div class="flex-center">
      <a-spin :spinning="loading">
        <div class="container flex flex-col items-start justify-start">
          <div class="content w-[90%]">{{ infoNoti.content }}</div>
          <div
            v-if="infoNoti.listFile && infoNoti.listFile?.length"
            class="list-file flex flex-col mt-3 pl-[5px]"
          >
            <upload-file
              :file-type="null"
              :files="infoNoti.listFile"
              disabled
              :visible="loading || infoNoti.listFile?.length"
            />
          </div>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script lang="ts">
export default {
  name: 'ModalNotiDetail'
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { notiAppService } from '@/apis/notication'
import { formatRelativeTime } from '../../utils'

const props = defineProps<{
  visible: boolean
  record: any
}>()

const loading = ref(false)
const infoNoti = ref(false)

const emit = defineEmits(['close'])

const onClose = () => {
  emit('close')
}

const getData = async () => {
  loading.value = true
  infoNoti.value = {}

  try {
    const res = await notiAppService.detail({ id: props.record.id })

    if (res.message === 'SUCCESS') {
      infoNoti.value = res.body || {}
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => props.visible,
  () => {
    if (props.visible) {
      getData()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss">
.modal-noti-detail {
  .ant-spin-nested-loading {
    padding: 15px 24px 30px 24px;
    width: 100%;
  }
  .ant-modal-title {
    line-height: normal;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-header {
    padding: 12px 24px;
  }
  .ant-modal-close-x {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 45px;
  }
}
</style>
