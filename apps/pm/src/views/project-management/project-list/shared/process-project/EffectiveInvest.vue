<template>
  <div class="effective-invest">
    <div class="title-step">
      <project-icon class="mr-[5px]" />
      {{ checkStateOverApproved ? 'Kết quả thực hiện (lũy kế)' : 'Hiệu quả đầu tư' }}
    </div>

    <div class="container">
      <div class="field" v-for="(m, index) in modelRef" :key="index">
        <div class="flex w-full items-center gap-[5px]">
          <div class="label" :class="{ 'font-[600] underline': !m.key }">
            {{ m.key || 'Tổng chi phí dự toán' }} :
          </div>
          <div class="content">
            <i-number
              v-model="m.value"
              number-only
              noBorder
              :readonly="isView"
              placeholder="....."
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              :hasSuffix="m.unit"
              @input-change="handleChangeValue"
            >
              <template #suffix> {{ m.unit }} </template>
            </i-number>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EffectiveInvest'
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import {ProjectIcon, INumber} from 'ui'
import {
  EFFECTIVE_INVEST_PROJECT,
  STATE_PROJECT,
  EFFECTIVE_INVEST_PROJECT_OVER_APPROVED
} from '@/configs'
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
        ? EFFECTIVE_INVEST_PROJECT_OVER_APPROVED
        : EFFECTIVE_INVEST_PROJECT
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
.effective-invest {
}
</style>
