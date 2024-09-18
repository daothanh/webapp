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
      d="M10.25 7.25H14.375L10.25 3.125V7.25ZM5 2H11L15.5 6.5V15.5C15.5 15.8978 15.342 16.2794 15.0607 16.5607C14.7794 16.842 14.3978 17 14 17H5C4.60218 17 4.22064 16.842 3.93934 16.5607C3.65804 16.2794 3.5 15.8978 3.5 15.5V3.5C3.5 2.6675 4.1675 2 5 2ZM5.75 15.5H7.25V11H5.75V15.5ZM8.75 15.5H10.25V9.5H8.75V15.5ZM11.75 15.5H13.25V12.5H11.75V15.5Z"
      fill="#44494D"
    />
  </svg>
</template>

<script>
export default {
  name: 'FileIcon',
  props: {
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
}
</script>

<style scoped></style>
