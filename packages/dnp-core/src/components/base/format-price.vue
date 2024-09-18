<template>
  <span class="price-format">{{ formatedValue }}</span>
</template>
<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps({
  value: {
    type: [String , Number , null]
  }
})
const formatedValue = computed(() => props.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
</script>

<style lang="scss" scoped>
.price-format {
}
</style>
