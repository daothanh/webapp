import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia'
import ext from 'ext'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vue3ColorPicker from 'vue3-colorpicker'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css';
import './styles/global/_global.scss'
import clickOutside from './directives/clickOutside'
import reSize from './directives/reSize'
import 'vue3-colorpicker/style.css'
import filters from './filters'
import router from '@/routes'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(Antd)
app.use(router)
app.directive('click-outside', clickOutside)
app.directive('resize', reSize)
app.use(ext)
app.use(Vue3ColorPicker)
app.use(pinia)
app.mount('#app')

app.config.globalProperties.$filters = filters
