<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading">
    <template #emptyText>
      <a-empty :description="'Không có dữ liệu'" />
    </template>
  </a-table>
</template>

<script setup>
import { ref, watch } from 'vue'
import moment from 'moment'

const columns = [
  {
    title: 'Sensor',
    dataIndex: 'sensor',
    key: 'sensor'
  },
  {
    title: 'Áp lực',
    dataIndex: 'pressure',
    key: 'pressure'
  },
  {
    title: 'Thời gian cập nhật',
    dataIndex: 'updatedTime',
    key: 'updatedTime'
  },
  {
    title: 'Hành động',
    key: 'action'
  }
]

const dataTable = ref([])
const loading = ref(false)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

watch(
  () => props.data,
  (dataValue, oldValue) => {
    let tempData = []
    loading.value = true
    if (dataValue.sensorList) {
      dataValue.data.forEach((item, index) => {
        const updatedTime = item?.data?.mH2O
          ? moment(item.data.mH2O[0][0]).format('DD-MM-YYYY HH:mm:ss')
          : ''
        tempData.push({
          sensor: dataValue.sensorList[index].Sensor,
          pressure: item?.data?.mH2O ? `${item.data.mH2O[0][1]}m` : '',
          updatedTime
        })
      })

      dataTable.value = tempData
      loading.value = false
    }
  },
  {
    deep: true
  }
)
</script>

<style scoped></style>
