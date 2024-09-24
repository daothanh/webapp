<template>
  <a-drawer
    class="modal-create-project"
    width="50%"
    placement="right"
    :visible="visible"
    :destroy-on-close="true"
    @close="onClose"
  >
    <template #title>
      <span class="font-bold uppercase">{{ title }}</span>
    </template>

    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">Hủy</a-button>
      <a-button
        :loading="loading"
        type="primary"
        :disabled="currentMode === 'view'"
        @click="handleSubmit"
      >
        Lưu
      </a-button>
    </template>
    <a-spin :spinning="loading">
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :md="{ span: 24 }" :xs="{ span: 24 }">
            <a-form-item label="Tên nhà thầu" v-bind="validateInfos.name">
              <a-input
                v-model:value="modelRef.name"
                placeholder="Nhập tên nhà thâu"
                :disabled="currentMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Mã nhà thâu" v-bind="validateInfos.code">
              <a-input
                v-model:value="modelRef.code"
                placeholder="Nhập mã nhà thâu"
                :disabled="currentMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Loại nhà thầu" v-bind="validateInfos.type">
              <c-select
                v-model:value="modelRef.type"
                :options="types"
                placeholder="Chọn loại nhà thầu"
                allow-clear
                :disabled="currentMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Số ĐKKD" v-bind="validateInfos.idNo">
              <a-input
                v-model:value="modelRef.idNo"
                placeholder="Nhập số ĐKKD"
                :disabled="currentMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Loại hình pháp lý" v-bind="validateInfos.legalType">
              <c-select
                v-model:value="modelRef.legalType"
                :options="legalTypes"
                placeholder="Chọn loại hình pháp lý"
                allow-clear
                :disabled="currentMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Tỉnh/TP" v-bind="validateInfos.provinceCode">
              <c-select
                v-model:value="modelRef.provinceCode"
                :options="provinces"
                placeholder="Chọn tỉnh/tp"
                allow-clear
                show-search
                :filter-option="filterOption"
                :loading="provinceLoading"
                :disabled="currentMode === 'view'"
                @change="onChangeProvince"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Quận/Huyện" v-bind="validateInfos.districtCode">
              <c-select
                v-model:value="modelRef.districtCode"
                :options="districts"
                placeholder="Chọn Quận/Huyện"
                allow-clear
                show-search
                :filter-option="filterOption"
                :loading="provinceLoading"
                :disabled="currentMode === 'view' || !modelRef.provinceCode"
                @change="onChangeDistrict"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Xã/Phường" v-bind="validateInfos.commueCode">
              <c-select
                v-model:value="modelRef.commueCode"
                :options="wards"
                placeholder="Chọn Xã/Phường"
                allow-clear
                show-search
                :filter-option="filterOption"
                :loading="provinceLoading"
                :disabled="
                  currentMode === 'view' || !modelRef.provinceCode || !modelRef.districtCode
                "
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 12 }" :xs="{ span: 24 }">
            <a-form-item label="Trạng thai" v-bind="validateInfos.status">
              <c-select
                v-model:value="modelRef.status"
                :options="statusList"
                :disabled="currentMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :md="{ span: 24 }" :xs="{ span: 24 }">
            <a-form-item label="Địa chỉ" v-bind="validateInfos.address">
              <a-input
                v-model:value="modelRef.address"
                :disabled="currentMode === 'view'"
                placeholder="Nhập địa chỉ"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-drawer>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, toRaw, watchEffect } from 'vue'
import { Form, message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import {useSysStore, useUtils } from "dnp-core";
import type { Contractor } from '@/types/contractor'
import contractorApi from '@/apis/project-management/contractor.ts'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  id: {
    type: [Number, null],
    default: null
  },
  mode: {
    type: String,
    default: 'create'
  }
})

const loading = ref(false)
const { filterOption } = useUtils()
const sysStore = useSysStore()
const { globalListItems, provinces, districts, wards, loading: provinceLoading } = storeToRefs(sysStore)

const legalTypes = computed(() =>
  globalListItems.value
    ? globalListItems.value['ASM_ASSET_PROJECT_CONTRACTOR.LEGAL_TYPE']?.map((item) => {
        return {
          label: item.name,
          value: Number(item.value)
        }
      })
    : []
)
const types = computed(() =>
  globalListItems.value
    ? globalListItems.value['ASM_ASSET_PROJECT_CONTRACTOR.TYPE']?.map((item) => {
        return {
          label: item.name,
          value: Number(item.value)
        }
      })
    : []
)

const onChangeProvince = () => {
  modelRef.districtCode = ''
  modelRef.commueCode = ''
  if (modelRef.provinceCode) {
    locationStore.fetchDistricts({ parentCode: modelRef.provinceCode })
  }
}
const onChangeDistrict = () => {
  modelRef.commueCode = ''
  if (modelRef.districtCode) {
    locationStore.fetchWards({ parentCode: modelRef.districtCode })
  }
}
const statusList = ref([
  {
    label: 'Hoạt động',
    value: 1
  },
  {
    label: 'Không hoạt động',
    value: 0
  }
])
const modelRef = reactive<Contractor>({
  id: undefined,
  legalTypeName: '',
  provinceName: '',
  typeName: '',
  type: 1,
  code: null,
  name: null,
  idNo: null,
  provinceCode: null,
  districtCode: null,
  commueCode: null,
  address: null,
  legalType: null,
  status: 1
})

const formRules = ref({
  type: [
    {
      required: true,
      message: 'Loại là trường bắt buộc'
    }
  ],
  name: [
    {
      required: true,
      message: 'Tên nhà thầu là bắt buộc'
    }
  ],
  code: [
    {
      required: true,
      message: 'Mã nhà thầu là bắt buộc'
    }
  ]
})
const useForm = Form.useForm

const { validateInfos, validate, resetFields } = useForm(modelRef, formRules)

const emit = defineEmits(['close', 'finish'])

const currentMode = computed<string>(() => props.mode)
const title = computed(() => {
  switch (currentMode.value) {
    case 'create':
      return 'Tạo mới nhà thầu';
    case 'edit':
      return 'Cập nhật nhà thầu';
    default:
      return 'Xem chi tiết nhà thầu';
  }
})
const handleSubmit = async () => {
  const data = {
    ...toRaw(modelRef)
  }

  validate().then(async () => {
    if (currentMode.value === 'create') {
      const rs = await contractorApi.store(data)
      emit('finish', rs.body)
      message.success('Tạo mới thành công nhà thầu!')
    } else {
      const rs = await contractorApi.update(data)
      emit('finish', rs.body)
      message.success('Cập nhật thành công nhà thầu!')
    }
  })
}

const onClose = () => {
  resetFields()
  emit('close')
}

watchEffect(async () => {
  if (props.id && props.mode !== 'create') {
    const rs = await contractorApi.fetch(props.id)
    if (rs.body) {
      modelRef.id = props.id
      modelRef.name = rs.body.name
      modelRef.type = rs.body.type
      modelRef.code = rs.body.code
      modelRef.idNo = rs.body.idNo
      modelRef.provinceCode = rs.body.provinceCode
      modelRef.districtCode = rs.body.districtCode
      modelRef.commueCode = rs.body.commueCode
      modelRef.address = rs.body.address
      modelRef.legalType = rs.body.legalType
      modelRef.status = rs.body.status

      if (modelRef.provinceCode) {
        await locationStore.fetchProvinces()
      }

      if (modelRef.districtCode) {
        await locationStore.fetchDistricts({ parentCode: modelRef.provinceCode })
      }

      if (modelRef.commueCode) {
        await locationStore.fetchWards({ parentCode: modelRef.districtCode })
      }
    }
  } else if (props.mode === 'create') {
    resetFields()
  }
})
</script>
