<template>
  <div class="note-step">
    <div class="title-step">
      <project-icon class="mr-[5px]" />
      Ghi chú
    </div>

    <div class="container">
      <a-textarea
        v-model:value="modelRef.description"
        placeholder="....."
        :bordered="false"
        :rows="2"
        :disabled="isView"
        :autoSize="{ minRows: 2, maxRows: 2 }"
        @change="handleChangeValue"
      />
    </div>
  </div>
</template>

<script lang="ts">
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {ProjectIcon} from 'dnp-core'
import { debounce } from 'lodash'

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  isView: {
    type: Boolean,
    default: false
  }
})

const modelRef = ref({ description: null })

const emit = defineEmits(['change'])

const handleChangeValue = debounce(() => {
  emit('change', modelRef.value.description)
}, 500)

const setField = (data) => {
  modelRef.value.description = data
}

watch(
  () => props.record,
  (newVal, oldVal) => {
    setField(newVal)
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
.note-step {
  textarea {
    font-size: 13px;
    font-weight: 500;
    padding: 4px 0;
  }
}
</style>
