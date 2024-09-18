<template>
  <a-select
    v-if="!isTree"
    :class="`${width ? width : ''}`"
    :loading="loading"
    :value="selectedId"
    @change="handleChangeRouter"
  >
    <a-select-option v-for="item in list" :key="item.id" :value="item.id" :disabled="item.disabled">
      {{ item.title }}
    </a-select-option>
  </a-select>

  <a-tree-select
    v-else
    v-model:value="selectedIdValue"
    :class="`${width ? width : ''}`"
    :list-height="listHeight"
    placeholder="Please select"
    tree-default-expand-all
    :tree-data="list"
    @select="handleChangeTreeRouter"
  >
  </a-tree-select>
</template>

<script lang="ts">
export default {
  name: 'SelectRouter'
}
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  width: {
    type: [Number, String],
    required: false,
    default: () => null
  },
  selectedId: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    required: false
  },
  onChange: {
    type: Function,
    required: false,
    default: () => null
  },
  list: {
    type: Array,
    required: true
  },
  isTree: {
    type: Boolean,
    default: false
  },
  listHeight: {
    type: Number,
    default: 400
  }
})
const router = useRouter()
const selectedIdValue = computed(() => {
  return props.selectedId || -1
})
const handleChangeRouter = (id: number) => {
  const item = props.list.find((l: { id: number }) => l.id === id)

  if (item && item.name) {
    router.push({ name: item.name })
  }
}

const handleChangeTreeRouter = (_, val) => {
  router.push({ name: val.name })
}
</script>

<style scoped></style>
