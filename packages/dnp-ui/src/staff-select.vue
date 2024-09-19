<template>
  <component
    :is="isDropDown ? 'c-dropdown' : 'c-select'"
    :value="
      isDropDown
        ? staffIds || []
        : staffId || (showAll && staffList.length > 0 ? staffList[0]?.value : null)
    "
    :placeholder="placeholder"
    allow-clear
    :filter-option="false"
    :field-names="{
      label: 'staffCode',
      value: 'staffId'
    }"
    :loading="loadingStaffList"
    :options="
      isDropDown && showAll
        ? [{ key: null, title: 'Tất cả', code: 'Tất cả' }, ...staffList]
        : staffList
    "
    is-search-by-api
    show-search
    :on-scroll="handleScrollStaff"
    @search="handleSearchStaff"
    @change="handleChangeStaff"
  />
</template>

<script>
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useUtils } from "dnp-core";
import { staffServices } from '@/apis/staff'

const props = defineProps({
  staffId: {
    type: [String, Number, null],
    required: true
  },
  staffIds: {
    type: Array,
    default: () => []
  },
  orgUnitId: {
    type: [String, Number],
    required: false,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Chọn nhân viên'
  },
  roles: {
    type: Array,
    default: () => []
  },
  isDropDown: {
    type: Boolean,
    default: false
  },
  isCrmSystem: {
    type: Boolean,
    default: false
  },
  showAll: {
    type: Boolean,
    default: false
  },
  isCheckRoleTechnician: {
    type: Boolean,
    default: false
  }
})

const { isEmptyObject } = useUtils()
const currentPage = ref(0)
const totalPage = ref(0)
const loadingStaffList = ref(false)
const staffList = ref([])

const handleSearchStaff = debounce((val) => {
  currentPage.value = 0
  totalPage.value = 0
  staffList.value = []
  getStaff(val)
}, 500)

const handleScrollStaff = () => {
  if (totalPage.value > currentPage.value) {
    currentPage.value += 1
    getStaff()
  }
}

const getStaff = async (val) => {
  if (!props.orgUnitId) {
    return
  }
  loadingStaffList.value = true
  try {
    const res = await staffServices.search({
      example: {
        keyword: val,
        orgUnitId: props.orgUnitId,
        sortSpecialId: props.isDropDown
          ? props.staffIds?.filter((s) => s)
          : props.staffId
          ? [props.staffId]
          : null
      },
      pageInfo: { pageSize: 20, currentPage: currentPage.value }
    })

    if (res.message === 'SUCCESS') {
      totalPage.value = res.body?.totalPage || 0

      const result = res.body?.result?.map((r) => ({
        ...r,
        key: r.staffId,
        staffCode: [r.staffCode, r.staffName].filter((s) => s).join(' - '),
        title: [r.staffCode, r.staffName].filter((s) => s).join(' - '),
        value: r.staffId
      }))

      if (!val) {
        staffList.value = [...staffList.value, ...result]

        if (props.staffId) {
          const objStaffId = staffList.value?.find((item) => item.staffId === props.staffId) || {}

          if (isEmptyObject(objStaffId)) {
            handleScrollStaff()
          }
        }
      } else {
        staffList.value = result || []
      }
    }
  } finally {
    loadingStaffList.value = false
  }
}

const emit = defineEmits(['update:staffId', 'change'])

const handleChangeStaff = (value) => {
  if (typeof value !== 'object' || value === null || !('target' in value)) {
    emit('update:staffId', value)
    emit('update:staffIds', value)
    emit('change', value)
  }
}

watch(
  [() => props.orgUnitId, () => props.staffId, () => props.isCrmSystem],
  () => {
    staffList.value = []
    currentPage.value = 0
    getStaff()
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss"></style>
