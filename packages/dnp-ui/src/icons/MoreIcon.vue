<template>
  <svg width="15" height="15" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      :fill="color"
      fill-rule="evenodd"
      d="M2.5 7.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m15 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5m-7.274 0a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
    />
  </svg>
</template>

<script>
export default {
  name: 'MoreIcon',
  props: {
    width: {
      type: Number,
      default: 6
    },
    height: {
      type: Number,
      default: 6
    },
    color: {
      type: String,
      default: '#999'
    }
  }
}
</script>

<style scoped></style>
