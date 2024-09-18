<template>
  <a-button :type="type" v-bind="$attrs">
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </a-button>
</template>

<script lang="ts" setup>
defineProps({
  type: {
    type: String,
    default: ''
  }
})
</script>

<style scoped></style>
