<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" />
</template>

<script setup>
const columns = [
  {
    title: 'Đồng hồ tổng',
    dataIndex: 'masterClock',
    key: 'masterClock'
  },
  {
    title: 'Áp lực tức thời',
    dataIndex: 'instantPressure',
    key: 'instantPressure'
  },
  {
    title: 'Lưu lượng tức thời',
    dataIndex: 'realTimeTraffic',
    key: 'realTimeTraffic'
  },
  {
    title: 'Thời gian cập nhật',
    key: 'updatedTime',
    dataIndex: 'updatedTime'
  },
  {
    title: 'Hành động',
    key: 'action'
  }
]

const data = [
  {
    key: '1',
    instantPressure: 'Đồng hồ tổng',
    age: 32,
    masterClock: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    instantPressure: 'Áp lực tức thời',
    age: 42,
    masterClock: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    instantPressure: 'Lưu lượng thức thời',
    age: 32,
    masterClock: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]
</script>

<style scoped></style>
