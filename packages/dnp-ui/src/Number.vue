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

<script>
import { debounce, size, trim } from 'lodash'
import common from '@/utils/common'

export default {
  name: 'INumber',
  components: {},
  props: {
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
  },
  data() {
    return {
      isFocus: false
    }
  },
  computed: {
    isShowIcon() {
      return (
        this.iconType &&
        this.iconType !== '' &&
        this.iconType !== null &&
        this.iconType !== undefined
      )
    },
    icon() {
      return `${this.iconType}-icon`
    },
    justifyClass() {
      return `text-${this.justify}`
    },
    inputValue() {
      return this.formatter && !this.modelValue?.toString().includes('.')
        ? this.formatter(this.modelValue)
        : this.modelValue
    },
    inputTitle() {
      return this.hasError ? this.outerErrorMessage || this.innerErrorMessage : this.inputValue
    },
    hasError() {
      return this.hasInnerError || this.hasOuterError || this.hasSelectError
    },
    hasSelectError() {
      return size(this.errorMessage) > 0
    },
    hasInnerError() {
      return size(this.innerErrorMessage) > 0 && this.isFocus === false
    },
    hasOuterError() {
      return size(this.outerErrorMessage) > 0
    },
    inputPlaceHolder() {
      return this.hasInnerError || this.hasSelectError ? '' : this.placeholder
    }
  },
  created() {
    this.debounceChangeInput = debounce(this.debounceChangeInput, 800)
  },
  methods: {
    onFocus() {
      this.isFocus = true
      this.$emit('onFocus')
    },
    onClick() {
      this.isFocus = true
      this.$emit('onClick', this.modelValue)
    },
    onBlur() {
      this.isFocus = false
      this.$emit('onBlur')
    },
    onChangeInputValue(e) {
      let isUpdate = true
      let inputValue = e.target.value

      if (this.parser) {
        inputValue = this.parser(inputValue)
      }
      if (size(trim(inputValue)) > 0 && this.numberOnly && !common.isNumeric(inputValue)) {
        inputValue = this.modelValue
        if (this.$refs.input) {
          this.$refs.input.value = inputValue || ''
          isUpdate = false
        }
      }
      if (isUpdate === true && !/\s/g.test(inputValue)) {
        const formatValue = inputValue ? parseFloat(inputValue).toString() : ''
        const convertValue = this.autoFormat ? formatValue : inputValue

        this.$emit('update:modelValue', convertValue)
        this.debounceChangeInput(convertValue)
      }
    },
    debounceChangeInput(value) {
      this.$emit('input-change', value)
    }
  }
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
