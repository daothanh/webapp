<template>
  <a-button :type="type" v-bind="$attrs">
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </a-button>
</template>

<script>
export default {
  name: 'ButtonCustom',
  props: {
    type: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
