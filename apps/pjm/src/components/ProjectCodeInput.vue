<template>
  <a-input
    v-model:value="code"
    v-bind="$attrs"
    :placeholder="placeholder"
    step="any"
    @change="onChange"
  >
    <template #prefix> {{ orgUnitCode || 'MãĐV' }}- </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </a-input>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
const model = defineModel({ type: String, default: '' })
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  orgUnitCode: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue'])

const code = ref('')

const onChange = () => {
  emits('update:modelValue', code.value ? props.orgUnitCode + '-' + code.value : '')
}
watch(props.orgUnitCode, (newOrgUnitCode) => {
  emits('update:modelValue', code.value ? newOrgUnitCode + '-' + code.value : '')
})
watchEffect(() => {
  const regx = new RegExp('^([A-Z]+)-')
  if (regx.test(model.value)) {
    const regx = new RegExp('^([A-Z]+)-')
    code.value = model.value.replace(regx, '')
  } else {
    code.value = model.value
  }
})
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
