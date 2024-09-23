<template>
  <a-drawer :width="700" placement="right" :visible="visible" @close="onClose">
    <template #title>
      <span class="font-bold uppercase">{{ title || 'Import file' }}</span>
    </template>

    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">Hủy</a-button>
      <a-button type="primary" :disabled="loading" @click="handleSubmit"> Lưu </a-button>
    </template>
    <a-spin :spinning="loading">
      <div class="flex justify-end">
        <a-tag
          v-if="orgUnitName"
          color="orange"
          style="margin-left: auto; font-size: 14px; margin-bottom: 16px"
        >
          {{ `Thuộc đơn vị: ${orgUnitName}` }}
        </a-tag>
      </div>
      <slot></slot>
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :md="{ span: 16 }" :xs="{ span: 24 }">
            <a-form-item label="File excel" v-bind="validateInfos.publicKey">
              <upload-file class="mb-2" :visible="visible" @on-change="handleChangeFile" />
            </a-form-item>
          </a-col>
        </a-row>
        <slot name="fileDemo"> </slot>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script lang="ts">
</script>
<script lang="ts" setup>
import { reactive, toRaw } from 'vue'
import { Form } from 'ant-design-vue'
import { useUtils } from '../../composable'

defineProps({
  visible: Boolean,
  loading: Boolean,
  orgUnitName: String,
  title: String,
  waterSupplyAreaList: Array
})
const { isEmptyObject } = useUtils()

const modelRef = reactive({
  publicKey: null
})

const rulesForm = reactive({
  publicKey: [
    {
      required: true,
      message: 'File là bắt buộc'
    }
  ]
})
const useForm = Form.useForm

const { resetFields, validateInfos, validate } = useForm(modelRef, rulesForm)

const getFileUrl = (fileName: string) => {
  const BASE_URL = 'https://qlml.dnpwater.vn/'
  return `${BASE_URL}${fileName}`
}
const handleChangeFile = (file) => {
  if (!isEmptyObject(file.fileList)) {
    modelRef.publicKey = file.fileList[0]?.key || null
  }
}

const emit = defineEmits(['closeDrawer', 'onSubmit'])

const handleSubmit = async () => {
  const data = {
    ...toRaw(modelRef)
  }

  validate().then(() => {
    emit('onSubmit', data)
  })
}
const onClose = () => {
  resetFields()
  emit('closeDrawer')
}

// const setFields = (record) => {
//   modelRef.dmxId = record.dmxId
// }
//
// watch(
//   props,
//   () => {
//     modelRef.dmxId = props?.dmxId
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// )
</script>

<style scoped></style>
