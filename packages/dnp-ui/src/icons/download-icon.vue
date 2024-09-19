<template>
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="cursor-pointer outline-none"
  >
    <g clip-path="url(#clip0_107_40883)">
      <path
        d="M9.63342 7.5H8.37467V3.33333C8.37467 2.875 8.01842 2.5 7.58301 2.5H4.41634C3.98092 2.5 3.62467 2.875 3.62467 3.33333V7.5H2.36592C1.66134 7.5 1.30509 8.4 1.80384 8.925L5.43759 12.75C5.74634 13.075 6.24509 13.075 6.55384 12.75L10.1876 8.925C10.6863 8.4 10.338 7.5 9.63342 7.5ZM0.458008 15.8333C0.458008 16.2917 0.814258 16.6667 1.24967 16.6667H10.7497C11.1851 16.6667 11.5413 16.2917 11.5413 15.8333C11.5413 15.375 11.1851 15 10.7497 15H1.24967C0.814258 15 0.458008 15.375 0.458008 15.8333Z"
        fill="#44494D"
      />
    </g>
    <defs>
      <clipPath id="clip0_107_40883">
        <rect width="15.2812" height="17" fill="white" transform="translate(0.625)" />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
defineProps({
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
})
</script>
