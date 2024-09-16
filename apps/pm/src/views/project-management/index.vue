<template>
  <c-bread-crumb>
    <template #extra>
      <select-router
        :list="listSelect"
        width="w-[300px]"
        :selected-id="selectedId"
        :on-change="onChangeRouter"
      />
    </template>
  </c-bread-crumb>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProjectManagementPage'
}
</script>
<script setup lang="ts">
import { selectedRouterList } from './config'
import SelectRouter from '@/components/base/SelectRouter.vue'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkRoles } from '@/utils'
import { RouterName } from '@/routes/config.ts'
const selectedId = ref(1)
const route = useRoute()
const router = useRouter()

const listSelect = computed(() =>
  selectedRouterList.filter((l: { uriRole?: string }) => (l.uriRole ? checkRoles(l.uriRole) : l))
)

watch(
  () => route.name,
  () => {
    if (
      route?.name?.includes(RouterName.PROJECT_MANAGEMENT) &&
      route?.name !== RouterName.PROJECT_DETAIL
    ) {
      const selectedRoute = listSelect.value.find((s: { name: string }) => s.name === route.name)
      selectedId.value = selectedRoute?.id || selectedRouterList[0].id

      router.push({ name: selectedRoute?.name || listSelect.value[0]?.name, query: route.query })
    }
  },
  { immediate: true, deep: true }
)
const onChangeRouter = (value: number) => {
  selectedId.value = value
}
</script>

<style scoped></style>
