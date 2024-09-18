<template>
  <a-input v-bind="$attrs" :placeholder="placeholder" step="any" @keydown="handleKeyDown">
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </a-input>
</template>
<script lang="ts" setup>
import {size} from "lodash";

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  isDecimalNumber: {
    type: Boolean,
    default: false
  }
})
const handleKeyDown = (evt) => {
  const regexISDecimalNumber = /^[0-9.]+$/
  const validKey = ['Backspace', 'Delete', 'KeyV', 'KeyX', 'KeyC', 'KeyA']
  if (
      (!(validKey.includes(evt.code) && evt.ctrlKey) &&
          !regexISDecimalNumber.test(evt.key) &&
          !validKey.includes(evt.key)) ||
      (evt.target.value.includes('.') && evt.key === '.') ||
      (!props.isDecimalNumber && evt.key === '.') ||
      (size(evt.target.value) === 0 && evt.key === '.')
  ) {
    evt.preventDefault()
  }
}
</script>

<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
