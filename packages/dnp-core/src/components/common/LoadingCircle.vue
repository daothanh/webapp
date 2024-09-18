<template>
  <a-spin :indicator="indicator" />
</template>

<script>
import { LoadingOutlined } from '@ant-design/icons-vue'

import { h } from 'vue'
export default {
  name: 'LoadingCircle',
  components: {},
  computed: {
    indicator() {
      return h(LoadingOutlined, {
        style: {
          fontSize: '18px'
        },
        spin: true
      })
    }
  }
}
</script>

<style lang="scss"></style>
