<template>
  <c-table
    title="Thông tin hợp đồng"
    class="table-contract-list"
    :pagination="pagination"
    :data-source="dataTable"
    show-active-row
    show-quick-search
    :show-download-file-excel="isAgreeExportExcel"
    :columns="columnContractList"
    :loading="loadingTable"
    :reload-data="
      () => {
        handleSearch()
      }
    "
    @handle-quick-search="handleQuickSearch"
    @change="handleTabChange"
    @on-click-row="handleClickRow"
  >
    <template #extraAction>
      <c-button type="primary" :disabled="loadingTable || isView" @click="handleCreate">
        Thêm mới
      </c-button>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'index'">
        <span>
          {{ getTableRowIndex(pagination.pageSize, pagination.current - 1, index) }}
        </span>
      </template>

      <template v-if="column.key === 'additionalInfo'">
        <format-price :value="record[column.key]?.[column.dataIndex]" />
      </template>

      <template v-if="column.dataIndex === 'actions'">
        <div class="flex justify-center items-center space-x-2">
          <div @click="handleViewContract(record)">
            <a-tooltip>
              <eye-outlined class="outline-none cursor-pointer" :style="{ fontSize: '18px' }" />
              <template #title>Xem chi tiết</template>
            </a-tooltip>
          </div>

          <div
            v-if="!isView"
            class="cursor-pointer outline-none"
            @click="handleEditContract(record)"
          >
            <a-tooltip>
              <template #title>
                <span>Sửa</span>
              </template>
              <edit-icon class="outline-none" />
            </a-tooltip>
          </div>

          <div v-if="!isView" @click="handleDeleteContract(record)">
            <a-tooltip>
              <delete-icon class="outline-none cursor-pointer" />
              <template #title>Xóa</template>
            </a-tooltip>
          </div>
        </div>
      </template>
    </template>
  </c-table>

  <doc-contract
    v-if="!isEmptyObject(selectedContract)"
    :asset-project-contract-id="selectedContract?.id"
    :is-view="isView"
  />

  <modal-create-contract
    :title="`${
      editable
        ? `Cập nhật hợp đồng ${selectedContract.name || ''}`
        : `${
            isDetail ? `Xem chi tiết hợp đồng ${selectedContract.name || ''}` : 'Thêm mới hợp đồng'
          }`
    }`"
    :visible="visibleModalCreateContract"
    :is-edit="editable"
    :is-detail="isDetail"
    :record="selectedContract"
    :state-contact-list="stateContractList"
    :type-contact-list="typeContractList"
    :loading="loadingModalCreateContract"
    @close-drawer="handleCloseModalCreateContract"
    @on-submit="handleSubmit"
  />
</template>

<script lang="ts">
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {EditIcon, DeleteIcon} from 'dnp-ui'
import { EyeOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { columnContractList } from './columns.ts'
import { getTableRowIndex, isEmptyObject } from '@/utils'
import { PAGINATION } from '@/contants'
import { contractProjectListService } from '@/apis/project-management/project-list/contract-manage'
import ModalCreateContract from '@/views/project-management/project-list/project-detail/contract-manage/ModalCreateContract.vue'
import { getGlobalListDetail } from '@/apis/global'
import DocContract from '@/views/project-management/project-list/project-detail/contract-manage/DocsContract.vue'

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
  orgUnitId: {
    type: Number,
    default: false
  },
  orgUnitList: {
    type: Array,
    default: []
  }
})

const pagination = ref({ ...PAGINATION })

const loadingTable = ref(false)
const dataTable = ref([])

const stateContractList = ref([])
const typeContractList = ref([])

const selectedContract = ref({})

const editable = ref(props.isEdit)
const isDetail = ref(false)
const loadingModalCreateContract = ref(false)
const visibleModalCreateContract = ref(false)

const handleTabChange = (p) => {
  pagination.value = { ...pagination.value, ...p }
  getData()
}

const handleQuickSearch = (quickSearch) => {
  pagination.value.current = 1
  getData(quickSearch)
}

const handleSearch = () => {
  pagination.value.current = 1
  getData()
}

const handleClickRow = (record) => {
  selectedContract.value = record
}

const handleCloseModalCreateContract = () => {
  editable.value = false
  isDetail.value = false
  visibleModalCreateContract.value = false
}

const handleCreate = () => {
  selectedContract.value = {}
  editable.value = false
  visibleModalCreateContract.value = true
}

const handleEditContract = (record) => {
  selectedContract.value = record
  editable.value = true
  visibleModalCreateContract.value = true
}

const handleViewContract = async (record) => {
  selectedContract.value = record
  editable.value = false
  isDetail.value = true
  visibleModalCreateContract.value = true
}

const handleDeleteContract = (record: any) => {
  Modal.confirm({
    title: `Bạn có chắc chắn muốn xóa hợp đồng "${record?.name}" không?`,
    okText: 'Xóa',
    cancelText: 'Hủy',
    onOk() {
      return new Promise((resolve, reject) => {
        contractProjectListService
          .delete({ id: record.id })
          .then((res) => {
            if (res.message === 'SUCCESS') {
              message.success('Đã xóa thành công!')
              getData()
              resolve()
            }
          })
          .catch((e) => reject(e))
      })
    }
  })
}

const getData = async (val?: string) => {
  loadingTable.value = true
  selectedContract.value = {}

  try {
    const res = await contractProjectListService.search({
      assetProjectId: props.record.id,
      keyword: val,
      pageSize: pagination.value.pageSize,
      currentPage: pagination.value.current - 1
    })

    if (res.message === 'SUCCESS') {
      pagination.value.total = res?.body?.page_meta?.total_elements || 0
      dataTable.value =
        res?.body?.data?.map((d) => ({
          ...d,
          contractValue: d.additionalInfo?.contractValue,
          setlementValue: d.additionalInfo?.setlementValue
        })) || []
    }
  } finally {
    loadingTable.value = false
  }
}

const handleSubmit = (data) => {
  if (editable.value) {
    updateData(data)
  } else {
    createData(data)
  }
}

const createData = async (record) => {
  try {
    loadingModalCreateContract.value = true
    const res = await contractProjectListService.create({
      ...record,
      assetProjectId: props.record.id
    })
    if (res.message === 'SUCCESS') {
      visibleModalCreateContract.value = false
      await getData()
      message.success('Đã thêm thành công')
    }
  } finally {
    loadingModalCreateContract.value = false
  }
}

const updateData = async (record) => {
  try {
    loadingModalCreateContract.value = true
    const res = await contractProjectListService.update({
      ...record,
      assetProjectId: props.record.id
    })
    if (res.message === 'SUCCESS') {
      visibleModalCreateContract.value = false
      await getData()
      message.success('Đã sửa thành công')
    }
  } finally {
    loadingModalCreateContract.value = false
  }
}

const getTypeContractList = async () => {
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT_CONTRACT.TYPE' })
    if (res.message === 'SUCCESS') {
      typeContractList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } catch (e) {
    console.log(e)
  }
}

const getStateContractList = async () => {
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT_CONTRACT.STATE' })
    if (res.message === 'SUCCESS') {
      stateContractList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } catch (e) {
    console.log(e)
  }
}

watch(
  () => props.record,
  (newVal, oldVal) => {
    if (!props.loading && props.record.id) {
      getData()
      getTypeContractList()
      getStateContractList()
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
.table-contract-list {
  .ant-table-tbody {
    .ant-table-cell-row-hover {
      cursor: pointer !important;
      background: #c0ecff !important;
    }
  }
}
</style>
