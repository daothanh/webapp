<template>
  <a-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="450"
    :mask-closable="false"
    class="modal-sent-otp"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="flex-center space-x-2 flex-col">
        <h4 class="m-0 font-[600]">Nhập mã OTP</h4>
        <p class="text-[12px] !m-0">(Mã OTP đã được gửi vào tin nhắn telegram của bạn)</p>
      </div>
    </template>
    <div class="flex-center flex-col">
      <otp-input
        ref="otpInput"
        class="mt-[10px]"
        input-type="number"
        separator=""
        :num-inputs="6"
        :should-auto-focus="true"
        :placeholder="null"
        :is-disabled="loading"
        @on-change="handleChangeOtp"
        @on-complete="handleChangeOtp"
      />

      <div class="sent-again flex img-center gap-[3px] mt-2 text-[12px]">
        <p class="mr-[2px]">Bạn chưa nhận được mã ?</p>
        <p
          class="underline"
          :class="
            currentTimeLeft || loading
              ? 'cursor-not-allowed text-[#bfbfbf]'
              : 'cursor-pointer text-[#4196F0]'
          "
          @click="handleResendOtp"
        >
          Gửi lại OTP
        </p>
        <p v-if="currentTimeLeft" class="text-red-500 w-[30px]">
          ({{ currentTimeLeft.toString().padStart(2, '0') }}s)
        </p>
      </div>
      <div class="mt-[15px] flex justify-end gap-5">
        <a-button @click="handleCancel">Huỷ</a-button>
        <a-button
          type="primary"
          :loading="loading"
          :disabled="otpValue?.length !== 6"
          @click="handleSubmit"
          >Xác nhận</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce.js'

const MAX_TIME = 60

const props = defineProps<{
  visible: boolean
  loading: boolean
  isResending: boolean
}>()

const otpInput = ref(null)
const currentTimeLeft = ref(0)
const intervalMaxTime = ref(null)
const otpValue = ref(null)

const emit = defineEmits(['submit', 'cancel', 'resendOtp'])

const countdownMaxTime = () => {
  if (!intervalMaxTime.value) {
    currentTimeLeft.value = MAX_TIME
    intervalMaxTime.value = setInterval(() => {
      if (currentTimeLeft.value === 0) {
        clearInterval(intervalMaxTime.value)
        intervalMaxTime.value = null
      } else {
        currentTimeLeft.value -= 1
      }
    }, 1000)
  }
}

const handleResendOtp = () => {
  if (!currentTimeLeft.value) {
    countdownMaxTime()
    emit('resendOtp')
  }
}

const handleChangeOtp = debounce((val) => {
  otpValue.value = val
}, 300)

const handleCancel = () => {
  emit('cancel')
}

const handleSubmit = () => {
  emit('submit', otpValue.value)
}

const clearInput = () => {
  otpInput.value?.clearInput()
}

watch(
  () => props.visible,
  (newVal, oldVal) => {
    if (newVal) {
      otpValue.value = null
      intervalMaxTime.value = null
      currentTimeLeft.value = 0
      clearInput()
      countdownMaxTime()
    } else {
      clearInterval(intervalMaxTime.value)
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss">
.modal-sent-otp {
  padding-bottom: 150px !important;
  .ant-modal-body {
    padding: 15px 24px 24px 24px;
  }
  .ant-modal-header {
    padding: 10px 20px;
  }
  .ant-modal-close-x {
    width: 40px;
    height: 40px;
  }
}
</style>
