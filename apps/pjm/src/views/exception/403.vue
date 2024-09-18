<script lang="ts">
import { logOut } from '@/utils'
import { ArrowLeftOutlined, UnlockOutlined, HomeFilled } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { defineComponent } from 'vue'
export default defineComponent({
  name: '403Page',
  components: { ArrowLeftOutlined, UnlockOutlined, HomeFilled },
  setup: () => {
    const router = useRouter()
    const goToBack = (): void => {
      router.back()
    }
    return {
      goToBack
    }
  },
  methods: { logOut }
})
</script>
<template>
  <a-result status="403" title="403" sub-title="Bạn không có quyền truy cập chức năng.">
    <template #extra>
      <a-button type="secondary" @click="goToBack">
        <template #icon><ArrowLeftOutlined /></template>
        Quay lại
      </a-button>
      <a-button type="primary" @click="$router.push('/')">
        <template #icon><HomeFilled /></template>
        Trang chủ
      </a-button>
      <a-button type="primary" @click="logOut">
        <template #icon><UnlockOutlined /></template>
        Thoát
      </a-button>
    </template>
  </a-result>
</template>
