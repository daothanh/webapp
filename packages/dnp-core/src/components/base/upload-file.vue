<template>
  <div class="upload-file w-full">
    <a-upload
      :file-list="fileList"
      list-type="file"
      :accept="fileType"
      :max-count="max"
      :before-upload="handleBeforeUpload"
      :custom-request="handleUpload"
    >
      <a v-if="fileList.length < max && !disabled" class="underline">
        <div v-if="uploading"><loading-circle /></div>
        <div v-else class="flex items-center gap-[5px] justify-center">
          <upload-outlined />
          <span class="text-[12px]">{{ placeholder }}</span>
        </div>
      </a>
      <template #itemRender="{ file }">
        <div class="flex items-center justify-between space-x-2 w-full">
          <div class="flex items-center space-x-1">
            <paper-clip-outlined />
            <a
              target="_blank"
              :href="file?.url || null"
              :style="file.status === 'error' ? 'color: red' : ''"
              class="w-full link font-[500] text-[13px] cursor-pointer break-all overflow-hidden text-ellipsis"
            >
              {{ file.name }}
            </a>
          </div>
          <div v-if="isDownloadFile" class="flex justify-end">
            <a target="_blank" :href="file?.url || null">
              <a-tooltip>
                <download-icon :width="10" />
                <template #title>Tải xuống file tài liệu</template>
              </a-tooltip>
            </a>
          </div>
          <div v-if="!disabled" class="flex justify-end">
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa file này?"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="handleRemove(file)"
            >
              <delete-icon class="cursor-pointer" :width="13" />
            </a-popconfirm>
          </div>
        </div>
      </template>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons-vue'
import DeleteIcon from '../../ui/icons/delete-icon.vue'
import DownloadIcon from '../../ui/icons/download-icon.vue'
import { useSysStore } from '../../stores'

type FileProp = {
  id: number
  fileUrl: string
  fileName: string
  key: string
  publicKey?: string
}

interface IProps {
  files: FileProp[] | any
  max?: number
  visible?: boolean
  fileType?: string
  placeholder?: string
  maxFileSize?: number
  noLimit?: boolean
  disabled?: boolean
  isDownloadFile?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  max: 1,
  files: [],
  visible: false,
  fileType: '.xlsx',
  placeholder: 'Upload file',
  maxFileSize: 10,
  noLimit: false,
  disabled: false,
  isDownloadFile: false
})

const { uploadFile } = useSysStore()
const uploading = ref(false)
const fileList = ref([])

const emit = defineEmits(['onChange'])

const handleRemove = (file) => {
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
  emit('onChange', { fileList: fileList.value, isDeleted: true })
}

const handleBeforeUpload = (file) => {
  if (!props.noLimit) {
    const isExcel =
      props.fileType === '.xlsx'
        ? ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)
        : true
    const isValid = fileList.value.length < props.max
    const isCheckSizeFile = file.size <= props.maxFileSize * Math.pow(10, 6)

    if (!isExcel) {
      message.error('Vui lòng tải lên file excel dạng (.xlsx)')
    } else if (!isValid) {
      message.error(`Vui lòng chọn tối đa ${props.max} file`)
    } else if (!isCheckSizeFile) {
      message.error(`Không thể tải lên tệp tin có dung lượng lớn hơn ${props.maxFileSize}MB`)
    }
    return isExcel && isValid && isCheckSizeFile
  }
  return true
}

const handleUpload = async ({ file }) => {
  uploading.value = true

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await uploadFile(formData)

    if (response.message === 'SUCCESS') {
      fileList.value = [
        {
          url: response.body.fileUrl,
          uid: response.body.id,
          name: file.name,
          key: response.body.key
        },
        ...fileList.value
      ]

      emit('onChange', { fileList: fileList.value })
    } else {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau!')
    }
  } finally {
    uploading.value = false
  }
}

watch(
  () => props.visible,
  () => {
    if (props.visible) {
      fileList.value =
        props.files?.map((f) => {
          return {
            url: f.fileUrl,
            uid: f.id,
            name: f.fileName,
            key: f.publicKey
          }
        }) || []
    } else {
      fileList.value = []
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss">
.upload-file {
}
</style>
