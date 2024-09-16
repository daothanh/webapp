<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 16 17"
    fill="none"
    class="outline-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_4065_45853)">
      <path
        d="M2.79199 4.25H4.04199H14.042"
        stroke="#EE0033"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.792 4.2513V14.168C12.792 14.5437 12.6603 14.904 12.4259 15.1697C12.1915 15.4354 11.8735 15.5846 11.542 15.5846H5.29199C4.96047 15.5846 4.64253 15.4354 4.40811 15.1697C4.17369 14.904 4.04199 14.5437 4.04199 14.168V4.2513M5.91699 4.2513V2.83464C5.91699 2.45891 6.04869 2.09858 6.28311 1.8329C6.51753 1.56722 6.83547 1.41797 7.16699 1.41797H9.66699C9.99851 1.41797 10.3165 1.56722 10.5509 1.8329C10.7853 2.09858 10.917 2.45891 10.917 2.83464V4.2513"
        stroke="#EE0033"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.16699 7.79297V12.043"
        stroke="#EE0033"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.66699 7.79297V12.043"
        stroke="#EE0033"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_4065_45853">
        <rect width="15" height="17" fill="white" transform="translate(0.916992)" />
      </clipPath>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'DeleteIcon',
  props: {
    width: {
      type: Number,
      default: 16
    },
    height: {
      type: Number,
      default: 18
    },
    color: {
      type: String,
      default: '#73777A'
    }
  }
}
</script>

<style scoped></style>
