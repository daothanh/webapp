import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routes'
import './styles/global/_global.scss'
import clickOutside from './directives/clickOutside'
import reSize from './directives/reSize'
import Vue3ColorPicker from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import plugins from '@/plugins'
import filters from './filters'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(router)
app.directive('click-outside', clickOutside)
app.directive('resize', reSize)
app.use(plugins)
app.use(Vue3ColorPicker)
app.use(pinia)
app.mount('#app')

app.config.globalProperties.$filters = filters
