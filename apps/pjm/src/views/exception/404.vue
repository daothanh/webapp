<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="toHome"> Back Home </a-button>
    </template>
  </a-result>
</template>

<script lang="ts">
export default {
  name: '404Page',
  methods: {
    toHome(): void {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
