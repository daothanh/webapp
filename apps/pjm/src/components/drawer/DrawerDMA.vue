<template>
  <a-drawer :width="800" title="Dữ liệu DMA" placement="right" :visible="visible" @close="onClose">
    <!--    <template #extra>-->
    <!--      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>-->
    <!--      <a-button type="primary" @click="onClose">Submit</a-button>-->
    <!--    </template>-->

    <header class="font-bold mb-4">Tên DMA: {{ data.title }}</header>

    <div class="flex flex-col gap-y-6">
      <!--            <ClockTable/>-->
      <SensorTable :data="senserTableData" />
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import ClockTable from '../table/ClockTable.vue'

import SensorTable from '../table/SensorTable.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['changeVisibleDrawer'])

const visibleValue = ref(false)

const dataDMA = ref({})

const senserTableData = ref({})

watch(
  () => props.visible,
  () => {
    visibleValue.value = props.visible
    dataDMA.value = props.data
    senserTableData.value = { sensorList: props.data.sensorList, data: props.data.data }
  },
  { deep: true, immediate: true }
)
const onClose = () => {
  visibleValue.value = false
  emits('changeVisibleDrawer')
}
</script>

<style scoped></style>
