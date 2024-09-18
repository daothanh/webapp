<template>
  <a-checkbox class="c-checkbox" :class="{ [`size-${size}`]: true }">
    <slot />
  </a-checkbox>
</template>

<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    default: 'normal'
  }
})
</script>

<style lang="scss">
.c-checkbox {
  font-size: 16px !important;
  .ant-checkbox-inner {
    &::after {
    }
  }
  &.size-medium {
    .ant-checkbox-inner {
      width: 24px;
      height: 24px;
      &::after {
        top: 45%;
        left: 28%;
        width: 6.714286px;
        height: 13.142857px;
      }
    }
  }
  .ant-checkbox-inner {
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
  }
  .ant-checkbox-checked {
    &::after {
    }
    .ant-checkbox-inner {
      background: #1890ff !important;
    }
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    height: 2px !important;
    background-color: #fff !important;
  }
  .ant-checkbox {
    transform: translateY(-1px);
  }
}
</style>
