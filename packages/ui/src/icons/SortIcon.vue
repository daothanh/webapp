<template>
  <svg
    :width="20"
    :height="height"
    viewBox="0 0 20 18"
    fill="none"
    class="outline-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 9L3 1" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <path d="M17 17L17 15" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <path d="M3 17L3 13" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <path d="M17 9L17 1" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <path d="M10 4L10 1" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <path d="M10 17L10 9" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <circle cx="3" cy="11" r="2" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <circle cx="10" cy="6" r="2" :stroke="color" stroke-width="2" stroke-linecap="round" />
    <circle cx="17" cy="12" r="2" :stroke="color" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>

<script>
export default {
  name: 'SortIcon',
  props: {
    width: {
      type: Number,
      default: 15
    },
    height: {
      type: Number,
      default: 15
    },
    color: {
      type: String,
      default: '#000000'
    }
  }
}
</script>
