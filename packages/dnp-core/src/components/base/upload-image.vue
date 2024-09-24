<template>
  <div class="upload-image w-full">
    <a-row :gutter="16">
      <a-col :span="4">
        <a-upload
          :disabled="disabled"
          :file-list="fileList"
          :list-type="'picture-card'"
          :before-upload="handleBeforeUpload"
          :custom-request="handleUpload"
          @preview="handlePreview"
          @remove="handleRemove"
        >
          <a-spin v-if="uploading" />
          <div v-if="!uploading && fileList.length < max">
            <plus-outlined />
            <div style="margin-top: 5px">Chọn ảnh</div>
          </div>
        </a-upload>
      </a-col>
      <a-col :span="20">
        <div class="flex flex-col">
          <img v-if="previewImage" alt="example" style="width: 100%" :src="previewImage" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import {useSysStore} from "../../stores";

type FileProp = {
  id: number
  fileUrl: string
  fileName: string
  key: string
  publicKey?: string
}

interface IProps {
  max: number
  files: FileProp[]
  disabled: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  max: 2,
  files: [],
  disabled: false
})
const { uploadFile } = useSysStore()
const uploading = ref(false)
const fileList = ref([])
const previewImage = ref('')
const previewTitle = ref('')

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

const handleRemove = (file) => {
  Modal.confirm({
    title: `Bạn có chắc chắn muốn xóa ảnh này không?`,
    okText: 'Xóa',
    cancelText: 'Hủy',
    onOk() {
      fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
      previewImage.value = fileList.value[0]?.url || ''
      previewTitle.value = ''
    }
  })
}

const handleBeforeUpload = (file) => {
  const isImage = file.type.includes('image')
  const isValid = fileList.value.length < props.max

  if (!isImage) {
    message.error('Vui lòng tải ảnh lên')
  } else if (!isValid) {
    message.error(`Vui lòng chọn tối đa ${props.max} ảnh`)
  }
  return isImage && isValid
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
          name: response.body.fileName,
          key: response.body.key
        },
        ...fileList.value
      ]
      previewImage.value = fileList.value[0]?.url || ''
    } else {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại sau!')
    }
  } finally {
    uploading.value = false
  }
}

const emit = defineEmits(['onChange'])

watch(
  () => fileList.value,
  () => {
    emit('onChange', fileList.value)
  },
  { deep: true, immediate: true }
)

watch(
  () => props.files,
  () => {
    fileList.value =
      props.files?.map((f) => {
        return {
          url: f.fileUrl,
          uid: f.id,
          name: f.fileName,
          key: f.publicKey
        }
      }) || []

    previewImage.value = fileList.value[0]?.url || ''
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss">
.upload-image {
  .ant-upload-list {
    flex-direction: column-reverse;
    display: flex;
  }
}
</style>
