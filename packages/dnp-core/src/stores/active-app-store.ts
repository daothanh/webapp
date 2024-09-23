import { defineStore }  from "pinia"
import {ref} from "vue";

export const useActiveAppStore = defineStore('activeAppStore', () => {
  const activeApp = ref('')

    return { activeApp }
})