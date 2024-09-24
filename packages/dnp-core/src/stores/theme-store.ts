import { defineStore }  from "pinia"
import {ref} from "vue";

export const useThemeStore = defineStore('themeStore', () => {
    const loading = ref(false)
    const isCollapseMenu= ref(false)
    const theme= ref('')

    const listThemes = [
        { key: 1, name: 'Giao diện sáng', class: 'light-theme', img: '' },
        { key: 2, name: 'Giao diện tối', class: 'dark-theme', img: '' },
        { key: 3, name: 'Giao diện xám', class: 'gray-theme', img: '' },
        {
            key: 4,
            name: 'Giao diện bảo vệ mắt',
            class: 'eye-protection-theme',
            img: ''
        }
    ]

    const setLoading = (payload: boolean) => {
        loading.value = payload
    }
    const setMenu = (payload: boolean) => {
        isCollapseMenu.value = payload
    }

    const setTheme = (myTheme: string) => {
        const app = document.querySelector('html')

        if (app) {
            const filterTheme = listThemes.filter((l: { class: string }) => l.class !== theme.value) || []
            for (let i = 0; i < filterTheme.length; i++) {
                app.classList.remove(filterTheme[i].class)
            }
            app.classList.add(myTheme)
            theme.value = myTheme
        }
    }
    return {
        loading,
        isCollapseMenu,
        setLoading,
        setMenu,
        setTheme
    }
}, {
    persist: true
})