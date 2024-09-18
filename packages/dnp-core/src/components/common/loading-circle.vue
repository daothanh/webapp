<template>
  <a-spin :indicator="indicator" />
</template>
<script lang="ts" setup>
import {computed, h} from "vue";
import {LoadingOutlined} from "@ant-design/icons-vue";

const indicator = computed(() => {
  return h(LoadingOutlined, {
    style: {
      fontSize: '18px'
    },
    spin: true
  })
})
</script>
