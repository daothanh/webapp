<template>
  <span class="price-format">{{ formatedValue }}</span>
</template>

<script>
export default {
  name: 'FormatPrice',
  props: ['value'],
  computed: {
    formatedValue() {
      return this.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style lang="scss" scoped>
.price-format {
}
</style>
