<template>
  <div style="display: flex; align-items: center">
    <input
      ref="input"
      v-model="model"
      :type="inputType"
      :placeholder="placeholder"
      min="0"
      max="9"
      maxlength="1"
      pattern="[0-9]"
      :disabled="isDisabled"
      class="otp-input error-input"
      @input="handleOnChange"
      @keydown="handleOnKeyDown"
      @paste="handleOnPaste"
      @focus="handleOnFocus"
      @blur="handleOnBlur"
    />
    <span v-if="!isLastChild && separator">
      <span v-html="separator"></span>
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, type Ref, ref, watch} from 'vue'

export default defineComponent({
  name: 'SingleOtpInput',
  props: {
    inputType: {
      type: String,
      default: 'tel'
    },
    value: {
      type: [String, Number]
    },
    separator: {
      type: String
    },
    focus: {
      type: Boolean
    },
    inputClasses: {
      type: String
    },
    shouldAutoFocus: {
      type: Boolean
    },
    isLastChild: {
      type: Boolean
    },
    placeholder: {
      type: String
    },
    isDisabled: {
      type: Boolean
    }
  },
  emits: ['on-change', 'on-keydown', 'on-paste', 'on-focus', 'on-blur'],
  setup(props, { emit }) {
    const model = ref(props.value || '')
    const input = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>

    const handleOnChange = () => {
      model.value = model.value.toString()
      if (model.value.length > 1) {
        model.value = model.value.slice(0, 1)
      }
      return emit('on-change', model.value)
    }

    const isCodeNumeric = (charCode: number) =>
      (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode === 231

    const handleOnKeyDown = (event: KeyboardEvent) => {
      if (props.isDisabled) {
        event.preventDefault()
      }
      const keyEvent = event || window.event
      const charCode = keyEvent.which ? keyEvent.which : keyEvent.keyCode
      if (isCodeNumeric(charCode) || [8, 9, 13, 37, 39, 46, 86].includes(charCode)) {
        emit('on-keydown', event)
      } else {
        keyEvent.preventDefault()
      }
    }

    const handleOnPaste = (event: KeyboardEvent) => emit('on-paste', event)

    const handleOnFocus = () => {
      input.value.select()
      return emit('on-focus')
    }

    const handleOnBlur = () => emit('on-blur')

    watch(
      () => props.value,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          model.value = newValue
        }
      }
    )
    watch(
      () => props.focus,
      (newFocusValue, oldFocusValue) => {
        if (oldFocusValue !== newFocusValue && input.value && props.focus) {
          input.value.focus()
          input.value.select()
        }
      }
    )

    onMounted(() => {
      if (input.value && props.focus && props.shouldAutoFocus) {
        input.value.focus()
        input.value.select()
      }
    })

    return {
      handleOnChange,
      handleOnKeyDown,
      handleOnPaste,
      handleOnFocus,
      handleOnBlur,
      input,
      model
    }
  }
})
</script>

<style scoped lang="scss">
.otp-input {
  width: 45px;
  height: 45px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
/* .otp-input:disabled {
  cursor: not-allowed;
}
.otp-input:focus {
  background-color: #eee;
} */
</style>
