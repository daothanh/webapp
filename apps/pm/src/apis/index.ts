import axios, { AxiosInstance } from 'axios'
import { getDevBaseUrl, getItemFromLocalStorage, setItemToLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import { message } from 'ant-design-vue'
import { refreshToken } from '@/apis/auth'
const BASE_URL = import.meta.env.VITE_BASE_URL

let isRefreshing = false
let failedQueue: any = []
export const $httpRequest = (moduleCode: string) => {
  const httpClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.PROD
      ? `${BASE_URL}/cop/${moduleCode.toLowerCase()}`
      : getDevBaseUrl(moduleCode),
    timeout: 60000,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Code': import.meta.env.VITE_CLIENT_ID
    }
  })

  httpClient.interceptors.request.use(
    function (config) {
      const access_token: string | null =
        config?.data?.access_token || getItemFromLocalStorage(`${KEY_LOCAL}access_token`)
      if (access_token) {
        config.headers['Authorization'] = 'Bearer ' + access_token
        config.headers['X-App-Code'] = import.meta.env.VITE_APP_CODE
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  httpClient.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      const originalRequest = error.config
      if (error.response && error.response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true
          const refresh_token = getItemFromLocalStorage(`${KEY_LOCAL}refresh_token`)
          const access_token = getItemFromLocalStorage(`${KEY_LOCAL}access_token`)
          const clientId = getItemFromLocalStorage(`${KEY_LOCAL}client_id`)
          return refreshToken({ refresh_token, clientId, access_token })
            .then((res) => {
              if (res.message === 'SUCCESS') {
                const { refresh_token, access_token } = res.body
                setItemToLocalStorage(`${KEY_LOCAL}refresh_token`, refresh_token)
                setItemToLocalStorage(`${KEY_LOCAL}access_token`, access_token)
                isRefreshing = false
                failedQueue.forEach((prom: any) => {
                  prom.resolve(httpClient.request(prom.originalRequest))
                })
                failedQueue = []
                return httpClient.request(originalRequest)
              }
            })
            .catch((error) => {
              if (error.config.url === `${BASE_URL}/cop/auth/auth/refresh-token`) {
                message.error('\n' + 'Đăng nhập đã hết hạn. Vui lòng đăng nhập lại!')
                localStorage.clear()
                window.location.replace(import.meta.env.VITE_REDIRECT_URL_LOGOUT)
              }
              isRefreshing = false
              return Promise.reject(error)
            })
        } else {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, originalRequest })
          })
        }
      }
      if (error?.response?.data) {
        message.error(error.response.data.message || 'Đã có lỗi xảy ra!')
      }
      return Promise.reject(error)
    }
  )
  return httpClient
}
