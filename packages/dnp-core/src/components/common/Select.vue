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

<script>
import {ArrowDownIcon} from 'dnp-ui'
import { h } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

export default {
  name: 'SelectCustom',
  components: { ArrowDownIcon },
  props: {
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
  },
  computed: {
    indicator() {
      return h(LoadingOutlined, {
        style: {
          fontSize: '14px'
        },
        spin: true
      })
    }
  },
  methods: {
    handlePopupScroll(e) {
      const { target } = e

      if ((target.scrollTop + target.offsetHeight).toFixed() >= target.scrollHeight) {
        this.onScroll ? this.onScroll() : null
      }
    }
  }
}
</script>

<style scoped></style>
