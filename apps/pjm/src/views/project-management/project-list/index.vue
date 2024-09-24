<template>
  <div>
    <div class="project-list-page h-full">
      <div class="flex h-auto gap-2">
        <div class="content-right">
          <a-collapse v-model:activeKey="activeKeySearch" class="collapse-criteria">
            <template #expandIcon="{ isActive }">
              <caret-right-outlined
                  :rotate="isActive ? 90 : 0"
                  style="font-size: 16px; margin-right: 6px"
              />
            </template>
            <a-collapse-panel
                key="1"
                :header="'Tìm kiếm'"
                style="background: white; border-radius: 4px; border: 0; overflow: hidden"
            >
              <a-row :gutter="16">
                <a-col :xs="24" :md="24" :lg="24">
                  <a-form layout="vertical">
                    <a-row :gutter="16">
                      <a-col :xs="24" :md="7" :xl="4">
                        <a-form-item label="Đơn vị" :rules="[{ required: true }]">
                          <c-select
                              v-model:value="params.orgUnitId"
                              :options="companies"
                              placeholder="Chọn đơn vị"
                              :field-names="{
                              label: 'orgUnitName',
                              value: 'orgUnitId'
                            }"
                              show-search
                              :filter-option="filterSelectOption"
                              :loading="companyLoading"
                              @keyup.enter="handleSearch"
                              @change="
                              () => {
                                params.managerId = null
                              }
                            "
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item label="Mã dự án">
                          <a-input
                              v-model:value="params.code"
                              placeholder="Nhập mã dự án"
                              @keyup.enter="handleSearch"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item label="Tên dự án">
                          <a-input
                              v-model:value="params.name"
                              placeholder="Nhập tên dự án"
                              @keyup.enter="handleSearch"
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item label="Loại dự án ">
                          <c-select
                              v-model:value="params.type"
                              :options="typeProjectList"
                              :loading="globalListLoading"
                              placeholder="Chọn loại dự án"
                              allow-clear
                              :field-names="{
                              label: 'name',
                              value: 'value'
                            }"
                              @keyup.enter="handleSearch"
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :span="4">
                        <a-form-item label="Loại mục tiêu">
                          <c-select
                              v-model:value="params.objectivesType"
                              :options="objectivesTypeList"
                              :loading="globalListLoading"
                              allow-clear
                              placeholder="Chọn loại mục tiêu"
                              :field-names="{
                              label: 'name',
                              value: 'value'
                            }"
                              @keyup.enter="handleSearch"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="16">
                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item label="Quản lý dự án">
                          <staff-select
                              :staff-id="params.managerId"
                              :org-unit-id="params.orgUnitId"
                              allow-clear
                              placeholder="Chọn nhân viên"
                              @keyup.enter="handleSearch"
                              @change="handleChangeManager"
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item label="Giai đoạn dự án">
                          <c-select
                              v-model:value="params.state"
                              :options="stateProjectList"
                              :loading="globalListLoading"
                              allow-clear
                              placeholder="Chọn giai đoạn"
                              :field-names="{
                              label: 'name',
                              value: 'value'
                            }"
                              @keyup.enter="handleSearch"
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :xs="24" :md="24" :lg="6">
                        <a-form-item label="Thời gian khởi tạo">
                          <c-range-picker
                              :value="[params.fromInitDate, params.toInitDate]"
                              allow-clear
                              format="DD/MM/YYYY"
                              class="w-full"
                              :value-format="'DD/MM/YYYY'"
                              @change="handleChangeDateInit"
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :xs="24" :md="24" :lg="6">
                        <a-form-item label="Thời gian hoàn thành thực tế">
                          <c-range-picker
                              :value="[params.fromCompleteDate, params.toCompleteDate]"
                              allow-clear
                              format="DD/MM/YYYY"
                              class="w-full"
                              :value-format="'DD/MM/YYYY'"
                              @change="handleChangeDateAcceptance"
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item :label="' '">
                          <div class="flex justify-end space-x-2 pr-3">
                            <c-button @click="handleCancel">
                              <template #icon>
                                <close-outlined/>
                              </template>
                              Bỏ lọc
                            </c-button>
                            <c-button type="primary" :disabled="loadingTable" @click="handleSearch">
                              <template #icon>
                                <search-outlined/>
                              </template>
                              Tìm kiếm
                            </c-button>
                          </div>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </a-col>
              </a-row>
            </a-collapse-panel>
          </a-collapse>

          <c-table
              class="table-project-list"
              :pagination="pagination"
              :data-source="dataTable"
              :show-quick-search="true"
              :show-download-file-excel="isAgreeExportExcel"
              :columns="columnTable"
              :loading="loadingTable"
              :reload-data="
              () => {
                handleSearch()
              }
            "
              @handle-quick-search="handleQuickSearch"
              @change="handleTabChange"
          >
            <template #extraAction>
              <c-button
                  type="primary"
                  :disabled="loadingTable || !isAgreeCreate"
                  @click="handleCreate"
              >
                Thêm mới
              </c-button>
            </template>

            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'index'">
                <span>
                  {{ getTableRowIndex(pagination.pageSize, pagination.current - 1, index) }}
                </span>
              </template>

              <template v-if="column.dataIndex === 'stateName'">
                <i :style="{ color: `${renderProcessColorByState(record.state)}` }">{{
                    record.stateName
                  }}</i>
              </template>
              <template v-if="column.dataIndex === 'actions'">
                <div class="flex justify-center items-center space-x-2">
                  <div v-if="isAgreeDetail" @click="handleViewProject(record)">
                    <a-tooltip>
                      <eye-outlined
                          class="outline-none cursor-pointer"
                          :style="{ fontSize: '18px' }"
                      />
                      <template #title>Xem chi tiết</template>
                    </a-tooltip>
                  </div>
                  <div
                      v-if="isAgreeUpdate"
                      class="cursor-pointer outline-none"
                      @click="handleEditProject(record)"
                  >
                    <a-tooltip>
                      <template #title>
                        <span>Sửa</span>
                      </template>
                      <edit-icon class="outline-none"/>
                    </a-tooltip>
                  </div>
                </div>
              </template>
            </template>
          </c-table>

          <!--        <project-detail :loading="loadingModalCreateProject" :record="selectedProject" />-->
        </div>
      </div>
    </div>

    <modal-create-project
        :title="`${isEdit ? `Cập nhật dự án ${selectedProject.name || ''}` : 'Thêm mới dự án'}`"
        :visible="visibleModalCreate"
        :state-project-list="stateProjectList"
        :is-edit="isEdit"
        :record="selectedProject"
        :type-project-list="typeProjectList"
        :org-unit-id="selectedOrgUnit.orgUnitId"
        :org-unit-name="selectedOrgUnit.name"
        :loading="loadingModalCreateProject"
        @close-drawer="visibleModalCreate = false"
        @on-submit="handleSubmit"
    />
  </div>
</template>
<script lang="ts" setup>
import {onMounted, computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {EditIcon, StaffSelect, useSysStore,PAGINATION, useAuthStore } from 'dnp-core'
import {message} from 'ant-design-vue'
import {
  CaretRightOutlined,
  EyeOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import _ from 'lodash'
import {storeToRefs} from "pinia";
import {columnTable} from './columns.ts'
import {
  buildTree,
  filterDataTree,
  getTableRowIndex,
  renderProcessColorByState
} from '@/utils'
import {projectListService} from '@/apis/project-management/project-list'
import ModalCreateProject from '@/views/project-management/project-list/ModalCreateProject.vue'
import {GLOBAL_ROLES, MODE_ACTION_TO_PAGE} from '@/configs'
import {RouterName} from '@/routes/config.ts'

const { hasRole } = useAuthStore()
const isAgreeUpdate = computed(() => hasRole(GLOBAL_ROLES.PROJECT_MANAGEMENT_UPDATE))
const isAgreeCreate = computed(() => hasRole(GLOBAL_ROLES.PROJECT_MANAGEMENT_CREATE))
const isAgreeDetail = computed(() => hasRole(GLOBAL_ROLES.PROJECT_MANAGEMENT_SELF))
const isAgreeExportExcel = computed(() => hasRole(GLOBAL_ROLES.PROJECT_MANAGEMENT_EXPORT_EXCEL))
const {fetchCompanies, fetchGlobalListByCodes} = useSysStore()
const {companies, companyLoading, globalListItems, globalListLoading} = storeToRefs(useSysStore())
const pagination = ref({...PAGINATION})

const route = useRoute()
const router = useRouter()
const query = ref({})

const treeData = ref<Array<any>>([])
const expandedKeys = ref<Array<any>>([])
const selectedKeys = ref<Array<any>>(['1'])
const activeKeySearch = ref(['1'])
const autoExpandParent = ref<boolean>(true)

const loadingTree = ref<boolean>(false)

const selectedOrgUnit = ref({})

const loadingTable = ref(false)
const dataTable = ref([])

const typeProjectList = computed(() => globalListItems.value['ASM_ASSET_PROJECT.TYPE'] || [])
const stateProjectList = computed(() => globalListItems.value['ASM_ASSET_PROJECT.STATE'] || [])
const objectivesTypeList = computed(() => globalListItems.value['ASM_ASSET_PROJECT.OBJECTIVES_TYPE'] || [])

const selectedProject = ref({})
const isEdit = ref(false)
const loadingModalCreateProject = ref(false)
const visibleModalCreate = ref(false)

const params = ref({
  orgUnitId: null,
  objectivesType: null,
  code: null,
  name: null,
  managerId: null,
  state: null,
  type: null,
  fromInitDate: null,
  toInitDate: null,
  fromCompleteDate: null,
  toCompleteDate: null
})

const resetParams = () => {
  params.value = {
    ...params.value,
    objectivesType: null,
    code: null,
    name: null,
    managerId: null,
    state: null,
    type: null,
    fromInitDate: null,
    toInitDate: null,
    fromCompleteDate: null,
    toCompleteDate: null
  }
}
const onSelect = (slKeys, info) => {
  selectedKeys.value = slKeys

  if (info?.node) {
    selectedOrgUnit.value = {
      name: info?.node?.title || '',
      id: info?.node?.id || 0,
      orgUnitId: info?.node?.orgUnitId || 0
    }
  }

  getData()
}

const onExpand = (expdKeys) => {
  expandedKeys.value = expdKeys
  autoExpandParent.value = false
}

const getTreeUnit = async (reset?: any) => {
  loadingTree.value = true
  await fetchCompanies({listOrgUnitType: '2,3'})
  const filterData = filterDataTree(companies.value)
  if (companies.value.length > 0) {
    selectedOrgUnit.value = companies.value[0]
    if (!params.value.orgUnitId) {
      params.value.orgUnitId = selectedOrgUnit.value?.orgUnitId
    }
  }
  
  treeData.value = buildTree(filterData)

  if (!reset) {
    onSelect([treeData.value[0].key], {})
    onExpand([treeData.value[0].key])
  }
  loadingTree.value = false
}

const handleSearch = () => {
  pagination.value.current = 1

  getData()
}

const handleCancel = () => {
  pagination.value.current = 1

  resetParams()
  getData()
}

const handleChangeManager = (value) => {
  params.value.managerId = value || null
}

const handleTabChange = (p) => {
  pagination.value = {...pagination.value, ...p}
  getData()
}

const handleChangeDateInit = (value) => {
  params.value.fromInitDate = value && value[0] ? value[0] : null
  params.value.toInitDate = value && value[1] ? value[1] : null
}

const handleChangeDateAcceptance = (value) => {
  params.value.fromCompleteDate = value && value[0] ? value[0] : null
  params.value.toCompleteDate = value && value[1] ? value[1] : null
}

const handleQuickSearch = (quickSearch) => {
  pagination.value.current = 1

  getData(quickSearch)
}

const handleCreate = () => {
  router.push({
    name: RouterName.PROJECT_DETAIL,
    params: {id: 0},
    query: {
      pageMode: MODE_ACTION_TO_PAGE.CREATE,
      paramName: route.name,
      orgUnitId: params.value.orgUnitId
    }
  })
}

const handleEditProject = (record) => {
  // isEdit.value = true
  // visibleModalCreate.value = true
  // getDetailProject(record.id)

  router.push({
    name: RouterName.PROJECT_DETAIL,
    params: {id: record.id},
    query: {
      ..._.pickBy(params.value, _.identity),
      paramName: route.name,
      pageMode: MODE_ACTION_TO_PAGE.EDIT
    }
  })
}

const handleViewProject = (record) => {
  router.push({
    name: RouterName.PROJECT_DETAIL,
    params: {id: record.id},
    query: {
      ..._.pickBy(params.value, _.identity),
      paramName: route.name,
      pageMode: MODE_ACTION_TO_PAGE.VIEW
    }
  })
}

const handleClickRow = (record) => {
  getDetailProject(record.id)
}

const handleSubmit = (data) => {
  if (isEdit.value) {
    updateData(data)
  } else {
    createData(data)
  }
}

const createData = async (record) => {
  try {
    loadingModalCreateProject.value = true
    const res = await projectListService.create({
      ...record
    })
    if (res.message === 'SUCCESS') {
      visibleModalCreate.value = false
      await getData()
      message.success('Đã thêm thành công')
    }
  } finally {
    loadingModalCreateProject.value = false
  }
}

const updateData = async (record) => {
  try {
    loadingModalCreateProject.value = true
    const res = await projectListService.update({
      ...record
    })
    if (res.message === 'SUCCESS') {
      visibleModalCreate.value = false
      await getData()
      message.success('Đã sửa thành công')
    }
  } finally {
    loadingModalCreateProject.value = false
  }
}

const getDetailProject = async (id: number) => {
  loadingModalCreateProject.value = true

  try {
    const res = await projectListService.detail({id})

    if (res.message === 'SUCCESS') {
      selectedProject.value = res?.body || {}
    }
  } finally {
    loadingModalCreateProject.value = false
  }
}

const getData = async (val?: string) => {
  loadingTable.value = true
  selectedProject.value = {}
  query.value = {}

  try {
    const res = await projectListService.search({
      ...params.value,
      keyword: val,
      pageSize: pagination.value.pageSize,
      currentPage: pagination.value.current - 1
    })

    if (res.message === 'SUCCESS') {
      pagination.value.total = res?.body?.page_meta?.total_elements || 0
      dataTable.value = res?.body?.data || []
    }
  } finally {
    loadingTable.value = false
  }
}

onMounted(async () => {
  await fetchGlobalListByCodes(['ASM_ASSET_PROJECT.STATE', 'ASM_ASSET_PROJECT.TYPE', 'ASM_ASSET_PROJECT.OBJECTIVES_TYPE'])
  await getTreeUnit()
})

watch(
    () => route.name,
    async (newVal, oldVal) => {
      if (route.name === RouterName.PROJECT_LIST) {
        query.value = _.pickBy(
            {...route.query, orgUnitId: parseFloat(route.query.orgUnitId)},
            _.identity
        )
        params.value = {
          ...params.value,
          orgUnitId: query.value.orgUnitId || null,
          // objectivesType: query.value.objectivesType || null,
          code: query.value.code || null,
          name: query.value.name || null
          // managerId: query.value.managerId || null,
          // state: query.value.state || null,
          // type: query.value.pe || null,
          // fromInitDate: query.value.fromInitDate || null,
          // toInitDate: query.value.toInitDate || null,
          // fromCompleteDate: query.value.fromCompleteDate || null,
          // toCompleteDate: query.value.toCompleteDate || null
        }
      }
    },
    {immediate: true, deep: true}
)
</script>

<style lang="scss">
.layout-project-management-project-list {
  height: 100vh;
}

.project-list-page {
  .ant-tabs {
    font-weight: 600;

    .ant-tabs-tab {
      padding-left: 10px;
      padding-right: 10px;
    }

    .ant-tabs-nav {
      margin: 0;
    }

    .ant-tabs-ink-bar {
      height: 3px;
    }
  }

  .card-table {
    height: auto;
  }
}
</style>
