<template>
  <a-drawer
    class="modal-create-project"
    width="50%"
    placement="right"
    :visible="visible"
    @close="onClose"
  >
    <template #title>
      <span class="font-bold uppercase">{{ title }}</span>
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
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Mã dự án" v-bind="validateInfos.code">
              <a-input v-model:value="modelRef.code" placeholder="Nhập mã dự án" />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Tên dự án" v-bind="validateInfos.name">
              <a-input v-model:value="modelRef.name" placeholder="Nhập tên  dự án" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Quản trị dự án" v-bind="validateInfos.managerId">
              <staff-select
                v-if="visible"
                :staff-id="modelRef.managerId"
                :org-unit-id="orgUnitId"
                :placeholder="''"
                @change="handleChangeManager"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Nhân sự phê duyệt" v-bind="validateInfos.approverId">
              <staff-select
                v-if="visible"
                :staff-id="modelRef.approverId"
                :org-unit-id="orgUnitId"
                :placeholder="''"
                @change="handleChangeApprover"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Loại dự án" v-bind="validateInfos.type">
              <c-select
                v-model:value="modelRef.type"
                :options="typeProjectList"
                :disabled="isEdit"
                placeholfer="Chọn loại dự án"
                allow-clear
                :field-names="{
                  label: 'name',
                  value: 'value'
                }"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Tình trạng dự án" v-bind="validateInfos.state">
              <c-select
                v-model:value="modelRef.state"
                :options="stateProjectList"
                placeholfer="Chọn tình trạng"
                allow-clear
                :field-names="{
                  label: 'name',
                  value: 'value'
                }"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Thời gian triển khai" v-bind="validateInfos.deployDate">
              <a-date-picker
                v-model:value="modelRef.deployDate"
                allow-clear
                :value-format="'DD/MM/YYYY'"
                :format="'DD/MM/YYYY'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Thời gian hoàn thành">
              <a-date-picker
                v-model:value="modelRef.completeDate"
                allow-clear
                :value-format="'DD/MM/YYYY'"
                :format="'DD/MM/YYYY'"
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
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script lang="ts">
</script>
<script lang="ts" setup>
import { createVNode, reactive, ref, toRaw, watch } from 'vue'
import { Form, Modal } from 'ant-design-vue'
import { StaffSelect } from 'dnp-ui'

const props = defineProps<{
  title: string
  visible: boolean
  isEdit: boolean
  record: any
  loading: boolean
  orgUnitId: number
  orgUnitName: string
  stateProjectList: Array<any>
  typeProjectList: Array<any>
}>()

const modelRef = ref({
  code: '',
  name: '',
  type: null,
  state: null,
  managerId: null,
  approverId: null,
  deployDate: null,
  completeDate: null,
  description: ''
})

const rulesForm = reactive({
  code: [
    {
      required: true,
      message: 'Mã dự án là bắt buộc'
    }
  ],
  name: [
    {
      required: true,
      message: 'Tên dự án là bắt buộc'
    }
  ],
  managerId: [
    {
      required: true,
      message: 'Quản trị dự án là bắt buộc'
    }
  ],
  approverId: [
    {
      required: true,
      message: 'Nhân sự phê duyệt là bắt buộc'
    }
  ],
  type: [
    {
      required: true,
      message: 'Loại dự án là bắt buộc'
    }
  ],
  state: [
    {
      required: true,
      message: 'Tình trạng là bắt buộc'
    }
  ],
  deployDate: [
    {
      required: true,
      message: 'Thời gian triển khai là bắt buộc'
    }
  ]
})
const useForm = Form.useForm

const { resetFields, validateInfos, validate } = useForm(modelRef, rulesForm)

const emit = defineEmits(['closeDrawer', 'onSubmit'])

const handleSubmit = async () => {
  const data = {
    id: props.isEdit ? props.record?.id : undefined,
    ...toRaw(modelRef.value)
  }

  validate().then(() => {
    emit('onSubmit', data)
  })
}

const handleChangeManager = (value) => {
  modelRef.value.managerId = value
}

const handleChangeApprover = (value) => {
  modelRef.value.approverId = value
}

const setField = (data) => {
  resetFields()

  modelRef.value = {
    ...data,
    code: data.code || '',
    name: data.name || '',
    type: data.type?.toString() || null,
    state: data.state?.toString() || null,
    managerId: parseFloat(data.managerId) || null,
    approverId: parseFloat(data.approverId) || null,
    deployDate: data.deployDate || null,
    completeDate: data.completeDate || null,
    description: data.description || ''
  }
}

const onClose = () => {
  resetFields()
  emit('closeDrawer')
}

watch(
  () => props.record,
  (newVal, oldVal) => {
    setField(newVal)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
.modal-create-project {
  .ant-picker {
    width: 100%;
  }
}
</style>
