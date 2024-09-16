<template>
  <div
    class="process-detail__title flex-center relative"
    :style="{ border: `2px solid ${borderColor}`, height: `${height}px`, background: `${color}` }"
    @click="handleClick"
  >
    <div class="ele ele__l flex">
      <triangle-icon width="25" :height="height" :borderColor="borderColor" color="#fff" />
    </div>
    <span class="font-[600] text-[16px] pl-[20px]">{{ record.name }}</span>
    <div class="ele ele__r flex">
      <triangle-icon width="25" :height="height" :borderColor="borderColor" :color="color" />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProcessTitle'
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import TriangleIcon from '@/assets/svg/TriangleIcon.vue'

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: '#fff'
  },
  borderColor: {
    type: String,
    default: '#777'
  },
  height: {
    type: Number,
    default: 45
  }
})

const emit = defineEmits(['onClick'])

const handleClick = () => {
  emit('onClick', props.record)
}
</script>

<style lang="scss">
.process-detail {
  &__title {
    width: 87%;
    position: relative;
    cursor: pointer;
    margin-left: 10px;
    .ele {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      &__l {
        left: -2px;
        z-index: 1;
      }
      &__r {
        right: -25px;
        z-index: 2;
      }
    }
  }
}
</style>
