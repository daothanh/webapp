<template>
  <a-collapse v-model:activeKey="activeKey" class="collapse-criteria">
    <template #expandIcon="{ isActive }">
      <caret-right-outlined
        :rotate="isActive ? 90 : 0"
        style="font-size: 16px; margin-right: 6px"
      />
    </template>
    <a-collapse-panel
      key="1"
      :header="header"
      style="background: white; border-radius: 4px; border: 0; overflow: hidden"
    >
      <div :class="['justify-between items-center', { flex: isHorizontalLayout }]">
        <div class="flex-1">
          <slot />
        </div>
        <div v-if="isShowSearch" class="flex justify-end space-x-2">
          <c-button @click="onCancel">
            <template #icon>
              <close-outlined />
            </template>
            Bỏ lọc
          </c-button>
          <c-button type="primary" :disabled="loading || disable" @click="onSearch">
            <template #icon>
              <search-outlined />
            </template>
            Tìm kiếm
          </c-button>
        </div>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>
<script lang="ts" setup>
import { CaretRightOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

defineProps({
  header: {
    type: String,
    default: 'Tìm kiếm'
  },
  loading: {
    type: Boolean,
    default: false
  },
  isHorizontalLayout: {
    type: Boolean,
    default: false
  },
  isShowSearch: {
    type: Boolean,
    default: true
  },
  disable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['handleSearch', 'handleCancel'])
const activeKey = ref(1)
const onSearch = () => {
  emit('handleSearch')
}
const onCancel = () => {
  emit('handleCancel')
}
</script>

<style lang="scss">
.collapse-criteria {
  margin-bottom: 4px;
  background: white;
  box-shadow: 0 2px 4px 1px #ddd;
  .ant-collapse-header {
    padding: 8px !important;
    font-weight: 600;
    font-size: 16px;
  }
  .ant-collapse-content-box {
    padding: 8px;
  }
}
</style>
