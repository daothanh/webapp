<template>
  <div class="doc-contract">
    <c-table
      title="Quản lý hồ sơ"
      :columns="columnTableDocsContract"
      :data-source="dataTable"
      :pagination="false"
      :loading="loadingTable"
      :reload-data="getDocContract"
      :show-download-file-excel="false"
      :show-quick-search="false"
    >
      <template #extraAction>
        <c-button type="primary" :disabled="!isAgreeUpdateDoc || isView" @click="handleAddRow"
          ><plus-circle-outlined /> Thêm dòng</c-button
        >
        <c-button
          type="primary"
          :disabled="loadingTable || disabledButtonSave || !isAgreeUpdateDoc || isView"
          @click="handleSave"
        >
          Lưu thông tin
        </c-button>
      </template>

      <template #headerCell="{ title, column }">
        <template v-if="['name', 'type', 'state', 'contractState'].includes(column.dataIndex)">
          <span class="text-red-500 font-bold mt-1"> * </span>
          <span>{{ title }}</span>
        </template>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <span>
            {{ index + 1 }}
          </span>
        </template>

        <template v-if="column.dataIndex === 'name'">
          <a-input
            v-model:value="record.name"
            :bordered="false"
            :placeholder="'Nhập tên tài liệu'"
            @change="changeValue(index)"
            :disabled="isView"
          />
        </template>

        <template v-if="column.dataIndex === 'type'">
          <c-select
            v-model:value="record.type"
            :options="typeDocList"
            :loading="loadingtTypeDocList"
            allow-clear
            :bordered="false"
            placeholder="Chọn loại"
            :field-names="{
              label: 'name',
              value: 'value'
            }"
            :disabled="isView"
          />
        </template>

        <template v-if="column.dataIndex === 'description'">
          <a-textarea
            v-model:value="record.description"
            placeholder="Nhập nội dung"
            :rows="1"
            :bordered="false"
            :disabled="isView"
          />
        </template>

        <template v-if="column.dataIndex === 'files'">
          <upload-file
            class="px-[10px]"
            :file-type="null"
            :files="record.fileList?.map((f) => ({ ...f, publicKey: f.publicFileKey }))"
            :max="5"
            :disabled="isView"
            :visible="loadingTable || record.fileList?.length"
            placeholder="Thêm file"
            @on-change="(data) => handleChangeFile(data, record)"
          />
        </template>

        <template v-if="column.dataIndex === 'actions'">
          <div class="flex items-center space-x-2 justify-center">
            <!--            <div v-if="record.publicFileKey">-->
            <!--              <a target="_blank" :href="record.fileUrl">-->
            <!--                <a-tooltip>-->
            <!--                  <download-icon />-->
            <!--                  <template #title>Tải xuống file tài liệu</template>-->
            <!--                </a-tooltip>-->
            <!--              </a>-->
            <!--            </div>-->
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa hồ sơ này?"
              ok-text="Ok"
              cancel-text="Hủy"
              @confirm="handleRemoveRow(record, index)"
            >
              <div v-if="isAgreeUpdateDoc && !isView" class="cursor-pointer outline-none">
                <a-tooltip>
                  <template #title>
                    <span>Xoá tài liệu</span>
                  </template>
                  <delete-icon class="outline-none" />
                </a-tooltip>
              </div>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </c-table>
  </div>
</template>

<script lang="ts">
</script>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import {DeleteIcon, useAuthStore, useSysStore } from 'dnp-core'
import { message } from 'ant-design-vue'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import {storeToRefs} from "pinia";
import { columnTableDocsContract } from './columns.ts'
import { GLOBAL_ROLES } from '@/configs'
import { contractProjectListService } from '@/apis/project-management/project-list/contract-manage'

const props = defineProps({
  assetProjectContractId: {
    type: Number,
    required: true
  },
  isView: {
    type: Boolean,
    default: false
  }
})

const isAgreeUpdateDoc = computed(() =>
  hasRole(GLOBAL_ROLES.PROJECT_MANAGEMENT_CONTRACT_UPDATE_DOCUMENT)
)
const { hasRole } = useAuthStore()
const dataTable = ref([])
const dataTableDelete = ref([])
const dataTableUpdate = ref([])
const loadingTable = ref(false)

const { globalListItems } = storeToRefs( useSysStore())
const { fetchGlobalListItems } = useSysStore()
const typeDocList = computed(() => globalListItems.value['ASM_ASSET_PROJECT_CONTRACT_DOC.TYPE'])

const disabledButtonSave = computed(() => {
  const isCheckFieldName = dataTable.value?.filter((d) => !d.name)?.length
  const isCheckTypeContract = dataTable.value?.filter((d) => !d.type)?.length

  return isCheckFieldName || isCheckTypeContract
})

const emit = defineEmits(['change'])

const changeValue = (index) => {
  dataTable.value[index] = { ...dataTable.value[index], isUpdated: true }
}

const handleUpdateValue = (bol) => {
  emit('change', bol)
}

const handleAddRow = () => {
  dataTable.value.push({
    assetProjectContractId: props.assetProjectContractId,
    type: null,
    fileList: [],
    listFileAdd: [],
    listFileDelete: []
  })
}

const handleSave = () => {
  updateDocContract(dataTable.value)
}

const getDocContract = async () => {
  handleUpdateValue(false)
  dataTableUpdate.value = []
  dataTableDelete.value = []
  dataTable.value = []
  try {
    loadingTable.value = true
    const res = await contractProjectListService.getDocOfContract({
      assetProjectContractId: props.assetProjectContractId,
      pageSize: null,
      currentPage: 0
    })
    if (res.message === 'SUCCESS') {
      dataTable.value = res.body.data
    }
  } finally {
    loadingTable.value = false
  }
}

const updateDocContract = async (data) => {
  const listIdDelete = dataTableDelete.value?.map((d) => d.id)
  try {
    loadingTable.value = true
    const res = await contractProjectListService.updateDocOfContract({
      listContractDoc: dataTable.value?.filter((d) => !listIdDelete.includes(d.id)),
      listContractDocDelete: dataTableDelete.value
    })
    if (res.message === 'SUCCESS') {
      message.success('Lưu thành công')
      await getDocContract()
    }
  } finally {
    loadingTable.value = false
  }
}

const handleRemoveRow = async (record, index) => {
  if (record.id) {
    const res = await contractProjectListService.updateDocOfContract({
      listContractDoc: dataTable.value?.filter((d) => record.id !== d.id),
      listContractDocDelete: [record]
    })
    if (res.message === 'SUCCESS') {
      message.success('Xoá thành công')
      await getDocContract()
    }
  } else {
    dataTable.value = dataTable.value?.filter((d, i) => index !== i)
  }
  handleUpdateValue(false)
}

const handleChangeFile = ({ fileList }, record) => {
  const listKey = fileList.map((d) => d.key)
  const listKeyFileProps = record.fileList?.map((d) => d.publicFileKey) || []

  //lấy ra key các file thêm vào
  const listFileAdd = listKey?.filter((l) => !listKeyFileProps.includes(l)) || []

  //lấy ra key các file xoá
  const listFileDelete =
    record.fileList
      ?.filter((l) => !listKey.includes(l.publicFileKey))
      ?.map((f) => f.publicFileKey) || []

  // record.fileList = fileList.map((f) => ({
  //   fileName: f.name,
  //   fileUrl: f.url,
  //   publicFileKey: f.key
  // }))
  record.listFileAdd = listFileAdd
  record.listFileDelete = listFileDelete
}

onMounted(() => {
  fetchGlobalListItems('ASM_ASSET_PROJECT_CONTRACT_DOC.TYPE')
})

watch(
  () => props.assetProjectContractId,
  (newVal, oldVal) => {
    if (newVal) {
      getDocContract()
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => dataTable.value,
  (newVal, oldVal) => {
    if (newVal?.find((n) => n.isUpdated)) {
      handleUpdateValue()
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="scss">
.doc-contract {
  .ant-table-tbody {
    .ant-table-cell {
      padding: 5px 0 !important;
    }
  }
}
</style>
