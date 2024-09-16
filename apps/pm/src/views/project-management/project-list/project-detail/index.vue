<template>
  <div
    class="project-detail-page px-4 pt-2 py-[70px] bg-white"
    :class="[{ 'project-detail-page-scroll pt-[50px]': isHeaderFixed }]"
  >
    <div
      class="flex items-center space-x-2 bg-white"
      :class="[
        { 'header-fixed': isHeaderFixed },
        { '!left-[72px]': isHeaderFixed && isCollapseMenuStore },
        { '!left-[290px]': isHeaderFixed && !isCollapseMenuStore }
      ]"
    >
      <c-button @click="handleBack">
        <arrow-left-outlined />
        Quay lại
      </c-button>
      <a-tag color="orange">
        <span class="uppercase font-semibold text-[15px] py-1 inline-block">{{
          params.pageMode === MODE_ACTION_TO_PAGE.EDIT || params.projectId
            ? isHeaderFixed
              ? `${infoProject.code} - ${infoProject.name}`
              : 'Thông tin dự án'
            : 'Tạo mới dự án'
        }}</span>
      </a-tag>
    </div>

    <div
      v-if="[MODE_ACTION_TO_PAGE.EDIT, MODE_ACTION_TO_PAGE.VIEW].includes(params.pageMode)"
      class="info-project-field !mt-[20px]"
    >
      <div class="field">
        <div class="label">Đơn vị quản lý</div>
        <div class="content">{{ infoProject.orgUnitName }}</div>
      </div>

      <div class="field">
        <div class="label">Quản lý dự án</div>
        <div class="content">{{ infoProject.managerName }}</div>
      </div>
      <div class="field">
        <div class="label">Mã dự án</div>
        <div class="content">{{ infoProject.code }}</div>
      </div>

      <div class="field">
        <div class="label">Tên dự án</div>
        <div class="content">{{ infoProject.name }}</div>
      </div>

      <div class="field">
        <div class="label">Loại dự án</div>
        <div class="content">{{ infoProject.typeName }}</div>
      </div>

      <div class="field">
        <div class="label">Địa điểm triển khai</div>
        <div class="content">{{ infoProject.deployAddress }}</div>
      </div>
    </div>

    <process-project
      :record="infoProject"
      :is-view="[MODE_ACTION_TO_PAGE.CREATE, MODE_ACTION_TO_PAGE.VIEW].includes(params.pageMode)"
      :loading="loading"
      @change="handleChangeState"
    />

    <a-tabs :active-key="activeKey" class="bg-white" @change="handleChangeTab">
      <a-tab-pane :key="1" tab="Thông tin chung">
        <general-info
          :record="infoProject"
          :is-btn-save-fixed="isBtnSaveFixed"
          :loading="loading"
          :is-edit="params.pageMode === MODE_ACTION_TO_PAGE.EDIT"
          :is-view="params.pageMode === MODE_ACTION_TO_PAGE.VIEW"
          :org-unit-list="orgUnitList"
          :org-unit-id="params.orgUnitId"
          @change="handleChangeValue"
          @on-submit="handleSubmit"
        />
      </a-tab-pane>
      <a-tab-pane
        v-if="[MODE_ACTION_TO_PAGE.EDIT, MODE_ACTION_TO_PAGE.VIEW].includes(params.pageMode)"
        :key="2"
        tab="Quản lý hợp đồng"
      >
        <contract-manage
          :record="infoProject"
          :loading="loading"
          :is-edit="params.pageMode === MODE_ACTION_TO_PAGE.EDIT"
          :is-view="params.pageMode === MODE_ACTION_TO_PAGE.VIEW"
          :org-unit-list="orgUnitList"
          :org-unit-id="params.orgUnitId"
          @change="handleChangeValue"
          @on-submit="handleSubmit"
        />
      </a-tab-pane>
      <a-tab-pane :key="3" tab="Quản lý chi phí" />
      <a-tab-pane :key="4" tab="Thông tin thầu" />
      <a-tab-pane :key="5" tab="Quản lý công việc" />
      <a-tab-pane :key="6" tab="Quản lý tài sản" />
    </a-tabs>

    <modal-confirm-edit
      :visible="modalConfirmExit"
      :on-cancel="
        () => {
          modalConfirmExit = false
        }
      "
      :on-submit="handleAgreeExit"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ProjectDetail'
}
</script>

<script lang="ts" setup>
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { computed, createVNode, onMounted, ref, watch } from 'vue'
import _ from 'lodash'
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { projectListService } from '@/apis/project-management/project-list/index.js'
import GeneralInfo from '@/views/project-management/project-list/project-detail/general-info/index.vue'
import { getCompanyList } from '@/apis/global'
import { message, Modal } from 'ant-design-vue'
import { RouterName } from '@/routes/config.ts'
import ProcessProject from '@/views/project-management/project-list/shared/process-project/index.vue'
import { isBoolean } from '@antfu/utils'
import { checkRoles } from '@/utils'
import { GLOBAL_ROLES, MODE_ACTION_TO_PAGE } from '@/configs'
import ContractManage from '@/views/project-management/project-list/project-detail/contract-manage/index.vue'
import { useGlobalStore } from '@/stores/globalStore.ts'

const route = useRoute()
const router = useRouter()

const params = ref({})
const infoProject = ref({})

const activeKey = ref(1)
const loading = ref(false)

const orgUnitList = ref([])

const isHeaderFixed = ref(false)
const isBtnSaveFixed = ref(false)
const globalStore = useGlobalStore()

const allowExit = ref<boolean>(false)
const modalConfirmExit = ref<boolean>(false)
const isUserChangedData = ref<boolean>(false)
const changeRouteTo = ref<string>('')

const isAgreeUpdate = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_MANAGEMENT_UPDATE))
const isAgreeCreate = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_MANAGEMENT_CREATE))
const isAgreeDetail = computed(() => checkRoles(GLOBAL_ROLES.PROJECT_MANAGEMENT_SELF))

const isCollapseMenuStore = computed(() => {
  const {
    $state: {
      state: { isCollapseMenu }
    }
  } = globalStore

  return isCollapseMenu
})

const handleChangeValue = (bol: boolean) => {
  isUserChangedData.value = isBoolean(bol) ? bol : true
}

const handleBack = () => {
  router.push({ name: params.value.paramName || RouterName.PROJECT_LIST, query: params.value })
}

const handleAgreeExit = () => {
  allowExit.value = true
  modalConfirmExit.value = false

  router.push({ name: changeRouteTo.value })
}

const handleChangeState = (data) => {
  updateData({ ...infoProject.value, state: data.state })
}

const handleChangeTab = (value) => {
  if (allowExit.value || !isUserChangedData.value) {
    activeKey.value = value
  } else {
    Modal.confirm({
      title: 'Các thay đổi của bạn chưa được lưu. Bạn có muốn tiếp tục chỉnh sửa?',
      icon: createVNode(ExclamationCircleOutlined),
      centered: true,
      okText: 'Tiếp tục',
      cancelText: 'Không',
      onCancel: () => {
        activeKey.value = value
        isUserChangedData.value = false
      }
    })
  }
}

const handleSubmit = (data) => {
  if (params.value.pageMode === MODE_ACTION_TO_PAGE.EDIT) {
    updateData(data)
  } else {
    createData(data)
  }
}

const createData = async (record) => {
  try {
    loading.value = true
    const res = await projectListService.create({
      ...record,
      orgUnitId: params.value.orgUnitId
    })
    if (res.message === 'SUCCESS') {
      isUserChangedData.value = false
      handleBack()
      message.success('Đã thêm thành công')
    }
  } finally {
    loading.value = false
  }
}

const updateData = async (record) => {
  try {
    loading.value = true
    const res = await projectListService.update({
      ...record,
      id: params.value.projectId,
      orgUnitId: params.value.orgUnitId
    })
    if (res.message === 'SUCCESS') {
      message.success('Đã sửa thành công')
      isUserChangedData.value = false
      await getDetailProject(params.value.projectId)
    }
  } finally {
    loading.value = false
  }
}
const getDetailProject = async (id: number) => {
  loading.value = true
  infoProject.value = {}
  isUserChangedData.value = false
  allowExit.value = false

  try {
    const res = await projectListService.detail({ id })

    if (res.message === 'SUCCESS') {
      infoProject.value = res?.body || {}
    } else {
      handleBack()
    }
  } catch (error) {
    message.error(error?.response?.data?.message)
    handleBack()
  } finally {
    loading.value = false
  }
}

const getOrgUnitList = async () => {
  try {
    const res = await getCompanyList({
      listOrgUnitType: '1,2'
    })
    if (res.message === 'SUCCESS') {
      orgUnitList.value = res.body
    }
  } catch (e) {
    console.log(e)
  }
}

const checkRolePage = () => {
  if (
    (params.value.pageMode === MODE_ACTION_TO_PAGE.CREATE && !isAgreeCreate.value) ||
    (params.value.pageMode === MODE_ACTION_TO_PAGE.EDIT && !isAgreeUpdate.value) ||
    (params.value.pageMode === MODE_ACTION_TO_PAGE.VIEW && !isAgreeDetail.value)
  ) {
    message.error('Bạn không có quyền thực hiện hành động này')
    handleBack()
  }
}

const handleScroll = () => {
  const mainContent = document.querySelector('.main-content')
  if (!mainContent) return

  isHeaderFixed.value = mainContent.scrollTop >= 100
  isBtnSaveFixed.value = mainContent.scrollTop >= 240
}

onMounted(() => {
  const mainContent = document.querySelector('.main-content')
  if (mainContent) {
    mainContent.addEventListener('scroll', handleScroll)
  }
  checkRolePage()
  getOrgUnitList()
})

watch(
  () => route.params.id,
  async (newVal, oldVal) => {
    const query = _.pickBy({ ...route.query }, _.identity)

    params.value = {
      ...query,
      projectId: parseFloat(route.params.id),
      orgUnitId: query.orgUnitId ? parseFloat(query.orgUnitId) : null,
      pageMode: query.pageMode || MODE_ACTION_TO_PAGE.VIEW
    }
    if (params.value.projectId) {
      await getDetailProject(route.params.id)
    }
  },
  { immediate: true, deep: true }
)

onBeforeRouteLeave((to, from, next) => {
  if (
    allowExit.value ||
    !isUserChangedData.value ||
    params.value.pageMode === MODE_ACTION_TO_PAGE.VIEW
  ) {
    next()
  } else {
    allowExit.value = false
    changeRouteTo.value = <string>to.name
    modalConfirmExit.value = true
  }
})
</script>

<style lang="scss">
.project-detail-page {
  position: relative;

  .header-fixed {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    height: 70px;
    padding: 10px 20px;
    z-index: 10;
    transition: 0.3s;
    border-bottom: 1px solid #f5f5f5;
  }

  .btn-save-fixed {
    position: fixed !important;
    top: 70px !important;
    right: 30px !important;
  }

  .btn-save {
    position: absolute;
    top: 190px;
    right: 15px;
    z-index: 11;
  }

  .header-info {
    background: #ffffff;
  }

  .info-project-field {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    padding: 0 20px;
    .field {
      min-width: 10%;
      .label {
        color: #777;
      }
      .content {
        font-weight: 600;
        font-size: 15px;
        min-height: 25px;
      }
    }
  }
}
</style>
