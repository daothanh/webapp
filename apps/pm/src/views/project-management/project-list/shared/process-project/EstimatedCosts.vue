<template>
  <div class="estimated-costs">
    <div class="title-step">
      <project-icon class="mr-[5px]" />
      {{ checkStateOverApproved ? 'Quản lý chi phí' : 'Chi phí dự toán' }}
    </div>

    <div class="container">
      <div class="field" v-for="(m, index) in modelRef" :key="index">
        <div class="flex w-full items-center gap-[5px]">
          <div
            class="label"
            :class="[{ 'font-[600] underline': !m.key || (m.children && m.children.length) }]"
          >
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
        <div
          class="child flex justify-between"
          v-for="(c, i) in m.children"
          :key="i"
          v-if="m.children"
        >
          <div class="label-c" :class="{ 'font-[600]': c.color }" :style="{ color: c.color }">
            {{ c.key }} :
          </div>
          <div class="content" v-if="c.value != null">
            <i-number
              class="text-end"
              v-model="c.value"
              number-only
              justify="end"
              noBorder
              :readonly="isView"
              placeholder="....."
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              :hasSuffix="c.unit"
              @input-change="handleChangeValue"
            >
              <template #suffix> {{ c.unit }} </template>
            </i-number>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EstimatedCosts'
}
</script>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import {ProjectIcon, INumber} from 'ui'
import {
  ESTIMATED_COSTS_PROJECT,
  ESTIMATED_COSTS_PROJECT_OVER_APPROVED,
  STATE_PROJECT
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

const setField = (data) => {
  modelRef.value = JSON.parse(
    JSON.stringify(
      data
        ? data
        : checkStateOverApproved.value
        ? ESTIMATED_COSTS_PROJECT_OVER_APPROVED
        : ESTIMATED_COSTS_PROJECT
    )
  )
}

const handleChangeValue = debounce(() => {
  emit('change', modelRef.value)
}, 500)

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
.estimated-costs {
}
</style>
