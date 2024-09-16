<template>
  <a-drawer
    class="modal-create-contract"
    width="55%"
    placement="right"
    :visible="visible"
    @close="onClose"
  >
    <template #title>
      <span class="font-bold uppercase">{{ title }}</span>
    </template>

    <template v-if="!isDetail" #extra>
      <a-button style="margin-right: 8px" @click="onClose">Hủy</a-button>
      <a-button type="primary" :disabled="loading" @click="handleSubmit"> Lưu </a-button>
    </template>
    <a-spin :spinning="loading">
      <div class="flex justify-end">
        <a-tag
          v-if="record.assetProjectName"
          color="orange"
          style="margin-left: auto; font-size: 14px; margin-bottom: 16px"
        >
          {{ `Thuộc dự án: ${record.assetProjectName}` }}
        </a-tag>
      </div>
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :md="{ span: 8 }" :xs="{ span: 24 }">
            <a-form-item label="Số hợp đồng" v-bind="validateInfos.no">
              <a-input
                v-model:value="modelRef.no"
                placeholder="Nhập số hợp đồng"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 8 }" :xs="{ span: 24 }">
            <a-form-item label="Tên hợp đồng" v-bind="validateInfos.name">
              <a-input
                v-model:value="modelRef.name"
                placeholder="Nhập tên hợp đồng"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 8 }" :xs="{ span: 24 }">
            <a-form-item label="Gói thầu">
              <a-input
                v-model:value="modelRef.packageStr"
                placeholder="Nhập gói thầu"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Đối tác">
              <a-input
                v-model:value="modelRef.partner"
                placeholder="Nhập đối tác"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Ngày ký">
              <a-date-picker
                v-model:value="modelRef.signDate"
                allow-clear
                placeholder="Chọn ngày"
                class="w-full"
                :value-format="'DD/MM/YYYY'"
                :format="'DD/MM/YYYY'"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Loại hợp đồng" v-bind="validateInfos.type">
              <c-select
                v-model:value="modelRef.type"
                :options="typeContactList"
                placeholder="Chọn loại hợp đồng"
                allow-clear
                :field-names="{
                  label: 'name',
                  value: 'value'
                }"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Trạng thái hợp đồng" v-bind="validateInfos.state">
              <c-select
                v-model:value="modelRef.state"
                :options="stateContactList"
                placeholder="Chọn trạng thái hợp đồng"
                allow-clear
                :field-names="{
                  label: 'name',
                  value: 'value'
                }"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Giá trị hợp đồng">
              <i-number
                v-model="modelRef.contractValue"
                number-only
                placeholder="Nhập giá trị"
                :formatter="$filters.integerFormatter"
                :disabled="isDetail"
                :parser="$filters.numberCommaParser"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Giá trị thanh quyết toán">
              <i-number
                v-model="modelRef.setlementValue"
                number-only
                placeholder="Nhập giá trị"
                :formatter="$filters.integerFormatter"
                :parser="$filters.numberCommaParser"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Ngày thực hiện">
              <a-date-picker
                v-model:value="modelRef.startDate"
                allow-clear
                placeholder="Chọn ngày "
                class="w-full"
                :value-format="'DD/MM/YYYY'"
                :format="'DD/MM/YYYY'"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Ngày nghiệm thu">
              <a-date-picker
                v-model:value="modelRef.acceptanceDate"
                allow-clear
                placeholder="Chọn ngày "
                class="w-full"
                :value-format="'DD/MM/YYYY'"
                :disabled="isDetail"
                :format="'DD/MM/YYYY'"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 24 }" :xs="{ span: 24 }">
            <a-form-item label="Nội dung hợp đồng">
              <a-textarea
                v-model:value="modelRef.content"
                placeholder="Nhập nội dung"
                :rows="2"
                :maxlength="250"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 24 }" :xs="{ span: 24 }">
            <a-form-item label="Mô tả">
              <a-textarea
                v-model:value="modelRef.description"
                placeholder="Nhập mô tả"
                :rows="4"
                :maxlength="250"
                :disabled="isDetail"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script lang="ts">
export default {
  name: 'ModalCreateContract'
}
</script>
<script lang="ts" setup>
import { createVNode, reactive, ref, toRaw, watch } from 'vue'
import { Form, Modal } from 'ant-design-vue'
import {INumber} from 'ui'

const props = defineProps<{
  title: string
  visible: boolean
  isEdit: boolean
  isDetail: boolean
  record: any
  loading: boolean
  typeContactList: Array
  stateContactList: Array
}>()

const modelRef = ref({
  no: '',
  name: '',
  description: '',
  type: null,
  state: null,
  //giá trị hợp đồng
  contractValue: null,
  //giá trị thanh quyết toán
  setlementValue: null,
  //ngày thực hiện
  startDate: null,
  //đối tác
  partner: null,
  //ngày nghiệm thu
  acceptanceDate: null,
  //ngày ký
  signDate: null,
  //nội dung
  content: null,
  //gói thầu
  packageStr: null
})

const rulesForm = reactive({
  no: [
    {
      required: true,
      message: 'Số hợp đồng là bắt buộc'
    }
  ],
  name: [
    {
      required: true,
      message: 'Tên hợp đồng là bắt buộc'
    }
  ],
  state: [
    {
      required: true,
      message: 'Trạng thái hợp đồng là bắt buộc'
    }
  ],
  type: [
    {
      required: true,
      message: 'Loại hợp đồng là bắt buộc'
    }
  ]
})
const useForm = Form.useForm

const { resetFields, validateInfos, validate } = useForm(modelRef, rulesForm)

const emit = defineEmits(['closeDrawer', 'onSubmit'])

const handleSubmit = async () => {
  const data = {
    id: props.isEdit ? props.record?.id : undefined,
    ...toRaw(modelRef.value),
    additionalInfo: {
      contractValue: modelRef.value.contractValue,
      setlementValue: modelRef.value.setlementValue
    }
  }

  validate().then(() => {
    emit('onSubmit', data)
  })
}

const setField = (data) => {
  resetFields()

  modelRef.value = {
    ...data,
    no: data.no || '',
    name: data.name || '',
    description: data.description || '',
    type: data.type || null,
    state: data.state || null,
    contractValue: data.additionalInfo?.contractValue || null,
    setlementValue: data.additionalInfo?.setlementValue || null,
    startDate: data.startDate || null,
    acceptanceDate: data.acceptanceDate || null,
    partner: data.partner || null,
    content: data.content || null,
    signDate: data.signDate || null,
    packageStr: data.packageStr || null
  }
}

const onClose = () => {
  resetFields()
  emit('closeDrawer')
}

watch(
  () => props.visible,
  (newVal, oldVal) => {
    setField(props.record)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
.modal-create-contract {
  .ant-picker {
    width: 100%;
  }
  .ant-picker-disabled {
    input {
      color: #000;
    }
  }
}
</style>
