<template>
  <a-select
    :value="!loading ? value : null"
    v-bind="$attrs"
    :options="options"
    :loading="loading"
    class="w-full"
    @popup-scroll="handlePopupScroll"
  >
    <template #suffixIcon>
      <a-spin v-if="loading" :indicator="indicator" />
      <arrow-down-icon v-else :width="15" :height="13" color="#94989A" />
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
    <slot name="option"></slot>
  </a-select>
</template>
<script lang="ts" setup>
import {computed, h} from "vue";
import {LoadingOutlined} from "@ant-design/icons-vue";
import ArrowDownIcon from '../../ui/icons/arrow-down-icon.vue'

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  onScroll: {
    type: Function,
    required: false
  }
})
const indicator = computed(() =>{
  return h(LoadingOutlined, {
    style: {
      fontSize: '14px'
    },
    spin: true
  })
})
const handlePopupScroll = (e) => {
  const { target } = e

  if ((target.scrollTop + target.offsetHeight).toFixed() >= target.scrollHeight) {
    props.onScroll ? props.onScroll() : null
  }
}
</script>
