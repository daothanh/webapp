<template>
  <div class="budget-exp">
    <div class="header">Ngân sách - chi phí</div>

    <div class="container px-2">
      <div class="field" v-for="(m, index) in modelRef" :key="index">
        <div class="flex justify-between mt-[10px] mb-[5px]">
          <div class="label flex justify-end">
            <div
              class="btn-add mr-[5px]"
              v-if="m.listYear && !isView"
              @click="handleAddField(index)"
            >
              <a-tooltip title="Thêm năm">
                <PlusCircleOutlined :style="{ color: '#1999e2' }" />
              </a-tooltip>
            </div>
            {{ m.key }} :
          </div>
          <div class="content" v-if="m.value != null">
            <i-number
              v-model="m.value"
              number-only
              noBorder
              justify="end"
              :readonly="isView || m.listYear?.length"
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
          v-for="(y, j) in m.listYear"
          :key="j"
          v-if="m.listYear"
        >
          <div
            class="label-c flex justify-end"
            :class="{ 'font-[600]': y.color }"
            :style="{ color: y.color }"
          >
            <div class="btn-remove mr-[5px]" v-if="!isView" @click="handleRemoveField(index, j)">
              <a-tooltip title="Xoá năm">
                <CloseCircleOutlined :style="{ color: 'red' }" />
              </a-tooltip>
            </div>
            <span>{{ y.key }}</span>
            <i-number
              v-model="y.year"
              number-only
              noBorder
              justify="end"
              :readonly="isView || y.noEdit"
              placeholder="....."
              @input-change="handleChangeValue"
            />
            <span class="ml-[2px]"> :</span>
          </div>
          <div class="content" v-if="y.value != null">
            <i-number
              class="text-end"
              v-model="y.value"
              number-only
              justify="end"
              noBorder
              :readonly="isView || y.noEdit"
              placeholder="....."
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              @input-change="
                () => {
                  handleChangeValueYear(index)
                }
              "
            />
            <div class="unit" v-if="y.unit">{{ y.unit }}</div>
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
              :readonly="isView || c.noEdit"
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
  name: 'BudgetExp'
}
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { BUDGET_EXP_PROJECT } from '@/configs'
import { debounce } from 'lodash'
import {INumber} from 'ui'
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import { message } from 'ant-design-vue'

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
  modelRef.value = JSON.parse(JSON.stringify(data || BUDGET_EXP_PROJECT))
}

const handleAddField = (index) => {
  if (modelRef.value?.[index]?.listYear?.length <= 10) {
    modelRef.value?.[index]?.listYear.push({
      key: 'Năm',
      year: '',
      value: '',
      unit: 'đ'
    })
  } else {
    message.error('Giới hạn thêm chỉ 10 năm')
  }
}

const handleRemoveField = (indexP, indexC) => {
  modelRef.value?.[indexP]?.listYear.splice(indexC, 1)
  handleChangeValueYear(indexP)
}

const handleChangeValueYear = (index) => {
  modelRef.value[index].value = _.sumBy(modelRef.value?.[index]?.listYear, (item) =>
    Number(Number(item.value) ? item.value : 0)
  )
  handleChangeValue()
}

const handleChangeValue = debounce(() => {
  emit('change', { budgetExp: modelRef.value })
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
.budget-exp {
  input,
  .c-input {
    flex: 1;
    height: 20px;
    min-height: 20px !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  }
  .header {
    padding: 8px;
    font-weight: 600;
    font-size: 15px;
  }
  .container {
    .label {
      text-wrap: nowrap;
      font-size: 14px;
      font-style: normal;
      width: 70%;
      text-align: end;
      .btn-add {
        cursor: pointer;
      }
    }
    .label-c {
      width: 70%;
      text-align: end;
      font-size: 13px;
      text-wrap: nowrap;
      .c-input__wrapper {
        width: 32px;
        input {
          padding: 0;
          font-weight: 500 !important;
        }
      }
    }
    .content {
      width: 30%;
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
