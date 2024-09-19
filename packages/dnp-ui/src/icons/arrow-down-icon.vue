<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    class="outline-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.0101 9.70181L11.9997 15.7122L5.98926 9.70181L7.40347 8.2876L11.9997 12.8838L16.5959 8.2876L18.0101 9.70181Z"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    default: 20
  },
  height: {
    type: Number,
    default: 20
  },
  color: {
    type: String,
    default: '#44494D'
  }
})
</script>
