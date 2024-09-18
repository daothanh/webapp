<template>
  <svg
    class="h-5 w-5 text-gray-400 hover:text-gray-900 cursor-pointer"
    :class="{ '!text-gray-300  !cursor-default': disabled }"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script>
export default {
  name: 'PrevIcon',
  props: {
    width: {
      type: Number,
      default: 16
    },
    height: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: '#4196F0'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
