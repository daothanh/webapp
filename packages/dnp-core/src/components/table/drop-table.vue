<template>
  <section id="drop-table">
    <a-list bordered>
      <template #header>
        <h3>Cấu hình table</h3>
      </template>
      <a-list-item>
        <a-skeleton avatar :loading="false" :title="false">
          <a-list-item-meta>
            <template #title>
              <div>
                <span>{{ 'Tên cột' }}</span>
              </div>
            </template>
            <template #avatar> <sort-icon class="mt-[4px]" /></template>
          </a-list-item-meta>
          <h4>Ẩn cột</h4>
        </a-skeleton>
      </a-list-item>
      <table-draggable
        id="customers"
        class="mb-2"
        group="columnDropTables"
        :list="columnDropTables"
        filter="textarea"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template v-for="column in columnDropTables" :key="column">
          <a-list-item>
            <a-skeleton avatar :loading="false" :title="false">
              <a-list-item-meta :description="column.description" class="cursor-grab">
                <template #title>
                  <div>
                    <span>{{ column.title }}</span>
                  </div>
                </template>
                <template #avatar>
                  <drag-icon class="mt-[4px]" />
                </template>
              </a-list-item-meta>
              <a-checkbox
                v-model:checked="column.hidden"
                :disabled="disabledChecked(column.dataIndex)"
              ></a-checkbox>
            </a-skeleton>
          </a-list-item>
        </template>
      </table-draggable>
    </a-list>
  </section>
</template>

<script lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import { defineComponent, reactive, watch } from 'vue'
import SortIcon from '../../ui/icons/sort-icon.vue'
import DragIcon from '../../ui/icons/drag-icon.vue'

export default defineComponent({
  components: {
    SortIcon,
    DragIcon,
    'table-draggable': VueDraggableNext
  },
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    fieldsColumnIgnoreConfig: {
      type: Array,
      default() {
        return []
      }
    }
  },
  emits: ['update:columns'],
  setup(props: any, { emit }) {
    const columnDropTables = reactive(props.columns)
    watch(columnDropTables, (data) => {
      emit('update:columns', data)
    })
    const handleResizeColumn = (w: any, col: { width: any }) => {
      col.width = w
    }
    const disabledChecked = (key: any) => {
      if (props.fieldsColumnIgnoreConfig && Array.isArray(props.fieldsColumnIgnoreConfig)) {
        const result = props.fieldsColumnIgnoreConfig.find((v: any) => {
          return String(v) === String(key)
        })
        return Boolean(result)
      }
      return false
    }
    return {
      doing: [],
      done: [],
      columnDropTables,
      dragging: false,
      columnsDrop: [
        {
          title: '',
          dataIndex: 'drop',
          scopedSlots: { customRender: 'drop' },
          align: 'center',
          ellipsis: true,
          width: 50
        },
        {
          title: 'Tên cột trên giao diện',
          dataIndex: 'drop',
          scopedSlots: { customRender: 'drop' },
          align: 'center',
          ellipsis: true,
          width: 200
        },
        {
          title: 'Ẩn / Hiện thông tin',
          dataIndex: 'hideInfo',
          scopedSlots: { customRender: 'hideInfo' },
          align: 'center',
          ellipsis: true,
          width: 180
        },
        {
          title: 'Độ rộng',
          dataIndex: 'width',
          scopedSlots: { customRender: 'width' },
          align: 'center',
          ellipsis: true,
          width: 120
        },
        {
          title: 'Kiểu hiện thị',
          dataIndex: 'filter',
          scopedSlots: { customRender: 'filter' },
          align: 'center',
          ellipsis: true,
          width: 120
        },
        {
          title: 'Ghi chú',
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' },
          align: 'center',
          ellipsis: true
        }
      ],
      handleResizeColumn,
      disabledChecked
    }
  },
  data() {
    return {}
  }
})
</script>

<style lang="scss">
#drop-table {
  span {
    font-weight: normal;
  }
  h4 {
    margin: 0;
  }
  .ant-list-item {
    background: #ffffff;
  }
  .ant-list-item,
  .ant-list-item-meta {
    display: flex;
    align-items: center;
  }
  .ant-list-bordered .ant-list-header {
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.3s ease;
  }
}
</style>
