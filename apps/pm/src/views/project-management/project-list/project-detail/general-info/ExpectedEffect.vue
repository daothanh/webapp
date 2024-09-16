<template>
  <div class="expected-effect">
    <div class="header">Hiệu quả dự kiến</div>

    <div class="container px-2">
      <div class="field" v-for="(m, index) in modelRef" :key="index">
        <div class="flex justify-between mt-[10px] mb-[5px]">
          <div class="label">{{ m.key }}</div>
          <div class="content" v-if="m.value != null">
            <i-number
              v-model="m.value"
              number-only
              noBorder
              justify="end"
              :readonly="isView"
              placeholder="....."
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              @input-change="handleChangeValue"
            />
            <div class="unit" v-if="m.unit">{{ m.unit }}</div>
          </div>
        </div>
        <div
          class="child flex justify-between"
          v-for="(c, i) in m.children"
          :key="i"
          v-if="m.children"
        >
          <div class="label-c" :class="{ 'font-[600]': c.color }" :style="{ color: c.color }">
            {{ c.key }}
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
              @input-change="handleChangeValue"
            />
            <div class="unit" v-if="c.unit">{{ c.unit }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExpectedEffect'
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { EXPECT_EFFECTIVE_PROJECT } from '@/configs'
import { debounce } from 'lodash'
import {INumber} from 'ui'

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
const emit = defineEmits(['change'])

const modelRef = ref([])

const setField = (data) => {
  modelRef.value = JSON.parse(JSON.stringify(data || EXPECT_EFFECTIVE_PROJECT))
}

const handleChangeValue = debounce(() => {
  emit('change', { expectEffective: modelRef.value })
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
.expected-effect {
  input,
  .c-input {
    flex: 1;
    height: 20px;
    min-height: 20px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
  }
  .header {
    padding: 8px;
    font-weight: 600;
    font-size: 16px;
  }
  .container {
    .label {
      text-wrap: nowrap;
      color: rgba(5, 66, 140, 0.7);
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
    }
    .label-c {
      width: 50%;
      text-align: end;
      font-size: 13px;
      text-wrap: nowrap;
    }
    .content {
      width: 50%;
      display: flex;
      .c-input__wrapper {
        flex: 1;
      }
      .unit {
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
}
</style>
