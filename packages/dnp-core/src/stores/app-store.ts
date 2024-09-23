import { defineStore } from 'pinia'
import {ref} from "vue";

export const useAppStore = defineStore('appStore', () => {
    const appConfigs = ref({
        api: {
            baseUrl: '',
            prefix: ''
        },
        clientId: '',
        logoutUrl: ''
    })

    return { appConfigs }
})