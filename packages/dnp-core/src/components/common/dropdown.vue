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
<script lang="ts" setup>
import {Empty} from "ant-design-vue";
import {computed, watch,ref} from "vue";
import {filter, includes, isNull} from "lodash";
import ArrowDownIcon from '../../ui/icons/arrow-down-icon.vue'
import { useUtils } from '../../composable'
import LoadingCircle from "./loading-circle.vue";

const props = defineProps({
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
})
const emits = defineEmits(['change', 'update:value', 'search'])
const textSearch = ref<string|null>()
const openDropdown = ref<boolean>(false)
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE)
const { convertVietnamese } = useUtils()
const filterListOptions = computed(() => {
  if (props.showSearch && textSearch && !props.isSearchByApi) {
    const formattedSearchText = convertVietnamese(textSearch.value?.trim().toLowerCase())
    return formattedSearchText
        ? filter(props.options, (x) =>
            includes(convertVietnamese(x?.title?.trim().toLowerCase()), formattedSearchText)
        )
        : props.options
  }
  return props.options
})

const optionTitleByKey = computed(() => {
  return props.options.reduce((acc, option) => {
    acc[option.key] = props.isCode ? option.code : option.title
    return acc
  }, {})
})

const textDisplay = computed(() => {
  if (props.showSearch && textSearch.value !== null) return textSearch.value
  if (!props.value.length) return ''
  if (isAllSelected.value) return 'Tất cả'
  if (props.isSingle && props.value[0] === 'all') return 'Tất cả'
  if (props.value.length === 1) return optionTitleByKey.value[props.value[0]]
  return `Đã chọn ${props.value.filter((v) => !isNull(v)).length}`
})

const isDisplayNumber = computed(() => {return props.value.length || null})
const isAllSelected = computed(() => {
  const nonAllOptions = props.options.filter((v) => v.key !== 'all' && !isNull(v.key))
  return !props.isSingle && props.value.length === nonAllOptions.length
})
const isIndeterminate = computed(() => {
  const nonAllSelected = props.value.filter((v) => v !== 'all' && v !== null).length
  return nonAllSelected && nonAllSelected !== filterListOptions.value.length - 1
})
const isPartiallyChecked = computed(() => {return props.value.filter((v) => v !== 'all').length !== 0})
const isFullyChecked = computed(() => {
  return (
      props.value.includes(null) ||
      props.value.filter((v) => v !== 'all').length === filterListOptions.value.length - 1
  )
})
const onFocusInput = (e) =>{
  e.target.select()
  openDropdown.value = !props.disabled
}
const handleSearch = (e) => {
  textSearch.value = e.target.value
}
const handleClickOutside= () => {
  openDropdown.value = false
}
const handleToggle = (_value, event) => {
  event.preventDefault()
  if (props.isSingle) {
    onChange(props.value.includes(_value) ? [] : [_value])
    openDropdown.value = false
  } else if (_value === 'all') {
    onChange(
        props.value.filter((v) => v !== 'all').length
            ? []
            : props.options.filter((v) => v.key !== 'all').map((v) => v.key)
    )
  } else if (isNull(_value)) {
    onChange(props.value.filter((v) => !isNull(v)).length ? [] : [null])
    if (!props.value.filter((v) => !isNull(v)).length) {
      openDropdown.value = false
    }
  } else {
    onChange(
        props.value.includes(_value)
            ? props.value.filter((v) => v !== _value)
            : props.value.concat(_value)
    )
  }
}
const handleScroll = (event) => {
  if (props.onScroll) {
    const { target } = event
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
      props.onScroll(event)
    }
  }
}
const onChange = (val) => {
  emits('change', val)
  emits('update:value', val)
}
watch(openDropdown, (newVal) => {
  if (!newVal) {
    textSearch.value = null
    props.callBackAfterChange && props.callBackAfterChange(props.value)
  }
})
watch(textSearch, (val) => {
  emits('search', val)
})

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
