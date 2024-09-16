<template>
  <c-input
    :value="value"
    :placeholder="placeholder"
    :type="`${name === 'lat' || name === 'lng' ? 'number' : 'text'}`"
    :class="[classValue, { error: error }, 'map-layer-input transition-all']"
    @input="handleInput"
    @keydown="handleKeyDown"
  />
</template>

<script lang="ts">
export default {
  name: 'MapLayerInforInput'
}
</script>

<script lang="ts" setup>
const props = defineProps<{
  value: string
  classValue: string
  error: boolean
  placeholder: string
  name: string
}>()

const emit = defineEmits(['input'])

const handleInput = (e) => {
  emit('input', e.target.value)
}

const handleKeyDown = (e) => {
  if ((props.name === 'lat' || props.name === 'lng') && e.key === '-') {
    e.preventDefault()
  }
}
</script>

<style lang="scss">
.map-layer-input {
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
