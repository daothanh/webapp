<template>
  <div class="doc-project">
    <c-table
      :title="false"
      :columns="columns"
      :data-source="dataTable"
      :pagination="false"
      :loading="loadingTable"
      :reload-data="getDocProject"
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
        <template v-if="['name', 'type', 'state', 'projectState'].includes(column.dataIndex)">
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
            :disabled="isView"
            @change="changeValue(index)"
          />
        </template>

        <template v-if="column.dataIndex === 'type'">
          <c-select
            v-model:value="record.type"
            :options="typeDocList"
            :loading="loadingTypeDocList"
            allow-clear
            :bordered="false"
            placeholder="Chọn loại tài liệu"
            :field-names="{
              label: 'name',
              value: 'value'
            }"
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
            :visible="loadingTable || record.fileList?.length > 0"
            placeholder="Thêm file"
            @on-change="(data) => handleChangeFile(data, record)"
          />
        </template>

        <template v-if="column.dataIndex === 'state'">
          <c-select
            v-model:value="record.state"
            :options="stateDocList"
            :loading="loadingStateDocList"
            allow-clear
            :bordered="false"
            placeholder="Chọn trạng thái"
            :field-names="{
              label: 'name',
              value: 'value'
            }"
            :disabled="isView"
          />
        </template>

        <template v-if="column.dataIndex === 'projectState'">
          <c-select
            v-model:value="record.projectState"
            :options="projectStateList"
            :loading="loadingStateProjectList"
            allow-clear
            :bordered="false"
            placeholder="Chọn giai đoạn"
            :field-names="{
              label: 'name',
              value: 'value'
            }"
            :disabled="isView"
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
              title="Bạn có chắc chắn muốn xóa tài liệu này?"
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
export default {
  name: 'DocProject'
}
</script>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import DeleteIcon from '@/assets/svg/DeleteIcon.vue'
import { columnTableDocs } from './columns.ts'
import { projectListService } from '@/apis/project-management/project-list'
import { message } from 'ant-design-vue'
import { checkRoles } from '@/utils'
import { GLOBAL_ROLES } from '@/configs'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { getGlobalListDetail } from '@/apis/global'

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  isView: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: () => 'legal'
  }
})
const columns = computed(() => {
  if (props.type === 'quality') {
    return columnTableDocs.filter((item) => item['dataIndex'] !== 'type')
  } else {
    return columnTableDocs
  }
})
const isAgreeUpdateDoc = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_MANAGEMENT_UPDATE_DOCUMENT))

const dataTable = ref([])
const dataTableDelete = ref([])
const dataTableUpdate = ref([])
const loadingTable = ref(false)

const typeDocList = ref([])
const loadingTypeDocList = ref(false)

const stateDocList = ref([])
const loadingStateDocList = ref(false)

const projectStateList = ref([])
const loadingStateProjectList = ref(false)

const disabledButtonSave = computed(() => {
  const isCheckFieldName = dataTable.value?.filter((d) => !d.name)?.length
  const isCheckStateDoc = dataTable.value?.filter((d) => !d.state)?.length
  const isCheckStateProject = dataTable.value?.filter((d) => !d.projectState)?.length
  const isCheckTypeProject = dataTable.value?.filter((d) => !d.type)?.length

  // const isCheckFieldFiles = dataTable.value?.filter((d) => !d.fileList?.length)?.length

  return (
    isCheckFieldName ||
    isCheckStateDoc ||
    isCheckStateProject ||
    (isCheckTypeProject && props.type === 'legal')
  )
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
    assetProjectId: props.record.id,
    state: null,
    projectState: null,
    type: props.type === 'quality' ? 6 : null,
    fileList: [],
    listFileAdd: [],
    listFileDelete: []
  })
}

const handleSave = () => {
  updateDocProject(dataTable.value)
}

const getDocProject = async () => {
  handleUpdateValue(false)
  dataTableUpdate.value = []
  dataTableDelete.value = []

  try {
    loadingTable.value = true
    const res = await projectListService.getDocOfProject({
      assetProjectId: props.record?.id,
      doc_type: props.type,
      pageSize: null,
      currentPage: 0
    })
    if (res.message === 'SUCCESS') {
      if (props.type === 'quality') {
        dataTable.value = res.body.data.filter((item) => item.type === 6)
      } else {
        dataTable.value = res.body.data.filter((item) => item.type !== 6)
      }
    }
  } finally {
    loadingTable.value = false
  }
}

const updateDocProject = async (data) => {
  const listIdDelete = dataTableDelete.value?.map((d) => d.id)
  try {
    loadingTable.value = true
    const res = await projectListService.updateDocOfProject({
      listDoc: dataTable.value?.filter((d) => !listIdDelete.includes(d.id)),
      listDocDelete: dataTableDelete.value
    })
    if (res.message === 'SUCCESS') {
      message.success('Lưu thành công')
      await getDocProject()
    }
  } finally {
    loadingTable.value = false
  }
}

const handleRemoveRow = async (record, index) => {
  if (record.id) {
    const res = await projectListService.updateDocOfProject({
      listDoc: dataTable.value?.filter((d) => record.id !== d.id),
      listDocDelete: [record]
    })
    if (res.message === 'SUCCESS') {
      message.success('Xoá thành công')
      await getDocProject()
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

const getTypeDocList = async () => {
  loadingTypeDocList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT_DOC.TYPE' })
    if (res.message === 'SUCCESS') {
      typeDocList.value =
        res.body
          ?.filter((docType) => props.type !== 'quality' && parseInt(docType.value) !== 6)
          .map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingTypeDocList.value = false
  }
}

const getStateProjectList = async () => {
  loadingStateProjectList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.STATE' })
    if (res.message === 'SUCCESS') {
      projectStateList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingStateProjectList.value = false
  }
}

const getStateDocList = async () => {
  loadingStateDocList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT_DOC.STATE' })
    if (res.message === 'SUCCESS') {
      stateDocList.value = res.body?.map((d) => ({ ...d, value: parseFloat(d.value) })) || []
    }
  } finally {
    loadingStateDocList.value = false
  }
}

onMounted(() => {
  getTypeDocList()
  getStateProjectList()
  getStateDocList()
})

watch(
  () => props.record,
  (newVal, oldVal) => {
    getDocProject()
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
.doc-project {
  .ant-table-tbody {
    .ant-table-cell {
      padding: 5px 0 !important;
    }
  }
}
</style>
