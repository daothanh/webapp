<template>
  <div
    v-click-outside="
      () => {
        handleChangeActiveMenu(false)
      }
    "
    class="notication mr-[10px] flex-center cursor-pointer"
    :class="{ 'notication-active': activeMenu }"
  >
    <a-badge :count="totalNotiUnread">
      <bell-icon
        :class="{ 'bell-ring': isRinging }"
        :color="activeMenu || totalNotiUnread > 0 ? '#0064d1' : '#555'"
        @click="handleChangeActiveMenu((activeMenu = !activeMenu))"
      />
      <audio v-if="firstClick" ref="audioBell" :src="ringSound" preload="auto"></audio>
    </a-badge>

    <transition name="fade">
      <div v-if="activeMenu" class="noti-menu noti-list">
        <div class="title flex justify-between items-center px-2 mt-1 relative">
          <p class="mb-0 font-[700] text-[20px]">Thông báo</p>

          <div class="more-button relative flex-center">
            <span
              v-click-outside="
                () => {
                  visiblePopupConfirm = false
                }
              "
              class="text-[13px] text-[#7c7c7c] hover:text-[#5c5c5c]"
              :class="{ 'text-[#5c5c5c] underline': visiblePopupConfirm }"
              @click="visiblePopupConfirm = true"
              >Đánh dấu đã đọc</span
            >

            <popup-confirm
              :visible="visiblePopupConfirm"
              :title="'Bạn có muốn đánh dấu tất cả là đã đọc?'"
              @cancel="visiblePopupConfirm = false"
              @confirm="
                () => {
                  visiblePopupConfirm = false
                  markReadNoti()
                }
              "
            />
          </div>
        </div>

        <div class="filter">
          <div
            class="option"
            :class="{ 'option-active': params.isRead === null }"
            @click="setFilterIsRead(null)"
          >
            Tất cả
          </div>
          <div
            class="option"
            :class="{ 'option-active': params.isRead === false }"
            @click="setFilterIsRead(false)"
          >
            Chưa đọc
          </div>
        </div>

        <div v-if="!loading && listNoti.length" class="overflow-y-auto" @scroll="handleScrollMenu">
          <div
            v-for="noti in listNoti"
            :key="noti.id"
            class="noti gap-[10px]"
            :class="{ 'noti-read': noti.isRead }"
            @click="handleViewNoti(noti)"
          >
            <div class="flex-1 overflow-hidden">
              <div class="noti__title text-ellipsis">{{ noti.title }}</div>
              <div class="noti__content text-ellipsis-2 break-words">{{ noti.content }}</div>
              <div
                class="noti__about flex items-center justify-between text-[12px]"
                :class="{ 'text-[#1890ff] font-[600]': !noti.isRead }"
              >
                <a-tooltip :title="noti.createTime" placement="bottom">
                  <span class="hover:underline">{{ formatRelativeTime(noti.createTime) }}</span>
                </a-tooltip>
              </div>
            </div>

            <div class="noti__dot flex-center">
              <a-badge status="processing" />
            </div>
          </div>

          <div v-if="loadingScroll" class="noti">
            <a-skeleton :paragraph="{ rows: 2 }" />
          </div>
        </div>

        <div v-if="loading" class="px-[8px]">
          <a-skeleton v-for="i in 4" :key="i" :paragraph="{ rows: 2 }" />
        </div>

        <div v-if="!loading && !listNoti.length" class="flex-center h-[150px] mb-[35px]">
          <div class="flex-center flex-col">
            <empty-icon :width="90" />
            <span class="mt-2 text-[14px]">Không có thông báo.</span>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <modal-detail-noti
    :visible="visibleModalNotiDetail"
    :record="selectedNoti"
    @close="handleCloseModalNotiDetail"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import {BellIcon, EmptyIcon,MoreIcon} from 'dnp-ui'
import $ from 'jquery'
import { notification, Button } from 'ant-design-vue'
import moment from 'moment'
import { useAuthStore } from '@/stores/authStore.ts'
import { useNotiStore } from '@/stores/notiStore.ts'
import { notiAppService } from '@/apis/notication'
import mqttService from '@/services/mqttService'
import { formatRelativeTime } from '@/utils'
import ringSound from '@/assets/files/ring.mp3'
import PopupConfirm from '@/components/notication/PopupConfirm.vue'


const topicNoti = computed(() => {
  return `NOTI_APP_${import.meta.env.VITE_APP_CLIENT_ID}_${userInfo.userName}`
})

onMounted(() => {
  getTotalNotiUnread()
})

onUnmounted(() => {
  // mqttService.disconnect()
})

const { auth } = useAuthStore()
const { userInfo } = auth

const activeMenu = ref(false)
const visiblePopupConfirm = ref(false)

const isRinging = ref(false)
const loading = ref(false)
const loadingScroll = ref(false)
const firstClick = ref(false)

const totalPageNoti = ref(0)
const totalNotiUnread = ref(0)

const selectedNoti = ref({})
const visibleModalNotiDetail = ref(false)

const params = ref({
  isRead: null,
  currentPage: 0,
  pageSize: 10
})

const notiStore = useNotiStore()

const listNoti = computed(() => notiStore.listNoti)

const audioBell = ref(null)

const handleAddNoti = (noti) => {
  if (!noti.id) {
    return
  }

  // showNotification(noti.title, {
  //   body: noti.content,
  //   icon: '../../../public/favicon.ico'
  // })

  notification.open({
    message: noti.title,
    description: noti.content,
    placement: 'bottomRight',
    class: 'cursor-pointer',
    onClick: () => {
      handleViewNoti(noti)
      notification.destroy()
    }
  })

  notiStore.addNoti(noti)
  getTotalNotiUnread()
  handleBellRing()
}

const handleBellRing = () => {
  isRinging.value = true

  if (audioBell.value && firstClick.value) {
    audioBell.value.play()
  }

  setTimeout(() => {
    isRinging.value = false

    if (audioBell.value && firstClick.value) {
      audioBell.value.pause()
      audioBell.value.currentTime = 0
    }
  }, 500)
}

const handleChangeActiveMenu = (value) => {
  activeMenu.value = value
  firstClick.value = true
  audioBell.value = new Audio(ringSound)

  if (activeMenu.value) {
    resetNotiList()
  } else {
    params.value.isRead = null
    visiblePopupConfirm.value = false
  }
}

const setFilterIsRead = (filter) => {
  params.value.isRead = filter
  resetNotiList()
}

const resetNotiList = async () => {
  $('.noti-menu').scrollTop(0)
  params.value.currentPage = 0
  notiStore.setNotiList([])

  loading.value = true

  await getNotiList()

  loading.value = false
}

const handleScrollMenu = async (e) => {
  const { target } = e

  if ((target.scrollTop + target.offsetHeight).toFixed() >= target.scrollHeight) {
    if (totalPageNoti.value - 1 > params.value.currentPage) {
      params.value.currentPage += 1
      loadingScroll.value = true

      await getNotiList()

      loadingScroll.value = false
    }
  }
}

const handleViewNoti = (noti) => {
  selectedNoti.value = noti
  visibleModalNotiDetail.value = true
  activeMenu.value = false

  if (noti.id && !noti.isRead) {
    markReadNoti(noti.id)
  }
}

const handleCloseModalNotiDetail = () => {
  selectedNoti.value = {}
  visibleModalNotiDetail.value = false
}

const getTotalNotiUnread = async () => {
  try {
    const res = await notiAppService.getCountUnread()

    if (res.message === 'SUCCESS') {
      totalNotiUnread.value = res.body.total
    }
  } catch (e) {
    console.log(e)
  }
}

const markReadNoti = async (id) => {
  try {
    const res = await notiAppService.markRead({ id })

    if (res.message === 'SUCCESS') {
      getTotalNotiUnread()
      resetNotiList()
    }
  } catch (e) {
    console.log(e)
  }
}

const getNotiList = async () => {
  try {
    const res = await notiAppService.search({
      ...params.value,
      appCode: import.meta.env.VITE_APP_CODE
    })

    if (res.message === 'SUCCESS') {
      notiStore.setNotiList([...listNoti.value, ...res.body.data])
      totalPageNoti.value = res.body.page_meta?.total_pages || 0
    }
  } catch (e) {
    console.log(e)
  }
}

watch(
  () => topicNoti.value,
  (newVal, oldVal) => {
    if (newVal) {
      mqttService.connect()
      mqttService.subscribe(newVal)

      mqttService.onMessage((topic, message) => {
        const { data } = message

        if (message && data) {
          handleAddNoti({
            ...data,
            createTime: data.createTime || moment().format('DD/MM/YYYY HH:mm')
          })
        }
      })
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss">
$background-blue: #ebf5ff;
$color-blue: #0064d1;

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.notication-active {
  background: $background-blue !important;
}

.notication {
  min-width: 30px;
  width: 30px;
  height: 30px;
  border-radius: 100px;
  padding-top: 2px;
  position: relative;
  //background: #e4e6eb;

  &:hover {
    background: #e4e6eb;
  }

  .ant-badge-count {
    min-width: 15px;
    height: 15px;
    padding: 0 5px;
    color: #fff;
    font-size: 10px;
    line-height: 15px;
  }
}

.noti-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 35px;
  right: 0;
  background: #ffffff;
  z-index: 9999;
  max-height: calc(100vh - 100px);
  //overflow: auto;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.noti-list {
  width: 350px;
  padding: 5px;
  border-radius: 5px;
  .filter {
    display: flex;
    align-items: center;
    padding: 0 7px;
    gap: 7px;
    margin: 10px 0 12px 0;
    .option {
      cursor: pointer;
      padding: 5px 12px;
      border-radius: 20px;
      font-weight: 600;
      &:hover {
        background: rgb(0, 0, 0, 0.05);
      }
    }
    .option-active {
      background: $background-blue !important;
      color: $color-blue;
    }
  }
  .noti {
    padding: 8px 14px;
    display: flex;
    align-items: center;
    border-radius: 3px;

    &:hover {
      background-color: #f5f5f5;
    }
    &__title {
      font-weight: 600;
    }
    &__content {
      color: rgb(0 0 0 / 70%);
    }
    .ant-badge-status-dot {
      width: 8px;
      height: 8px;
    }

    &__dot {
      width: 0px;
    }
  }

  .noti {
    border-top: 1px solid rgb(236 236 236 / 80%);
  }

  .noti-read {
    //background-color: #f5f5f5;

    color: rgb(0 0 0 / 40%);
    .noti__content {
      color: rgb(0 0 0 / 40%);
    }
    .noti__dot {
      opacity: 0;
    }
  }
}

.bell-ring {
  animation: ring 0.5s infinite alternate;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
