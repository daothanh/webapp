<template>
  <a-input
    :value="value"
    :placeholder="placeholder"
    :type="type"
    :class="[classValue, { error: error }, 'validation-input transition-all']"
    @input="handleInput"
    @keydown="handleKeyDown"
  />
</template>

<script lang="ts">
export default {
  name: 'ValidationInput'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  value: string | Null
  classValue: string
  error: boolean
  placeholder: string
  name: string
  type: string
}>()

const emit = defineEmits(['handleInput'])
const dotEntered = ref(false)

const handleInput = (e) => {
  emit('handleInput', e.target.value)
}

const handleKeyDown = (evt) => {
  if (
    props.type === 'number' &&
    evt.code !== 'KeyV' &&
    evt.code !== 'KeyC' &&
    evt.code !== 'KeyA' &&
    evt.code !== 'KeyX' &&
    evt.which !== 8 &&
    evt.which !== 0 &&
    evt.which !== 46 &&
    evt.which !== 190 &&
    (evt.which < 48 || evt.which > 57)
  ) {
    evt.preventDefault()
  } else if (evt.which === 46 || evt.which === 190) {
    if (!dotEntered.value) {
      dotEntered.value = true
    } else {
      evt.preventDefault()
    }
  } else if (evt.which === 32 && props.name === 'code') {
    evt.preventDefault()
  }
  if (!evt.target.value) {
    dotEntered.value = false
  }
}
</script>

<style lang="scss">
.validation-input {
  padding: 10px;
  border: none;
  &:focus {
    background: white;
  }
}
.error {
  border: 1px solid red;
  &:focus {
    border: 1px solid red;
    box-shadow: none;
  }
  &:hover {
    border: 1px solid red;
  }
}
</style>
