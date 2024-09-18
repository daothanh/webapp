<template>
  <div v-click-outside="handleClickOutside" class="c-dropdown">
    <a-input
      :value="textDisplay"
      :placeholder="placeholder"
      :readonly="!showSearch"
      :disabled="disabled"
      :loading="loading"
      :show-search="showSearch"
      :is-display-status="isDisplayStatus"
      :is-display-number="isDisplayNumber"
      @focus="onFocusInput"
      @change="handleSearch"
    />
    <div
      v-if="openDropdown"
      class="list-options-wrapper"
      :class="{ 'placement-right': placement === 'right' }"
      :style="{ width, minWidth }"
      @scroll="handleScroll"
    >
      <div
        v-for="option in filterListOptions"
        :key="option.key"
        class="option-item"
        @click="handleToggle(option.key, $event)"
      >
        <template v-if="!isSingle && (option.key === 'all' || option.key == null)">
          <c-checkbox v-if="isIndeterminate" indeterminate :checked="isPartiallyChecked" />
          <c-checkbox v-else :checked="isFullyChecked" />
        </template>
        <a-checkbox v-else :checked="value?.includes(option.key)" />
        <span class="option-item__title" :title="isCode ? option.code : option.title">
          {{ isCode ? option.code : option.title }}
        </span>
      </div>
      <div v-if="!filterListOptions.length" class="empty flex flex-col items-center py-2 gap-2">
        <a-empty :image="simpleImage" />
      </div>
    </div>
    <loading-circle v-if="loading" class="down-icon" />
    <arrow-down-icon v-else class="down-icon" :width="12" color="#999" />
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import { filter, includes, isNull } from 'lodash'
import {ArrowDownIcon, EmptyIcon, } from 'dnp-ui'
import { converVietNamese } from '@/utils'

export default {
  name: 'CDropdown',
  components: {EmptyIcon, ArrowDownIcon },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Chọn giá trị'
    },
    width: {
      type: String,
      default: '100%'
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    isCode: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: String,
      default: 'unset'
    },
    placement: {
      type: String,
      default: ''
    },
    callBackAfterChange: {
      type: Function
    },
    tooltipPlacement: {
      type: String,
      default: 'left'
    },
    onScroll: {
      type: Function
    },
    isDisplayStatus: {
      type: Boolean,
      default: false
    },
    isSearchByApi: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textSearch: null,
      openDropdown: false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
    }
  },
  computed: {
    filterListOptions() {
      if (this.showSearch && this.textSearch && !this.isSearchByApi) {
        const formattedSearchText = converVietNamese(this.textSearch.trim().toLowerCase())
        return formattedSearchText
          ? filter(this.options, (x) =>
              includes(converVietNamese(x?.title?.trim().toLowerCase()), formattedSearchText)
            )
          : this.options
      }
      return this.options
    },
    optionTitleByKey() {
      return this.options.reduce((acc, option) => {
        acc[option.key] = this.isCode ? option.code : option.title
        return acc
      }, {})
    },
    textDisplay() {
      if (this.showSearch && this.textSearch !== null) return this.textSearch
      if (!this.value.length) return ''
      if (this.isAllSelected) return 'Tất cả'
      if (this.isSingle && this.value[0] === 'all') return 'Tất cả'
      if (this.value.length === 1) return this.optionTitleByKey[this.value[0]]
      return `Đã chọn ${this.value.filter((v) => !isNull(v)).length}`
    },
    isDisplayNumber() {
      return this.value.length || null
    },
    isAllSelected() {
      const nonAllOptions = this.options.filter((v) => v.key !== 'all' && !isNull(v.key))
      return !this.isSingle && this.value.length === nonAllOptions.length
    },
    isIndeterminate() {
      const nonAllSelected = this.value.filter((v) => v !== 'all' && v !== null).length
      return nonAllSelected && nonAllSelected !== this.filterListOptions.length - 1
    },
    isPartiallyChecked() {
      return this.value.filter((v) => v !== 'all').length !== 0
    },
    isFullyChecked() {
      return (
        this.value.includes(null) ||
        this.value.filter((v) => v !== 'all').length === this.filterListOptions.length - 1
      )
    }
  },
  watch: {
    openDropdown(newVal) {
      if (!newVal) {
        this.textSearch = null
        this.callBackAfterChange && this.callBackAfterChange(this.value)
      }
    },
    textSearch: {
      handler(val) {
        this.$emit('search', val)
      },
      immediate: true
    }
  },
  methods: {
    onFocusInput(e) {
      e.target.select()
      this.openDropdown = !this.disabled
    },
    handleSearch(e) {
      this.textSearch = e.target.value
    },
    handleClickOutside() {
      this.openDropdown = false
    },
    handleToggle(_value, event) {
      event.preventDefault()
      if (this.isSingle) {
        this.onChange(this.value.includes(_value) ? [] : [_value])
        this.openDropdown = false
      } else if (_value === 'all') {
          this.onChange(
            this.value.filter((v) => v !== 'all').length
              ? []
              : this.options.filter((v) => v.key !== 'all').map((v) => v.key)
          )
        } else if (isNull(_value)) {
          this.onChange(this.value.filter((v) => !isNull(v)).length ? [] : [null])
          if (!this.value.filter((v) => !isNull(v)).length) {
            this.openDropdown = false
          }
        } else {
          this.onChange(
            this.value.includes(_value)
              ? this.value.filter((v) => v !== _value)
              : this.value.concat(_value)
          )
        }
    },
    handleScroll(event) {
      if (this.onScroll) {
        const { target } = event
        if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
          this.onScroll(event)
        }
      }
    },
    onChange(val) {
      this.$emit('change', val)
      this.$emit('update:value', val)
    }
  }
}
</script>

<style lang="scss">
.c-dropdown {
  position: relative;
  color: #000 !important;
  font-size: 16px;
  input {
    border: 1px solid #d9d9d9 !important;
  }
  .list-options-wrapper {
    z-index: 10;
    position: absolute;
    bottom: -5px;
    transform: translateY(100%);
    width: 100%;
    background-color: #fff;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    max-height: 240px;
    z-index: 100;
    overflow-y: auto;
    &.placement-right {
      right: 0;
    }
    .empty {
      height: 100%;
      flex-direction: column;
      gap: 8px;
      color: rgba(0, 0, 0, 0.25);
      font-size: 14px;
      font-weight: 600;
    }
    .option-item {
      padding: 0.25em 0.6em;
      cursor: pointer;
      display: flex;
      height: 34px;
      overflow: hidden;
      &:hover {
        background-color: #f5f5f5;
      }
      &__title {
        margin-left: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
      }
    }
  }
  .down-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    svg {
      width: 12px !important;
      height: 12px !important;
    }
  }
}
</style>
