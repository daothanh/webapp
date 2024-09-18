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

<script>
import { size } from 'lodash'

export default {
  name: 'InputNumber',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    isDecimalNumber: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleKeyDown(evt) {
      const regexISDecimalNumber = /^[0-9.]+$/
      const validKey = ['Backspace', 'Delete', 'KeyV', 'KeyX', 'KeyC', 'KeyA']
      if (
        (!(validKey.includes(evt.code) && evt.ctrlKey) &&
          !regexISDecimalNumber.test(evt.key) &&
          !validKey.includes(evt.key)) ||
        (evt.target.value.includes('.') && evt.key === '.') ||
        (!this.isDecimalNumber && evt.key === '.') ||
        (size(evt.target.value) === 0 && evt.key === '.')
      ) {
        evt.preventDefault()
      }
    }
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
