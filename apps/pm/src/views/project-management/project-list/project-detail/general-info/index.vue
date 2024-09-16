<template>
  <div class="project-info">
    <div class="btn-save flex justify-end mb-[20px]" :class="{ 'btn-save-fixed': isBtnSaveFixed }">
      <c-button
        type="primary"
        :loading="loading"
        :disabled="isView || disabledBtnSave"
        @click="handleSubmit"
      >
        <SaveOutlined v-if="isEdit" />
        Lưu thông tin
      </c-button>
    </div>

    <a-spin :spinning="loading">
      <a-form layout="vertical">
        <a-collapse v-model:active-key="activeKeyCollapse" ghost>
          <template #expandIcon="{ isActive }">
            <caret-right-outlined
              :rotate="isActive ? 90 : 0"
              style="font-size: 14px; margin-right: 5px; margin-top: 4px"
            />
          </template>
          <a-collapse-panel key="1">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]">
                  Thông tin quản lý chung
                </span>
              </div>
            </template>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="Đơn vị quản lý" v-bind="validateInfos.pmOrgUnitId">
                  <c-select
                    v-model:value="modelRef.pmOrgUnitId"
                    placeholder="Chọn đơn vị"
                    :options="orgUnitList"
                    :filter-option="filterSelectOption"
                    show-search
                    :disabled="isView"
                    :field-names="{
                      label: 'orgUnitName',
                      value: 'orgUnitId'
                    }"
                    @change="handleChangeOrg"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Quản lý dự án" v-bind="validateInfos.managerId">
                  <staff-select
                    :staff-id="modelRef.managerId"
                    :org-unit-id="modelRef.pmOrgUnitId"
                    :disabled="isView || !modelRef.pmOrgUnitId"
                    :placeholder="'Chọn nhân sự'"
                    @change="handleChangeManager"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="Mã dự án" v-bind="validateInfos.code">
                  <project-code-input
                    v-model="modelRef.code"
                    placeholder="NămDA-STT"
                    :disabled="isView || !modelRef.pmOrgUnitId"
                    :org-unit-code="selectedOrgUnit?.orgUnitCode"
                    @change="handleUpdateValue"
                  >
                  </project-code-input>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Tên dự án" v-bind="validateInfos.name">
                  <c-input
                    v-model:value="modelRef.name"
                    placeholder="Nhập tên dự án"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Loại dự án" v-bind="validateInfos.type">
                  <c-select
                    v-model:value="modelRef.type"
                    :options="typeProjectList"
                    :loading="loadingTypeProjectList"
                    placeholder="Chọn loại dự án"
                    :field-names="{
                      label: 'name',
                      value: 'value'
                    }"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Loại mục tiêu" v-bind="validateInfos.objectivesType">
                  <c-select
                    v-model:value="modelRef.objectivesType"
                    :options="objectivesTypeList"
                    :loading="loadingObjectivesTypeList"
                    placeholder="Chọn loại mục tiêu"
                    :field-names="{
                      label: 'name',
                      value: 'value'
                    }"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Hạng mục">
                  <c-input
                    v-model:value="modelRef.category"
                    placeholder="Nhập hạng mục"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Địa điểm triển khai">
                  <c-input
                    v-model:value="modelRef.deployAddress"
                    placeholder="Nhập địa điểm"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="Mục tiêu chung dự án">
                  <a-textarea
                    v-model:value="modelRef.objectives"
                    placeholder="Nhập mục tiêu"
                    :rows="2"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="2">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]"> Thông tin chính sách </span>
              </div>
            </template>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="Loại ngân sách">
                  <c-select
                    v-model:value="modelRef.budgetType"
                    :options="budgetTypeList"
                    :loading="loadingBudgetTypeList"
                    allow-clear
                    placeholder="Chọn loại ngân sách "
                    :field-names="{
                      label: 'name',
                      value: 'value'
                    }"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Hình thức đầu tư">
                  <c-select
                    v-model:value="modelRef.investType"
                    :options="investTypeList"
                    :loading="loadingInvestTypeList"
                    allow-clear
                    :field-names="{
                      label: 'name',
                      value: 'value'
                    }"
                    placeholder="Chọn hình thức"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Loại nguồn vốn">
                  <c-select
                    v-model:value="modelRef.capitalType"
                    :loading="loadingCapitalTypeList"
                    mode="multiple"
                    :placeholder="'Chọn loại nguồn vốn'"
                    :max-tag-count="2"
                    :field-names="{
                      label: 'name',
                      value: 'value'
                    }"
                    :disabled="isView"
                    :options="capitalTypeList"
                    @change="handleUpdateValue"
                  >
                  </c-select>
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Mức độ ưu tiên">
                  <c-select
                    v-model:value="modelRef.important"
                    :options="importantList"
                    :loading="loadingImportantList"
                    allow-clear
                    placeholder="Chọn mức độ ưu tiên"
                    :field-names="{
                      label: 'name',
                      value: 'value'
                    }"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="3">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]"> Các mốc thời gian </span>
              </div>
            </template>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="Năm">
                  <a-date-picker
                    v-model:value="modelRef.year"
                    class="w-full"
                    placeholder="Chọn năm"
                    picker="year"
                    :value-format="'YYYY'"
                    allow-clear
                    :format="'YYYY'"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Thời gian triển khai" v-bind="validateInfos.deployDate">
                  <a-date-picker
                    v-model:value="modelRef.deployDate"
                    allow-clear
                    :value-format="'DD/MM/YYYY'"
                    :format="'DD/MM/YYYY'"
                    placeholder="Chọn ngày"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Tgian hoàn thành dự kiến">
                  <a-date-picker
                    v-model:value="modelRef.completeDateEst"
                    allow-clear
                    :value-format="'DD/MM/YYYY'"
                    placeholder="Chọn ngày"
                    :format="'DD/MM/YYYY'"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Tgian hoàn thành thực tế">
                  <a-date-picker
                    v-model:value="modelRef.completeDate"
                    allow-clear
                    :value-format="'DD/MM/YYYY'"
                    :format="'DD/MM/YYYY'"
                    placeholder="Chọn ngày"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="4">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]"> Phê duyệt </span>
              </div>
            </template>
            <div class="flex mb-3">
              <div class="w-1/3 bg-[#98BD2E33] p-3">
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-form-item label="Bộ phận lập dự án">
                      <c-input
                        v-model:value="modelRef.projectPlanningOrg"
                        placeholder="Nhập bộ phận"
                        :disabled="isView"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="Nhân sự lập dự án">
                      <c-input
                        v-model:value="modelRef.projectPlanningStaff"
                        placeholder="Nhập nhân sự"
                        :disabled="isView"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div class="w-1/3 bg-[#fdefc3] p-3">
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-form-item label="Phê duyệt cấp đơn vị">
                      <c-input
                        v-model:value="modelRef.orgApprove"
                        placeholder="Nhập đơn vị"
                        :disabled="isView"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="Người duyệt cấp đơn vị">
                      <c-input
                        v-model:value="modelRef.orgApproveBy"
                        placeholder="Nhập người duyệt"
                        :disabled="isView"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="Ngày duyệt cấp đơn vị">
                      <a-date-picker
                        v-model:value="modelRef.orgApproveDate"
                        allow-clear
                        :value-format="'DD/MM/YYYY'"
                        :format="'DD/MM/YYYY'"
                        :disabled="isView"
                        placeholder="Chọn ngày"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div class="w-1/3 bg-[#d3eef9] p-3">
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-form-item label="Phê duyệt cấp DNPW">
                      <c-input
                        v-model:value="modelRef.corpApprove"
                        placeholder="Nhập đơn vị"
                        :disabled="isView"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="Người duyệt cấp DNPW">
                      <c-input
                        v-model:value="modelRef.corpApproveBy"
                        placeholder="Nhập người duyệt"
                        :disabled="isView"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-item label="Ngày duyệt cấp DNPW">
                      <a-date-picker
                        v-model:value="modelRef.corpApproveDate"
                        allow-clear
                        :value-format="'DD/MM/YYYY'"
                        :format="'DD/MM/YYYY'"
                        :disabled="isView"
                        placeholder="Chọn ngày"
                        @change="handleUpdateValue"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="5">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]"> Hồ sơ pháp lý </span>
              </div>
            </template>
            <doc-project
              v-if="!isEmptyObject(record)"
              :record="record"
              :is-view="isView"
              class="mb-4"
            />
          </a-collapse-panel>
          <a-collapse-panel key="6">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]">
                  Hồ sơ chất lượng công trình
                </span>
              </div>
            </template>
            <doc-project
              v-if="!isEmptyObject(record)"
              :record="record"
              :is-view="isView"
              :type="'quality'"
              class="mb-4"
            />
          </a-collapse-panel>
          <a-collapse-panel key="7">
            <template #header>
              <div class="cursor-pointer outline-none">
                <span class="font-semibold text-[14px] text-[#4196F0]"> Thông tin khác </span>
              </div>
            </template>
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="Người tạo">
                  <c-input
                    v-model:value="modelRef.createProjectBy"
                    placeholder="Nhập người tạo"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Ngày tạo">
                  <a-date-picker
                    v-model:value="modelRef.createProjectTime"
                    allow-clear
                    :value-format="'DD/MM/YYYY'"
                    :format="'DD/MM/YYYY'"
                    :disabled="isView"
                    placeholder="Chọn ngày"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Người cập nhật">
                  <c-input
                    v-model:value="modelRef.updateProjectBy"
                    placeholder="Nhập người cập nhật"
                    :disabled="isView"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="6">
                <a-form-item label="Ngày cập nhật">
                  <a-date-picker
                    v-model:value="modelRef.updateProjectTime"
                    allow-clear
                    :value-format="'DD/MM/YYYY'"
                    :format="'DD/MM/YYYY'"
                    :disabled="isView"
                    placeholder="Chọn ngày"
                    @change="handleUpdateValue"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-form>

      <budget-exp
        v-if="record.budgetExp"
        :record="record.budgetExp"
        :is-view="isView"
        @change="handleChangeValue"
      />
    </a-spin>
  </div>
</template>

<script lang="ts">
export default {
  name: 'InfoProject'
}
</script>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted, toRaw, computed } from 'vue'
import { isEmptyObject } from '@/utils'
import DocProject from '@/views/project-management/project-list/project-detail/general-info/DocsList.vue'
import { Form } from 'ant-design-vue'
import { getGlobalListDetail } from '@/apis/global'
import { SaveOutlined, CaretRightOutlined } from '@ant-design/icons-vue'
import BudgetExp from '@/views/project-management/project-list/project-detail/general-info/BudgetExp.vue'
import ProjectCodeInput from '@/components/common/ProjectCodeInput.vue'
import type { Rule } from 'ant-design-vue/es/form'

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isView: {
    type: Boolean,
    default: false
  },
  isBtnSaveFixed: {
    type: Boolean,
    default: false
  },
  orgUnitId: {
    type: Number,
    default: 0
  },
  orgUnitList: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['onSubmit', 'change'])
const codeFormat = async (_rule: Rule, value: string) => {
  if (value) {
    const regx = new RegExp('^([A-Z]+)-([0-9]{4})-([0-9]+)$')
    if (!regx.test(value)) {
      return Promise.reject('Mã dự án phải có định dang: MãĐV-NămDA-STT')
    }
    return Promise.resolve()
  }
}
const activeKeyCollapse = ref(['1', '2', '3', '4', '5', '6'])

const loadingTypeProjectList = ref(false)
const typeProjectList = ref([])

const loadingObjectivesTypeList = ref(false)
const objectivesTypeList = ref([])

const loadingInvestTypeList = ref(false)
const investTypeList = ref([])

const loadingBudgetTypeList = ref(false)
const budgetTypeList = ref([])

const loadingImportantList = ref(false)
const importantList = ref([])

const loadingCapitalTypeList = ref(false)
const capitalTypeList = ref([])

const modelRef = ref({
  name: '',
  code: '',
  deployAddress: '',
  managerId: null,
  orgUnitId: null,
  pmOrgUnitId: null,
  deployDate: null,
  completeDate: null,
  completeDateEst: null,
  //hạng mục
  category: null,
  state: null,
  //Hình thức đầu tư
  investType: null,
  //loại mục tiêu
  objectivesType: null,
  //looi ngân sách
  budgetType: null,
  //mục tiêu dự án
  objectives: null,
  //bộ phận lập dự án
  projectPlanningOrg: null,
  //nhân sự lập dự án
  projectPlanningStaff: null,
  //phe duyệt cấp đơn vi
  orgApprove: null,
  //nguoi duyet cap cong ty
  orgApproveBy: null,
  //ngay duyet cap cong ty
  orgApproveDate: null,
  //phê duyệt cấp tập đoàn
  corpApprove: null,
  //nguoi duyet cap tap doan
  corpApproveBy: null,
  //ngay duyet cap tap doan
  corpApproveDate: null,
  //loai nguon von
  capitalType: [],
  //mức độ quan trọng
  important: null,
  createProjectBy: null,
  createProjectTime: null,
  updateProjectBy: null,
  updateProjectTime: null,
  type: null,
  budgetExp: null,
  year: null
})
const selectedOrgUnit = computed(() =>
  props.orgUnitList.find((orgUnit) => orgUnit.orgUnitId === modelRef.value.pmOrgUnitId)
)
const rulesForm = reactive({
  code: [
    {
      required: true,
      message: 'Mã dự án là bắt buộc'
    },
    {
      validator: codeFormat,
      trigger: 'change'
    }
  ],
  name: [
    {
      required: true,
      message: 'Tên dự án là bắt buộc'
    }
  ],
  orgUnitId: [
    {
      required: true,
      message: 'Đơn vị quản lý là bắt buộc'
    }
  ],
  type: [
    {
      required: true,
      message: 'Loại dự án là bắt buộc'
    }
  ],
  objectivesType: [
    {
      required: true,
      message: 'Loại mục tiêu là bắt buộc'
    }
  ],
  deployDate: [
    {
      required: true,
      message: 'Ngày triển khai là bắt buộc'
    }
  ],
  managerId: [
    {
      required: true,
      message: 'Quản lý dự án là bắt buộc'
    }
  ]
})

const useForm = Form.useForm
const { validateInfos, validate } = useForm(modelRef, rulesForm)

const disabledBtnSave = computed(() => {
  return (
    !modelRef.value.name ||
    !modelRef.value.code ||
    !modelRef.value.orgUnitId ||
    !modelRef.value.pmOrgUnitId ||
    !modelRef.value.managerId ||
    !modelRef.value.deployDate ||
    !modelRef.value.objectivesType ||
    !modelRef.value.type ||
    !modelRef.value.code
  )
})

const handleChangeOrg = () => {
  modelRef.value.managerId = null
  handleUpdateValue()
}

const handleChangeManager = (val) => {
  modelRef.value.managerId = val
  handleUpdateValue()
}

const handleChangeValue = (data) => {
  modelRef.value = {
    ...modelRef.value,
    ...data
  }
  handleUpdateValue(true)
}

const handleUpdateValue = (bol) => {
  emits('change', bol)
}

const handleSubmit = () => {
  const data = {
    id: props.isEdit ? props.record?.id : undefined,
    ...toRaw(modelRef.value)
  }

  validate().then(() => {
    emits('onSubmit', data)
  })
}
const setField = (data) => {
  modelRef.value.name = data.name || ''
  modelRef.value.code = data.code || ''
  modelRef.value.deployAddress = data.deployAddress || null
  modelRef.value.managerId = data.managerId || null
  modelRef.value.state = data.state || 1
  modelRef.value.orgUnitId = data.orgUnitId || null
  modelRef.value.pmOrgUnitId = data.pmOrgUnitId || null
  modelRef.value.category = data.category || null
  modelRef.value.investType = data.investType || null
  modelRef.value.type = data.type || null
  modelRef.value.deployDate = data.deployDate || null
  modelRef.value.completeDate = data.completeDate || null
  modelRef.value.completeDateEst = data.completeDateEst || null
  modelRef.value.objectivesType = data.objectivesType || null
  modelRef.value.budgetType = data.budgetType || null
  modelRef.value.objectives = data.objectives || null
  modelRef.value.projectPlanningOrg = data.projectPlanningOrg || null
  modelRef.value.projectPlanningStaff = data.projectPlanningStaff || null
  modelRef.value.orgApprove = data.orgApprove || null
  modelRef.value.corpApprove = data.corpApprove || null
  modelRef.value.orgApproveBy = data.orgApproveBy || null
  modelRef.value.orgApproveDate = data.orgApproveDate || null
  modelRef.value.corpApproveBy = data.corpApproveBy || null
  modelRef.value.corpApproveDate = data.corpApproveDate || null
  modelRef.value.createProjectBy = data.createProjectBy || null
  modelRef.value.updateProjectBy = data.updateProjectBy || null
  modelRef.value.createProjectTime = data.createProjectTime || null
  modelRef.value.updateProjectTime = data.updateProjectTime || null
  modelRef.value.budgetExp = data.budgetExp || null
  modelRef.value.year = data.year?.toString() || null
  modelRef.value.important = data.important || null
  modelRef.value.capitalType = data.capitalType || []
}

const getTypeProject = async () => {
  loadingTypeProjectList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.TYPE' })
    if (res.message === 'SUCCESS') {
      typeProjectList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingTypeProjectList.value = false
  }
}

const getObjectivesTypeList = async () => {
  loadingObjectivesTypeList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.OBJECTIVES_TYPE' })
    if (res.message === 'SUCCESS') {
      objectivesTypeList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingObjectivesTypeList.value = false
  }
}

const getBudgetTypeList = async () => {
  loadingBudgetTypeList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.BUDGET_TYPE' })
    if (res.message === 'SUCCESS') {
      budgetTypeList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingBudgetTypeList.value = false
  }
}

const getInvestTypeList = async () => {
  loadingInvestTypeList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.INVEST_TYPE' })
    if (res.message === 'SUCCESS') {
      investTypeList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingInvestTypeList.value = false
  }
}

const getImportantList = async () => {
  loadingImportantList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.IMPORTANT' })
    if (res.message === 'SUCCESS') {
      importantList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingImportantList.value = false
  }
}

const getCapitalTypeList = async () => {
  loadingCapitalTypeList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.CAPITAL_TYPE' })
    if (res.message === 'SUCCESS') {
      capitalTypeList.value =
        res.body?.map((d) => ({
          ...d,
          value: parseFloat(d.value)
        })) || []
    }
  } finally {
    loadingCapitalTypeList.value = false
  }
}

onMounted(() => {
  getTypeProject()
  getObjectivesTypeList()
  getBudgetTypeList()
  getInvestTypeList()
  getImportantList()
  getCapitalTypeList()
})

watch(
  () => props.record,
  (newVal, oldVal) => {
    if (!props.loading) {
      setField(newVal)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
.project-info {
  min-height: 300px;
  .ant-picker {
    width: 100%;
  }
  .ant-collapse-header {
    padding: 0 0 10px 0 !important;
  }
  .ant-collapse-content-box {
    padding: 0 10px !important;
  }
  .ant-picker-disabled {
    input {
      color: #000;
    }
  }
  .ant-descriptions-item-label {
    font-weight: 600;
  }
  .ant-descriptions-row {
    .ant-descriptions-item {
      padding-bottom: 5px;
    }
    .ant-descriptions-item-label {
      color: #73777a;
      font-weight: 400;
    }
    .ant-descriptions-item-content {
      padding-bottom: 10px;
      font-weight: 700;
    }
  }
}
</style>
