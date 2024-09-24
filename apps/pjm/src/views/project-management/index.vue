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
</script>
<script setup lang="ts">
import {SelectRouter, useAuthStore} from 'dnp-core'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { selectedRouterList } from './config'
import { RouterName } from '@/routes/config.ts'

const selectedId = ref(1)
const route = useRoute()
const router = useRouter()
const { hasRole } = useAuthStore()
const listSelect = computed(() =>
  selectedRouterList.filter((l: { uriRole?: string }) => (l.uriRole ? hasRole(l.uriRole) : l))
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
