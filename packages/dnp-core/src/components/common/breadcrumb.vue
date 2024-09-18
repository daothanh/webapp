<template>
  <div class="breadcrumb">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-between w-full">
        <div
          :class="[
            {
              'anomaly-monitoring-alert-page':
                route?.name === RouterName.ANOMALY_MONITORING_ALERT_WARNING_STATISTICS
            }
          ]"
        >
          <a-breadcrumb separator=">">
            <a-breadcrumb-item
              v-for="breadcrumb in breadcrumbs.slice(0, breadcrumbs.length - 1)"
              :key="breadcrumb.path"
            >
              <router-link :to="breadcrumb.path">
                <span class="text-breadcrumb"> {{ breadcrumb.meta.title }}</span>
              </router-link>
            </a-breadcrumb-item>
          </a-breadcrumb>
          <div
            v-if="
              $route?.name !== RouterName.ANOMALY_MONITORING_ALERT_WARNING_STATISTICS &&
              $route?.name !== RouterName.ANOMALY_MONITORING_ALERT_LIST
            "
            class="uppercase font-bold py-1"
          >
            {{ breadcrumbs[breadcrumbs.length - 1].meta.title }}
          </div>
        </div>

        <slot name="extra" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { RouterName } from '@/routes/config.ts'

const breadcrumbs = ref([])

const route = useRoute()

watch(
  () => route.name,
  () => {
    breadcrumbs.value = []
    route.matched.forEach((item) => {
      breadcrumbs.value.push(item)
    })
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss">
.breadcrumb {
  .text-breadcrumb {
    font-size: 13px;
    font-weight: 600;
  }

  .anomaly-monitoring-alert-page .ant-breadcrumb {
    .ant-breadcrumb-separator,
    .ant-breadcrumb-link .text-breadcrumb {
      color: var(--color-text-theme-dark) !important;
    }
  }
}
</style>
