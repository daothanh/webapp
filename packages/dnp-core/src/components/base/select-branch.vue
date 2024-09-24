<template>
  <c-select
    :value="branchId"
    :placeholder="placeholder"
    allow-clear
    :filter-option="filterSelectOption"
    :field-names="{
      label: 'orgUnitName',
      value: 'orgUnitId'
    }"
    :loading="loadingBranchList"
    :options="differenceBranch"
    show-search
    :on-scroll="handleScrollBranch"
    @deselect="getBranch('')"
    @change="handleChangeBranch"
  />
</template>


<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import _, { debounce } from 'lodash'
import { useSysStore } from "../../stores";

const props = defineProps({
  branchId: {
    type: Number,
    required: true
  },
  orgUnitId: Number | null,
  placeholder: {
    type: String,
    default: 'Chọn nhân viên'
  },
  listOrgUnitType: {
    type: String,
    default: null
  },
  isDisabledSelected: Boolean,
  listCheck: Array
})

const { fetchCompanies } = useSysStore()
const currentPage = ref(0)
const totalPage = ref(0)
const loadingBranchList = ref(false)
const branchList = ref([])

//Disabled những chi nhánh đã được chọn
const differenceBranch = computed(() => {
  return props.isDisabledSelected
    ? _.map(branchList.value, (item) => {
        if (_.find(props.listCheck, { orgUnitId: item.orgUnitId })) {
          return { ...item, disabled: true }
        }
        return item
      })
    : branchList.value
})

const handleSearchBranch = debounce(async (val) => {
  currentPage.value = 0
  totalPage.value = 0
  branchList.value = []
  await getBranch(val)
}, 500)

const handleScrollBranch = async () => {
  if (totalPage.value > currentPage.value) {
    currentPage.value += 1
    await getBranch('')
  }
}

const getBranch = async (val) => {
  loadingBranchList.value = true

  try {
    branchList.value = await fetchCompanies({
      orgUnitId: props.orgUnitId,
      listOrgUnitType: props.listOrgUnitType,
      getParent: false,
      keyword: val
    })

    /*if (res.message === 'SUCCESS') {
      totalPage.value = res.body?.page_meta?.total_pages || 0
      branchList.value = res.body || []
    }*/
  } finally {
    loadingBranchList.value = false
  }
}

const emit = defineEmits(['update:branchId', 'change'])

const handleChangeBranch = (value) => {
  emit('update:branchId', value)
  emit('change', value)
}

watch(
  () => props.orgUnitId,
  () => {
    if (props.orgUnitId) {
      branchList.value = []
      currentPage.value = 0
      getBranch()
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss"></style>
