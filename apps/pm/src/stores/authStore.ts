import { defineStore } from 'pinia'

export const useAuthStore = defineStore('userInfo', {
  state: () => {
    return {
      auth: {
        userInfo: {},
        isAuthentication: false,
        showModalChangePassword: false
      }
    }
  },
  actions: {
    setUserInfo(payload: any) {
      this.auth.userInfo = payload
    },
    setIsAuthentication(payload: boolean) {
      this.auth.isAuthentication = payload
    },
    setShowModalChangePassword(payload: boolean) {
      this.auth.showModalChangePassword = payload
    }
  }
})
