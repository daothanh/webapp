<template>
  <div style="display: flex">
    <input
      v-if="inputType === 'password'"
      autocomplete="off"
      name="hidden"
      type="text"
      style="display: none"
    />
    <single-otp-input
      v-for="(item, i) in numInputs"
      :key="i"
      :focus="activeInput === i"
      :value="otp[i]"
      :separator="separator"
      :input-type="inputType"
      :input-classes="inputClasses"
      :is-last-child="i === numInputs - 1"
      :should-auto-focus="shouldAutoFocus"
      :placeholder="placeholder && placeholder.length ? placeholder[i] : ''"
      :is-disabled="isDisabled"
      @on-change="handleOnChange"
      @on-keydown="handleOnKeyDown"
      @on-paste="handleOnPaste"
      @on-focus="handleOnFocus(i)"
      @on-blur="handleOnBlur"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

// keyCode constants
const BACKSPACE = 8
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const DELETE = 46

export default defineComponent({
  name: 'OtpInput',
  props: {
    numInputs: {
      default: 4
    },
    separator: {
      type: String,
      default: '**'
    },
    inputClasses: {
      type: String
    },
    inputType: {
      type: String,
      validator: (value: string) => ['number', 'tel', 'password'].includes(value)
    },
    shouldAutoFocus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: Array,
      default: [] | null
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const activeInput = ref<number>(0)
    const otp = ref<[]>([])
    const oldOtp = ref<[]>([])

    const handleOnFocus = (index: number) => {
      activeInput.value = index
    }
    const handleOnBlur = () => {
      activeInput.value = -1
    }

    const checkFilledAllInputs = () => {
      if (otp.value.join('').length === props.numInputs) {
        return emit('on-complete', otp.value.join(''))
      }
      return 'Wait until the user enters the required number of characters'
    }

    const focusInput = (input: number) => {
      activeInput.value = Math.max(Math.min(props.numInputs - 1, input), 0)
    }
    const focusNextInput = () => {
      focusInput(activeInput.value + 1)
    }
    const focusPrevInput = () => {
      focusInput(activeInput.value - 1)
    }

    const changeCodeAtFocus = (value: number | string) => {
      oldOtp.value = Object.assign([], otp.value)
      otp.value[activeInput.value] = value

      if (oldOtp.value.join('') !== otp.value.join('')) {
        emit('on-change', otp.value.join(''))
        checkFilledAllInputs()
      }
    }

    const handleOnPaste = (event: any) => {
      event.preventDefault()
      const pastedData = event.clipboardData
        .getData('text/plain')
        .slice(0, props.numInputs - activeInput.value)
        .split('')
      if (props.inputType === 'number' && !pastedData.join('').match(/^\d+$/)) {
        return 'Invalid pasted data'
      }
      const currentCharsInOtp = otp.value.slice(0, activeInput.value)
      const combinedWithPastedData = currentCharsInOtp.concat(pastedData)

      combinedWithPastedData.slice(0, props.numInputs).forEach(function (value, i) {
        otp.value[i] = value
      })
      focusInput(combinedWithPastedData.slice(0, props.numInputs).length)
      return checkFilledAllInputs()
    }

    const handleOnChange = (value: number) => {
      changeCodeAtFocus(value)
      focusNextInput()
    }
    const clearInput = () => {
      if (otp.value.length > 0) {
        emit('on-change', '')
      }
      otp.value = []
      activeInput.value = 0
    }

    const handleOnKeyDown = (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case BACKSPACE:
          event.preventDefault()
          changeCodeAtFocus('')
          focusPrevInput()
          break
        case DELETE:
          event.preventDefault()
          changeCodeAtFocus('')
          break
        case LEFT_ARROW:
          event.preventDefault()
          focusPrevInput()
          break
        case RIGHT_ARROW:
          event.preventDefault()
          focusNextInput()
          break
        default:
          break
      }
    }

    return {
      activeInput,
      otp,
      oldOtp,
      clearInput,
      handleOnPaste,
      handleOnKeyDown,
      handleOnBlur,
      changeCodeAtFocus,
      focusInput,
      focusNextInput,
      focusPrevInput,
      handleOnFocus,
      checkFilledAllInputs,
      handleOnChange
    }
  }
})
</script>

<style lang="scss" scoped></style>
