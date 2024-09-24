<template>
  <div>
    <div class="project-list-page h-full">
      <div class="flex h-auto gap-2">
        <div class="content-right">
          <a-collapse v-model:active-key="activeKeySearch" class="collapse-criteria">
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
                        <a-form-item label="Loại nhà thầu" v-bind="validateInfos.type">
                          <c-select
                              v-model:value="searchForm.type"
                              :options="types"
                              placeholder="Chọn loại nhà thầu"
                              :field-names="{
                              label: 'name',
                              value: 'value'
                            }"
                              allow-clear
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="7" :xl="4">
                        <a-form-item label="Loại hình pháp lý" v-bind="validateInfos.legalType">
                          <c-select
                              v-model:value="searchForm.legalType"
                              :options="legalTypes"
                              placeholder="Chọn loại hình pháp lý"
                              :field-names="{
                              label: 'name',
                              value: 'value'
                            }"
                              allow-clear
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="7" :xl="4">
                        <a-form-item label="Tỉnh/TP" v-bind="validateInfos.provinceCode">
                          <c-select
                              v-model:value="searchForm.provinceCode"
                              :options="provinces"
                              placeholder="Chọn tỉnh/tp"
                              allow-clear
                              show-search
                              :filter-option="filterOption"
                              :loading="provinceLoading"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="24" :lg="4">
                        <a-form-item :label="' '">
                          <div class="flex justify-end space-x-2 pr-3">
                            <c-button @click="onResetFilter">
                              <template #icon>
                                <close-outlined/>
                              </template>
                              Bỏ lọc
                            </c-button>
                            <c-button type="primary" :disabled="loading" @click="onSearch">
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
              :data-source="items"
              :show-quick-search="true"
              :show-download-file-excel="true"
              :columns="columns"
              :loading="loading"
              :reload-data="
              () => {
                onSearch()
              }
            "
              @handle-quick-search="onQuickSearch"
          >
            <template #extraAction>
              <c-button
                  type="primary"
                  :disabled="loading || isAgreeCreate"
                  @click="onShowFormDrawer"
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
              <template v-if="column.dataIndex === 'status'">
                <span>
                  {{ record.status === 0 ? 'Không hoạt động' : 'Hoạt động' }}
                </span>
              </template>
              <template v-if="column.dataIndex === 'actions'">
                <div class="flex justify-center items-center space-x-2">
                  <div v-if="!isAgreeDetail" @click="onView(record)">
                    <a-tooltip>
                      <eye-outlined
                          class="outline-none cursor-pointer"
                          :style="{ fontSize: '18px' }"
                      />
                      <template #title>Xem chi tiết</template>
                    </a-tooltip>
                  </div>
                  <div
                      v-if="!isAgreeUpdate"
                      class="cursor-pointer outline-none"
                      @click="onEdit(record)"
                  >
                    <a-tooltip>
                      <template #title>
                        <span>Sửa</span>
                      </template>
                      <edit-icon class="outline-none"/>
                    </a-tooltip>
                  </div>
                  <div
                      v-if="!isAgreeDelete"
                      class="cursor-pointer outline-none"
                      @click="onDelete(record)"
                  >
                    <a-tooltip>
                      <template #title>
                        <span>Xóa</span>
                      </template>
                      <delete-icon class="outline-none"/>
                    </a-tooltip>
                  </div>
                </div>
              </template>
            </template>
          </c-table>
        </div>
      </div>
    </div>
    <form-drawer
        :id="contractorId"
        :visible="formVisible"
        :mode="formMode"
        @close="formVisible = false"
        @finish="onFormFinish"
    />
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, reactive, computed} from 'vue'
import {
  CaretRightOutlined,
  CloseOutlined,
  EyeOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import {useForm} from 'ant-design-vue/es/form'
import {storeToRefs} from 'pinia'
import {EditIcon, DeleteIcon, useSysStore} from 'dnp-core'
import {message, Modal} from 'ant-design-vue'
import FormDrawer from './FormDrawer.vue'
import {checkRoles, filterOption, getTableRowIndex} from '@/utils'
import {useContractorStore} from '@/stores/contractor-store.ts'
import {GLOBAL_ROLES} from '@/configs'
import type {Contractor, SearchForm} from '@/types/contractor.ts'
import contractorApi from '@/apis/project-management/contractor.ts'

const isAgreeCreate = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_CONTRACTOR_CREATE))
const isAgreeUpdate = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_CONTRACTOR_UPDATE))
const isAgreeDetail = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_CONTRACTOR_VIEW))
const isAgreeDelete = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_CONTRACTOR_DELETE))
const activeKeySearch = ref('1')

const sysStore = useSysStore()
const {globalListItems, provinces, loading: provinceLoading} = storeToRefs(sysStore)
console.log(globalListItems.value)
type TObj = { [T: string]: string }
const legalTypes = computed(
    () => globalListItems.value['ASM_ASSET_PROJECT_CONTRACTOR.LEGAL_TYPE'] ?? []
)
const types = computed(() => globalListItems.value['ASM_ASSET_PROJECT_CONTRACTOR.TYPE'] ?? [])
const convertGlobalList = (items: Array<{ value: string; name: string }>) => {
  const outItems: TObj = {}
  for (const t of items) {
    outItems[t.value] = t.name
  }
  return outItems
}
const objTypes = computed<TObj>(() => convertGlobalList(types.value))
const objLegalTypes = computed<TObj>(() => convertGlobalList(legalTypes.value))

const objProvinces = computed(() => {
  const items: TObj = {}
  for (const p of provinces.value) {
    items[p.value] = p.label
  }
  return items
})
const formVisible = ref(false)
const onShowFormDrawer = () => {
  formVisible.value = true
  formMode.value = 'create'
}
const searchForm = reactive<SearchForm>({
  keyword: '',
  type: null,
  provinceCode: null,
  legalType: null
})
const {validateInfos} = useForm(searchForm)

const contractorStore = useContractorStore()
const {loading, contractors, pagination} = storeToRefs(contractorStore)
const items = computed(() =>
    contractors.value.map((item: Contractor) => {
      item.typeName = item.type ? objTypes.value[item.type] : null
      item.legalTypeName = item.legalType ? objLegalTypes.value[item.legalType] : null
      item.provinceName = item.provinceCode ? objProvinces.value[item.provinceCode] : null
      return item
    })
)
const columns = ref([
  {
    title: 'STT',
    dataIndex: 'index',
    align: 'center',
    width: 50
  },
  {
    title: 'Tên nhà thầu',
    dataIndex: 'name',
    align: 'left'
  },
  {
    title: 'Loại',
    dataIndex: 'typeName',
    align: 'left',
    width: 200
  },
  {
    title: 'Loại hình pháp lý',
    dataIndex: 'legalTypeName',
    align: 'left',
    width: 200
  },
  {
    title: 'Tỉnh/TP',
    dataIndex: 'provinceName',
    align: 'left',
    width: 200
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    align: 'left',
    width: 200
  },
  {
    title: 'Hành động',
    dataIndex: 'actions',
    align: 'center',
    fixed: 'right',
    width: 100
  }
])
const onSearch = async () => {
  const params = {
    ...searchForm,
    ...{
      pageSize: pagination.value.pageSize,
      currentPage: pagination.value.current - 1
    }
  }
  await contractorStore.fetchContractors(params)
}
const onQuickSearch = async (keyword: string) => {
  pagination.value.current = 1
  searchForm.keyword = keyword
  await onSearch()
}
const onResetFilter = async () => {
  searchForm.type = null
  searchForm.provinceCode = null
  searchForm.legalType = null
  pagination.value.current = 1
  await onSearch()
}

const formMode = ref('create')
const contractorId = ref()
const onFormFinish = async () => {
  formVisible.value = false
  await onSearch()
}
const onEdit = (contractor: Contractor) => {
  formMode.value = 'edit'
  contractorId.value = contractor.id
  formVisible.value = true
}
const onDelete = (contractor: Contractor) => {
  Modal.confirm({
    content: `Bạn muốn xóa nhà thầu "${contractor.name}" ?`,
    onOk: async () => {
      if (contractor.id) {
        await contractorApi.delete(contractor.id)
        message.success('Xóa nhà thầu thành công!')
        await onSearch()
      }
    }
  })
}
const onView = (contractor: Contractor) => {
  formMode.value = 'view'
  contractorId.value = contractor.id
  formVisible.value = true
}

onMounted(async () => {
  await globalListStore.fetchGlobalListByCodes([
    'ASM_ASSET_PROJECT_CONTRACTOR.TYPE',
    'ASM_ASSET_PROJECT_CONTRACTOR.LEGAL_TYPE'
  ])
  await locationStore.fetchProvinces()
  await onSearch()
})
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
