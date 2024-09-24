import { defineStore } from 'pinia'
import { notiAppService } from '@/apis/notication'
export const useNotiStore = defineStore('noti', {
  state: () => {
    return {
      listNoti: []
    }
  },
  actions: {
    addNoti(payload) {
      this.listNoti.unshift(payload)
    },
    setNotiList(payload) {
      this.listNoti = payload
    }
  }
})
