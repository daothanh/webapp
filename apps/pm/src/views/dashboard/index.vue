<template>
  <c-bread-crumb>
    <template #extra>
      <select-router
        :is-tree="true"
        :list="listSelect"
        width="w-[350px]"
        :selected-id="selectedId"
      />
    </template>
  </c-bread-crumb>
  <div class="flex-1">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardPage'
}
</script>

<script lang="ts" setup>
import SelectRouter from '@/components/base/SelectRouter.vue'
import { selectedRouterList } from '@/views/dashboard/config.ts'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { checkRoles } from '@/utils'
import { RouterName } from '@/routes/config.ts'

const selectedId = ref(1)
const route = useRoute()
const router = useRouter()

const listSelect = computed(() =>
  selectedRouterList.filter((l: { uriRole?: string }) => (l.uriRole ? checkRoles(l.uriRole) : l))
)

const findItemByName = (itemArray, targetName) => {
  for (const item of itemArray) {
    if (item.name === targetName) {
      return item
    }

    if (item.children) {
      const foundInChildren = findItemByName(item.children, targetName)
      if (foundInChildren) {
        return foundInChildren
      }
    }
  }

  return null
}

watch(
  () => route.name,
  () => {
    if (route?.name?.includes(RouterName.DASHBOARD)) {
      const selectedRoute = findItemByName(listSelect.value, route.name)

      selectedId.value = selectedRoute?.value || selectedRouterList[0].value

      router.push({ name: selectedRoute?.name || listSelect.value[0]?.name })
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped></style>
