<template>
  <a-modal
    :visible="visible"
    width="100%"
    height="100%"
    :footer="null"
    centered
    class="full-screen-modal"
    @cancel="handleCancel"
  >
    <template #title>
      <span class="font-bold uppercase">{{ title }}</span>
    </template>
    <div class="mx-4 w-full h-full flex-center">
      <div v-if="loading" class="h-[80%] w-full flex items-center justify-center">
        <a-spin />
      </div>
      <div v-else class="modal-container h-[80%] w-full flex items-center justify-center">
        <slot />
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
export default {
  name: 'FullScreenModal'
}
</script>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String
  },
  loading: {
    type: Boolean,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const handleCancel = () => {
  emit('close')
}
</script>

<style lang="scss">
.full-screen-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
