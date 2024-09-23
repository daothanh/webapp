<template>
  <div class="c-input__wrapper">
    <input
      :id="inputId"
      ref="input"
      :type="valueType"
      :size="inputPlaceHolder.length || 22"
      :class="[
        'c-input',
        justifyClass,
        inputClass,
        {
          'cursor-not-allowed': readonly,
          'c-input--borderless': borderless,
          'c-input--noBorder': noBorder,
          'c-input--hasError': hasError
        }
      ]"
      :disabled="disabled"
      :readonly="readonly"
      :value="inputValue"
      :title="inputTitle"
      :placeholder="inputPlaceHolder"
      :autocomplete="autocomplete"
      @input="onChangeInputValue"
      @focus="onFocus"
      @blur="onBlur"
      @click="onClick"
    />
    <div v-if="hasSuffix" class="c-input-suffix">
      <slot name="suffix"> </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { size, trim } from 'lodash'
import {computed, ref} from "vue";
import { useUtils } from "../composable";

const props = defineProps({
  modelValue: [String, Number],
  iconType: String,
  placeholder: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'on'
  },
  inputId: String,
  inputClass: {
    type: [String, Object, Array]
  },

  justify: {
    type: String,
    default: 'left'
  },
  borderless: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  noBorder: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  numberOnly: {
    type: Boolean,
    default: false
  },
  autoFormat: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: Function
  },
  parser: {
    type: Function
  },
  errorMessage: {
    type: String,
    default: ''
  },
  innerErrorMessage: {
    type: String,
    default: ''
  },
  outerErrorMessage: {
    type: String,
    default: ''
  },
  hasValueType: {
    type: Boolean,
    default: false
  },
  valueType: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 0
  },
  hasSuffix: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['onFocus', 'onClick', 'onBlur', 'update:modelValue', 'input-change'])
const input = ref()
const { isNumeric } = useUtils()
const isFocus = ref(false)
const isShowIcon = computed(() => {
  return (
      props.iconType &&
      props.iconType !== '' &&
      props.iconType !== null &&
      props.iconType !== undefined
  )
})
const icon = computed(() => {
  return `${props.iconType}-icon`
})
const justifyClass = computed(() => {
  return `text-${props.justify}`
})
const inputValue = computed(() => {
  return props.formatter && !props.modelValue?.toString().includes('.')
      ? props.formatter(props.modelValue)
      : props.modelValue
})
const inputTitle = computed(() => {
  return hasError.value ? props.outerErrorMessage || props.innerErrorMessage : inputValue.value
})
const hasError = computed(() => {
  return hasInnerError.value || hasOuterError.value || hasSelectError.value
})
const hasSelectError = computed(() => {
  return size(props.errorMessage) > 0
})
const hasInnerError = computed(() => {
  return size(props.innerErrorMessage) > 0 && isFocus.value === false
})
const hasOuterError = computed(() => {
  return size(props.outerErrorMessage) > 0
})
const inputPlaceHolder = computed(() => {
  return hasInnerError.value || hasSelectError.value ? '' : props.placeholder
})

const onFocus = () => {
  isFocus.value = true
  emits('onFocus')
}
const onClick = () => {
  isFocus.value = true
  emits('onClick', props.modelValue)
}
const onBlur = () => {
  isFocus.value = false
  emits('onBlur')
}
const onChangeInputValue = (e) => {
  let isUpdate = true
  let inputValue = e.target.value

  if (props.parser) {
    inputValue = props.parser(inputValue)
  }
  if (size(trim(inputValue)) > 0 && props.numberOnly && !isNumeric(inputValue)) {
    inputValue = props.modelValue
    if (input.value) {
      input.value.value = inputValue || ''
      isUpdate = false
    }
  }
  if (isUpdate && !/\s/g.test(inputValue)) {
    const formatValue = inputValue ? parseFloat(inputValue).toString() : ''
    const convertValue = props.autoFormat ? formatValue : inputValue

    emits('update:modelValue', convertValue)
    debounceChangeInput(convertValue)
  }
}
const debounceChangeInput = (value: string) => {
  emits('input-change', value)
}
</script>

<style lang="scss" scoped>
$border-default: #d9d9d9;
$border-error: #eb5757;
.c-input__wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  input {
    padding: 0 7px;
    width: 100%;
    border-radius: 2px;
    background: transparent;
    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }
    &:disabled {
      background: #f5f5f5;
    }
  }
  .c-input-icon__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1em;
  }
  .hasError {
    position: absolute;
    font-size: 16px;
  }
  .outerError {
    font-size: 16px;
    text-align: left;
  }
  .c-input-suffix {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .c-input {
    border: 1px solid #d9d9d9 !important;
    transition: 0.3s !important;
    min-height: 32px;
    &--borderless {
      border: none;
      border-bottom: 1px solid $border-default;
    }

    &--noBorder {
      border-radius: 0;
      border: none !important;
      border-bottom-width: 0;
    }

    &--annotation {
      padding-right: 23px;
    }
    &--hasSuffix {
      padding-right: 70px;
    }
    &--hasError {
      border-color: $border-error;
    }

    &:focus-visible {
      outline: none;
    }
  }
}
.outer-enter-active,
.outer-leave-active {
  transition: opacity 0.15s;
}
.outer-enter, .outer-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.text-right {
  text-align: right;
}
</style>
