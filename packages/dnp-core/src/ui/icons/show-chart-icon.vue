<template>
  <svg
    class="outline-none"
    :width="width"
    :height="height"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.1379 5.6375L14.2179 6.7175L10.5579 10.3775L8.09035 7.91C7.79785 7.6175 7.32535 7.6175 7.03285 7.91L2.53285 12.4175C2.24035 12.71 2.24035 13.1825 2.53285 13.475C2.82535 13.7675 3.29785 13.7675 3.59035 13.475L7.55785 9.5L10.0254 11.9675C10.3179 12.26 10.7904 12.26 11.0829 11.9675L15.2754 7.7825L16.3554 8.8625C16.5879 9.095 16.9929 8.93 16.9929 8.6V5.375C17.0004 5.165 16.8354 5 16.6254 5H13.4079C13.0704 5 12.9054 5.405 13.1379 5.6375Z"
      fill="#52C41A"
    />
  </svg>
</template>

<script lang="ts" setup>
defineProps( {
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
  }
)
</script>

<style scoped></style>
