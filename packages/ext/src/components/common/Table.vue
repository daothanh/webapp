<template>
  <div>
    <a-card class="card-table" :class="{ 'table-custom-header': !title }">
      <template #title>
        <div v-if="title" class="cursor-pointer outline-none">
          <caret-right-outlined :rotate="90" />
          <span class="font-semibold ml-[7px]"> {{ title }} </span>
        </div>
        <slot v-else name="customerTitle" />
      </template>
      <template #extra>
        <div class="flex items-center gap-4">
          <c-input
            v-if="showQuickSearch"
            v-model:value="quickSearch"
            style="min-width: 300px"
            placeholder="Tìm kiếm nhanh..."
            @input="handleChangeValueSearch"
          >
            <template #prefix>
              <search-outlined style="color: #94989a; font-size: 16px" />
            </template>
          </c-input>
          <slot name="extraAction" />
          <div
            v-if="showDownloadFileExcel"
            class="hover:cursor-pointer flex my-auto"
            @click="handleExportExcel"
          >
            <a-button :loading="loadingExportExcelAll" class="flex my-auto items-center">
              <template #icon>
                <download-outlined />
              </template>
              Xuất Excel
            </a-button>
          </div>
          <div v-if="showActions" class="hover:cursor-pointer flex my-auto" @click="reloadData">
            <a-tooltip>
              <template #title>Lấy lại dữ liệu</template>
              <reload-icon />
            </a-tooltip>
          </div>
          <div
            v-if="showZoomOut"
            class="hover:cursor-pointer flex my-auto"
            @click="handleToggleFullScreen(true)"
          >
            <a-tooltip placement="topLeft">
              <template #title>Phóng to bảng toàn màn hình</template>
              <fullscreen-icon />
            </a-tooltip>
          </div>
          <div
            v-if="showSetting && showActions"
            class="hover:cursor-pointer flex my-auto"
            @click="visibleModalSetting = true"
          >
            <a-tooltip placement="topLeft">
              <template #title>Tùy chọn giao diện</template>
              <setting-icon />
            </a-tooltip>
          </div>
        </div>
      </template>
      <slot />
      <a-table
        v-if="showTable"
        ref="myTableRef"
        v-bind="$attrs"
        :bordered="border"
        :data-source="dataSource"
        :columns="columnsTable"
        class="c-table ant-table-striped"
        :loading="loading"
        :scroll="allowScroll ? { x: '100%', y: scrollY } : null"
        :row-class-name="
          rowClassFunc
            ? rowClassFunc
            : (_record, index) => [
                index % 2 === 1 && !showActiveRow ? `${showStriped ? 'table-striped' : ''}` : '',
                selectedRowKey === _record.id ? 'row-active' : ''
              ]
        "
        ,
        :class="{ 'table-border': border }"
        :custom-row="customRow"
        @scroll="handleScrollTable"
      >
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
          <slot v-bind="slotData" :name="name" />
        </template>
        <template #emptyText>
          <a-empty :description="'Trống'" />
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-if="visibleFullScreen"
      v-model:visible="visibleFullScreen"
      width="100%"
      class="fullscreen bg-white"
      wrap-class-name="full-modal"
      :footer="false"
      :body-style="{
        background: '#FFFFFF'
      }"
    >
      <a-card class="card-table" :class="{ 'table-custom-header': !title }">
        <template #title>
          <div v-if="title" class="cursor-pointer outline-none">
            <caret-right-outlined :rotate="90" />
            <span class="font-semibold ml-[7px]"> {{ title }} </span>
          </div>
          <slot v-else name="customerTitle" />
        </template>
        <template #extra>
          <div class="flex items-center gap-4">
            <c-input
              v-if="showQuickSearch"
              v-model:value="quickSearch"
              style="min-width: 300px"
              placeholder="Tìm kiếm nhanh..."
              @input="handleChangeValueSearch"
            >
              <template #prefix>
                <search-outlined style="color: #94989a; font-size: 16px" />
              </template>
            </c-input>
            <slot name="extraAction" />
            <div
              v-if="showDownloadFileExcel"
              class="hover:cursor-pointer flex my-auto"
              @click="handleExportExcel"
            >
              <a-button class="flex my-auto items-center">
                <template #icon>
                  <download-outlined />
                </template>
                Xuất Excel
              </a-button>
            </div>
            <div v-if="showActions" class="hover:cursor-pointer flex my-auto" @click="reloadData">
              <a-tooltip>
                <template #title>Lấy lại dữ liệu</template>
                <reload-icon />
              </a-tooltip>
            </div>
            <div class="hover:cursor-pointer flex my-auto" @click="handleToggleFullScreen(false)">
              <a-tooltip placement="topLeft">
                <template #title>Thu nhỏ bảng</template>
                <fullscreen-exit-outlined :style="{ fontSize: '20px', color: '#73777A' }" />
              </a-tooltip>
            </div>
            <div
              v-if="showSetting"
              class="hover:cursor-pointer flex my-auto"
              @click="visibleModalSetting = true"
            >
              <a-tooltip placement="topLeft">
                <template #title>Tùy chọn giao diện</template>
                <setting-icon />
              </a-tooltip>
            </div>
          </div>
        </template>
        <a-table
          v-if="showTable"
          v-bind="$attrs"
          :bordered="border"
          :data-source="dataSource"
          :columns="columnsTable"
          class="c-table ant-table-striped"
          :loading="loading"
          :scroll="allowScroll ? { x: '100%', y: scrollY } : null"
          :row-class-name="
            rowClassFunc
              ? rowClassFunc
              : (_record, index) => [
                  index % 2 === 1 && !showActiveRow ? `${showStriped ? 'table-striped' : ''}` : '',
                  selectedRowKey === _record.id ? 'row-active' : ''
                ]
          "
          :class="{ 'table-border': border }"
          :custom-row="customRow"
          @scroll="handleScrollTable"
        >
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
            <slot v-bind="slotData" :name="name" />
          </template>
          <template #emptyText>
            <a-empty :description="'Trống'" />
          </template>
        </a-table>
        <slot />
      </a-card>
    </a-modal>
    <a-drawer
      title="Cấu hình table"
      size="large"
      :visible="visibleModalSetting"
      :z-index="102"
      :body-style="{ paddingBottom: '80px' }"
      @close="handleCloseSetting"
    >
      <drop-table
        :columns="columnsTable"
        :fields-column-ignore-config="fieldsColumnIgnoreConfig"
        @update:columns="handleUpdateColumn"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TableCustom'
}
</script>
<script setup lang="ts">
import {
  CaretRightOutlined,
  SearchOutlined,
  DownloadOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons-vue'
import {FullscreenIcon, ReloadIcon, SettingIcon} from 'ui'
import { ref, watch, onMounted } from 'vue'
import debounce from 'lodash/debounce'
import { useRouter } from 'vue-router'
import { onExportExcel } from '@/utils'

const props = defineProps({
  title: {
    type: String,
    default: 'Kết quả tìm kiếm'
  },
  columns: {
    type: Array,
    required: true
  },
  border: {
    type: Boolean,
    default: false
  },
  rowClassFunc: {
    type: Function
  },
  loading: {
    type: Boolean,
    default: false
  },
  allowScroll: {
    type: Boolean,
    default: true
  },
  dataSource: {
    type: Array,
    required: true
  },
  isExportAll: {
    type: Boolean,
    default: false
  },
  loadingExportExcelAll: {
    type: Boolean,
    default: false
  },
  scrollY: {
    type: Number,
    required: false
  },
  showDownloadFileExcel: {
    type: Boolean,
    default: true
  },
  showStriped: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  selectedRowKey: {
    type: Number,
    default: 0
  },
  showZoomOut: {
    type: Boolean,
    default: true
  },
  quickSearchValue: {
    type: String,
    default: ''
  },
  showQuickSearch: {
    type: Boolean,
    default: true
  },
  showSetting: {
    type: Boolean,
    default: true
  },
  showTable: {
    type: Boolean,
    default: true
  },
  showActiveRow: {
    type: Boolean,
    default: false
  },
  reloadData: Function
})
const emit = defineEmits([
  'handleQuickSearch',
  'onClickRow',
  'handleExportExcel',
  'scroll',
  'onFirstRowScroll'
])
const selectedRow = ref(null)
const columnsTable = ref([])
const quickSearch = ref('')
const visibleModalSetting = ref(false)
const visibleFullScreen = ref(false)

const myTableRef = ref(null)

const router = useRouter()
const handleChangeValueSearch = debounce(() => {
  emit('handleQuickSearch', String(quickSearch.value).trim())
}, 500)

const customRow = (record, index) => {
  return {
    onClick: () => {
      handleClickRowTable(record, index)
    },
    className: props.showActiveRow && index === selectedRow.value ? 'row-active' : ''
  }
}

const handleToggleFullScreen = (open = false) => {
  emit('onFirstRowScroll', {})
  visibleFullScreen.value = open
}

const handleExportExcel = () => {
  if (props.isExportAll) {
    emit('handleExportExcel')
  } else {
    onExportExcel(props.columns, props.dataSource, router)
  }
}

const handleCloseSetting = () => {
  visibleModalSetting.value = false
}

const handleUpdateColumn = (columns: any[]) => {
  columnsTable.value = columns.filter((v: { hidden: any }) => !v.hidden)
}

const handleClickRowTable = (record, index) => {
  selectedRow.value = index
  emit('onClickRow', record)
}

const handleScrollTable = (e) => {
  emit('scroll', e)

  const tableBodyElement = e.target
  const scrollPosition = tableBodyElement.scrollTop

  const rows = tableBodyElement.querySelectorAll('.ant-table-row')
  let accumulatedHeight = 0

  let currentRowIndex = -1
  for (let i = 0; i < rows.length; i++) {
    const rowHeight = rows[i].clientHeight
    accumulatedHeight += rowHeight

    if (accumulatedHeight > scrollPosition + 20) {
      currentRowIndex = i
      break
    }
  }

  if (currentRowIndex !== -1) {
    const currentRow = props.dataSource[currentRowIndex]

    emit('onFirstRowScroll', currentRow)
  }
}

onMounted(() => {
  if (myTableRef.value) {
    const tableBodyElement = myTableRef.value.$el.querySelector('.ant-table-body')
    if (tableBodyElement) {
      tableBodyElement.addEventListener('scroll', handleScrollTable)
    }
  }
})

watch(
  () => props.loading,
  () => {
    if (!props.loading) {
      selectedRow.value = null
      columnsTable.value = props.columns?.filter((v: { hidden: boolean }) => !v.hidden)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss">
.table-custom-header {
  .ant-card-head-wrapper {
    align-items: end;
    gap: 5px;
  }
}
.card-table.ant-card-bordered {
  border: none;
  .ant-card-head {
    border: none;
    padding: 8px;
    .ant-card-head-title {
      padding: 0;
    }
  }
  .ant-card-extra {
    padding: 0;
  }
}

.card-table,
.customer-table {
  .ant-card-body {
    padding: 10px;
  }
}
.c-table,
.customer-table {
  .row-active {
    .ant-table-cell {
      background-color: #c0ecff !important;
    }
  }
  .table-striped td {
    background-color: #fafafa !important;
  }
  table {
    overflow-y: clip;
    tr > th,
    tr > td {
    }
    .ant-table-thead > tr > th {
      background: #fafafa;
      font-weight: 700;
    }
    tr > td {
      font-weight: 600;
    }
  }
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not(
      [colspan]
    )::before {
    background-color: rgba(0, 0, 0, 0.25) !important ;
    width: 1px !important;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.3s;
  }
  .pagination {
    .ant-pagination-options {
      display: none;
    }
  }
  .ant-table-striped :deep(.table-striped) td {
    background-color: #d9d9d9;
  }
  .ant-table-ping-left {
    .ant-table-cell-fix-left {
      &::before {
        display: none;
      }
    }
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px;
  }
}
.fullscreen {
  width: 100% !important;
  margin: 0;
  max-width: none !important;
  height: 100%;
  padding: 0 !important;
  top: 0 !important;
  .c-table {
    margin-top: 30px !important;
  }
  .ant-modal-content {
    height: 100% !important;
  }
  .ant-modal-body {
    padding-top: 50px !important;
  }
  table {
    .td-production {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 43px;
      &:hover {
        background: #1990ff;
        color: #000000 !important;
        .ant-input-suffix {
          width: 20px;
          border: 1px solid #00000040;
        }
      }
      input {
        cursor: pointer;
        transition: all 0.3s;
        height: 100%;
        text-align: center;
      }
      .ant-input-suffix {
        background: #ffffff;
        transition: all 0.3s;
        display: none;
        border-radius: 100px;
        border: 1px solid transparent;
        width: 0;
        height: 20px;
        justify-content: center;
        align-items: center;
      }
    }

    .ant-table-cell {
      min-width: 100px !important;
    }
    .ant-table-row {
      td {
        height: 45px !important;
        padding: 1px !important;
        max-width: 100px !important;
        &:first-child {
          padding-left: 10px !important;
        }
      }
    }
  }
  .th-input,
  .th-input-data,
  .td-input,
  .td-data {
    height: 100%;
    .c-input,
    input,
    .ant-input-number,
    .ant-input-affix-wrapper,
    .ant-input-number-input-wrap {
      width: 100% !important;
      height: 100% !important;
      border-radius: 5px !important;
      background: transparent !important;
      font-weight: 600;
      text-align: center;
    }

    .c-input__wrapper {
      border-radius: 5px;
      border: 1px solid #9f9f9f4a !important;
      transition: 0.3s !important;
      input {
        border: none !important;
      }
    }
    .c-input,
    .ant-input-number,
    .ant-input-affix-wrapper {
      border-radius: 5px;
      border: 1px solid #9f9f9f4a !important;
      transition: 0.3s !important;
      input {
        border: none !important;
      }
      &:hover {
        border: 1px solid rgba(24, 144, 255, 1) !important;
      }
    }
  }
  .th-input {
    input[disabled] {
      color: #000000 !important;
    }
  }
  .th-input-data {
    input {
      color: #2d3dd2;
    }
  }
}

.table-border {
  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not(
      [colspan]
    )::before {
    display: none !important;
  }
}
</style>
