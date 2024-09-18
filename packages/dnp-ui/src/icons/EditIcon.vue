<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 15 17"
    class="outline-none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.542 2.12586C10.7061 1.93983 10.901 1.79225 11.1155 1.69157C11.33 1.59088 11.5598 1.53906 11.792 1.53906C12.0241 1.53906 12.254 1.59088 12.4685 1.69157C12.683 1.79225 12.8778 1.93983 13.042 2.12586C13.2061 2.3119 13.3364 2.53277 13.4252 2.77584C13.514 3.01891 13.5598 3.27943 13.5598 3.54253C13.5598 3.80563 13.514 4.06615 13.4252 4.30923C13.3364 4.5523 13.2061 4.77316 13.042 4.9592L4.60449 14.5217L1.16699 15.5842L2.10449 11.6884L10.542 2.12586Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'EditIcon',
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
    }
  }
}
</script>

<style scoped></style>
