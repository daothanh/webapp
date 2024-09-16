<template>
  <a-spin :spinning="loading" wrapper-class-name="spin-directory-tree">
    <div
      v-if="autoCollapse"
      class="cursor-pointer bg-white h-[calc(100vh_-_168px)]"
      :class="`${
        !collapseTree ? 'tree-water-supply-area-slide-out' : 'tree-water-supply-area-slide-in'
      }`"
      @mouseleave="handleCollapseTree(false, 500)"
      @mouseenter="handleCollapseTree(true)"
    >
      <div v-show="!collapseTree" class="flex justify-end p-3">
        <div class="cursor-pointer">
          <a-tooltip>
            <template #title>Phóng to vùng cấp nước</template>
            <double-right-outlined />
          </a-tooltip>
        </div>
      </div>
      <transition name="fade">
        <div v-if="collapseTree" :class="`w-[${width}px]`">
          <a-directory-tree v-bind="$attrs"> </a-directory-tree>
        </div>
        <div v-else class="bg-red-500 flex-1 w-full"></div>
      </transition>
    </div>
    <a-directory-tree v-else v-bind="$attrs"> </a-directory-tree>
  </a-spin>
</template>

<script lang="ts">
export default {
  name: 'DirectoryTree'
}
</script>

<script lang="ts" setup>
import debounce from 'lodash/debounce.js'
import { ref } from 'vue'
import { DoubleRightOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  autoCollapse: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 300
  }
})

const collapseTree = ref(true)

const handleCollapseTree = (val, seconds) => {
  const debounceDuration = seconds || 300

  const debouncedFunction = debounce((value) => {
    collapseTree.value = value
  }, debounceDuration)

  debouncedFunction(val)
}
</script>

<style lang="scss" scoped>
.tree-water-supply-area-slide-out {
  transform: translateX(calc(-100% + 39px));
  transition: all 0.2s ease-in;
}

.tree-water-supply-area-slide-in {
  transform: translateX(0);
  transition: all 0.2s ease-in;
}

.arrow-slide-out {
  transition: all 0.2s ease-in;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style lang="scss">
.spin-directory-tree {
  position: relative;
  background: white;
  .ant-spin-container {
    position: sticky;
    top: 0;
    bottom: 0;
  }
}
</style>
