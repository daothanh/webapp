import { defineStore } from 'pinia'
import { listThemes } from '@/components/account/config.ts'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      state: {
        loading: false,
        isCollapseMenu: false,
        theme: ''
      }
    }
  },
  actions: {
    setLoading(payload: boolean) {
      this.state.loading = payload
    },
    setMenu(payload: boolean) {
      this.state.isCollapseMenu = payload
    },
    setTheme(theme: string) {
      const app = document.querySelector('html')

      if (app) {
        const filterTheme = listThemes.filter((l: { class: string }) => l.class !== theme) || []
        for (let i = 0; i < filterTheme.length; i++) {
          app.classList.remove(filterTheme[i].class)
        }
        app.classList.add(theme)
        this.state.theme = theme
      }
    }
  }
})
