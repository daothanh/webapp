<template>
  <transition name="fade">
    <div v-if="visible" class="popup-confirm">
      <div class="popup-content">
        <p>{{ title }}</p>
        <div class="actions flex cursor-pointer gap-[3px] w-full justify-end">
          <a-button size="small" @click="handleCancel">Thoát</a-button>
          <a-button size="small" type="primary" @click="handleConfirm">Ok</a-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, defineProps } from 'vue'

export default {
  props: {
    visible: Boolean,
    title: String
  },
  setup(props, { emit }) {
    const handleCancel = () => {
      emit('cancel')
    }

    const handleConfirm = () => {
      emit('confirm')
    }

    return {
      handleCancel,
      handleConfirm
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-confirm {
  position: absolute;
  top: 30px;
  right: 50%;
  transform: translateX(50%);
  width: max-content;
  background-color: #ffffff;
  background-clip: padding-box;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;

  &:before {
    position: absolute;
    content: '';
    top: -8px;
    right: 50%;
    transform: translateX(50%);
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 10px solid #ffffff;
  }
}

.popup-content {
  color: #000000;
}
</style>
