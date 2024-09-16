<template>
  <div class="approve-step">
    <div class="title-step">
      <project-icon class="mr-[5px]" />
      {{ checkStateOverApproved ? 'Phụ trách' : 'Phê duyệt' }}
    </div>

    <div class="container">
      <div class="field" v-for="(m, index) in modelRef" :key="index">
        <div class="flex w-full items-center gap-[5px]">
          <div class="label" :class="{ 'font-[600] underline': !m.key }">
            {{ m.key || 'Tổng chi phí dự toán' }} :
          </div>
          <div class="content">
            <a-input
              v-model:value="m.value"
              :bordered="false"
              placeholder="....."
              :disabled="isView"
              @change="handleChangeValue"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ApproveStep'
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import ProjectIcon from '@/assets/svg/ProjectIcon.vue'
import { APPROVE_STEP_PROJECT, APPROVE_STEP_PROJECT_OVER_APPROVED, STATE_PROJECT } from '@/configs'
import INumber from '@/components/common/Number.vue'
import { debounce } from 'lodash'

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  isView: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const modelRef = ref([])

const checkStateOverApproved = computed(() => {
  return parseFloat(props.state) > parseFloat(STATE_PROJECT.APPROVE_PROJECT)
})

const handleChangeValue = debounce(() => {
  emit('change', modelRef.value)
}, 500)

const setField = (data) => {
  modelRef.value = JSON.parse(
    JSON.stringify(
      data
        ? data
        : checkStateOverApproved.value
        ? APPROVE_STEP_PROJECT_OVER_APPROVED
        : APPROVE_STEP_PROJECT
    )
  )
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
.approve-step {
}
</style>
