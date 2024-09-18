<template>
  <div class="bg-white flex-center h-[calc(100vh_-_100px)]">
    <div class="xl:flex items-center justify-center">
      <div>
        <div class="font-bold text-2xl md:text-4xl lg:text-[52px]">XIN CHÀO,</div>
        <div class="font-bold text-3xl lg:text-4xl my-1 text-[#05428C]">
          {{ userInfo.fullName }}
        </div>
      </div>
      <div>
        <img
          :src="welcomeImg"
          alt="welcome image"
          class="h-[200px] md:h-[300px] xl:h-[500px] cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import welcomeImage from '@/assets/images/welcome.jpg'
import { useAuthStore } from '@/stores/authStore.ts'

const welcomeImg = welcomeImage
const { auth } = useAuthStore()
const { userInfo } = auth
</script>

<style scoped></style>
