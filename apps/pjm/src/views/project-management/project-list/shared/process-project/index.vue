<template>
  <div class="process-project mt-[25px] pb-2 w-full">
    <div
      class="list-process grid items-start"
      :class="`grid-cols-${stateProjectList.length}`"
      :style="{
        /*width: `${widthGrid}px`,*/
        gridTemplateColumns: `repeat(${stateProjectList.length}, minmax(0, 1fr))`
      }"
    >
      <div
        class="process-detail h-full flex-center"
        v-for="(p, index) in stateProjectList"
        :key="p.value"
      >
        <a-spin v-if="loadingStateProjectList" />
        <div class="h-full flex flex-col w-full gap-4" v-else>
          <process-title
            :record="p"
            :border-color="isView ? '#eaeaea' : renderProcessColorByState(p.value)"
            :color="renderColorState(p.value)"
            @on-click="handleChangeState"
          />
          <!--
          <div
            class="process-detail__container flex flex-col p-2 flex-1"
            :style="{
              border: `1px solid ${renderProcessColorByState(p.value)}`
            }"
          >
            <estimated-costs
              :record="record.assetProjectStateList?.[index]?.additionalInfo?.estimatedCosts"
              @change="(data) => handleChangeValue(index, data, 'estimatedCosts')"
              :isView="isView"
              :state="p.value"
            />
            <effective-invest
              :record="record.assetProjectStateList?.[index]?.additionalInfo?.effectiveInvest"
              @change="(data) => handleChangeValue(index, data, 'effectiveInvest')"
              :isView="isView"
              :state="p.value"
            />
            <approve-step
              :record="record.assetProjectStateList?.[index]?.additionalInfo?.approveStep"
              @change="(data) => handleChangeValue(index, data, 'approveStep')"
              :isView="isView"
              :state="p.value"
            />
            <note-step
              :record="record.assetProjectStateList?.[index]?.additionalInfo?.description"
              @change="(data) => handleChangeValue(index, data, 'description')"
              :isView="isView"
              :state="p.value"
            />
          </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, h, computed } from 'vue'
import { Modal } from 'ant-design-vue'
import _ from 'lodash'
import { renderProcessColorByState } from '@/utils'
import ProcessTitle from '@/views/project-management/project-list/shared/process-project/ProcessTitle.vue'
import { getGlobalListDetail } from '@/apis/global'
import EstimatedCosts from '@/views/project-management/project-list/shared/process-project/EstimatedCosts.vue'
import EffectiveInvest from '@/views/project-management/project-list/shared/process-project/EffectiveInvest.vue'
import ApproveStep from '@/views/project-management/project-list/shared/process-project/ApproveStep.vue'
import NoteStep from '@/views/project-management/project-list/shared/process-project/NoteStep.vue'

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  isView: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const modelRef = ref({
  state: 1,
  assetProjectStateList: []
})

const loadingStateProjectList = ref(false)
const stateProjectList = ref([])
const widthProcessContainer = ref(0)

const widthGrid = computed(() => {
  return stateProjectList.value.length &&
    widthProcessContainer.value < stateProjectList.value.length * 250
    ? stateProjectList.value.length * 250
    : widthProcessContainer.value
})

const emits = defineEmits(['change'])

const renderColorState = (state) => {
  const stateActice = '#F24E1E'
  const stateOther = state < modelRef.value.state ? '#eaeaea' : '#fff'

  return modelRef.value.state == state ? stateActice : stateOther
}

const handleChangeState = (record) => {
  if (!props.isView) {
    Modal.confirm({
      title: h('p', [
        'Bạn có muốn thay đổi thành trạng thái ',
        h('strong', `"${record.name}"`),
        '?'
      ]),
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk() {
        modelRef.value.state = record.value
        emits('change', modelRef.value)
      }
    })
  }
}

const handleChangeValue = (index, data, fieldName) => {
  if (modelRef.value.assetProjectStateList[index].additionalInfo?.[fieldName]) {
    modelRef.value.assetProjectStateList[index].additionalInfo[fieldName] = data
  } else {
    modelRef.value.assetProjectStateList[index].additionalInfo = {
      ...modelRef.value.assetProjectStateList[index].additionalInfo,
      [fieldName]: data
    }
  }

  emits('change', modelRef.value)
}

const setField = (data) => {
  modelRef.value.state = data.state || 1
  modelRef.value.assetProjectStateList = data.assetProjectStateList || []
}

const getStateProject = async () => {
  loadingStateProjectList.value = true
  try {
    const res = await getGlobalListDetail({ code: 'ASM_ASSET_PROJECT.STATE' })
    if (res.message === 'SUCCESS') {
      stateProjectList.value = res.body
    }
  } finally {
    loadingStateProjectList.value = false
    widthProcessContainer.value = document.querySelectorAll('.process-project')[0]?.clientWidth
  }
}

onMounted(async () => {
  await getStateProject()
})

watch(
  () => props.loading,
  async (newVal, oldVal) => {
    if (!props.loading) {
      setField(props.record)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
.process-project {
  //overflow: auto;
  .process-detail {
    //min-width: 250px;
    &__container {
      min-height: 300px;
      margin-left: 10px;
    }
    .title-step {
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    .container {
      .field {
        font-size: 12px;
        .label {
          flex: 1;
          text-wrap: nowrap;
        }
        .content {
          flex: 1;
          input,
          textarea {
            font-size: 12px;
            padding: 0px 15px;
            font-weight: 500;
            text-align: end;
            &::placeholder {
            }
          }
          .c-input {
            min-height: 20px;
          }
        }
      }
    }
  }
}
</style>
