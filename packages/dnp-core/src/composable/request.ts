import {message} from "ant-design-vue";
import axios,  { type AxiosInstance } from 'axios'
import {KEY_LOCAL} from "../contants";
import { useAuth } from "./auth";
import { useLocalStorage } from "./local-storage"

export function useRequest() {
    const lcStorage = useLocalStorage()
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const $httpRequest = (moduleCode: string) => {
        let isRefreshing = false
        let failedQueue: any = []
        const httpClient: AxiosInstance = axios.create({
            baseURL: getBaseUrl(moduleCode),
            timeout: 60000,
            responseType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'X-App-Code': import.meta.env.VITE_CLIENT_ID
            }
        })

        httpClient.interceptors.request.use(
            (config) => {
                const accessToken: string | null =
                    config?.data?.access_token || lcStorage.getItem(`${KEY_LOCAL}access_token`)
                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`
                    config.headers['X-App-Code'] = import.meta.env.VITE_APP_CODE
                }
                return config
            },
             (error) => {
                return Promise.reject(error)
            }
        )

        httpClient.interceptors.response.use(
             (response) => {
                return response
            },
             (error) => {
                const originalRequest = error.config
                if (error.response && error.response.status === 401) {
                    if (!isRefreshing) {
                        isRefreshing = true
                        const refreshTokenVal = lcStorage.getItem(`${KEY_LOCAL}refresh_token`)
                        const accessToken = lcStorage.getItem(`${KEY_LOCAL}access_token`)
                        const clientId = lcStorage.getItem(`${KEY_LOCAL}client_id`)
                        const { refreshToken } = useAuth()
                        return refreshToken({ refresh_token: refreshTokenVal, clientId, access_token: accessToken })
                            .then((res) => {
                                if (res.message === 'SUCCESS') {
                                    const { refresh_token, access_token } = res.body
                                    lcStorage.setItem(`${KEY_LOCAL}refresh_token`, refresh_token)
                                    lcStorage.setItem(`${KEY_LOCAL}access_token`, access_token)
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
                    }
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject, originalRequest })
                    })

                }
                if (error?.response?.data) {
                    message.error(error.response.data.message || 'Đã có lỗi xảy ra!')
                }
                return Promise.reject(error)
            }
        )
        return httpClient
    }

    const getBaseUrl = (moduleCode: string) => {
        let baseUrl = `${BASE_URL}/cop/${moduleCode.toLowerCase()}`
        if (!import.meta.env.PROD) {
            const devBaseUrls = {
                iam: 'http://localhost:8050',
                auth: 'http://localhost:8051',
                sys: 'http://localhost:8052',
                fsm: 'http://localhost:8054',
                wtpm: 'http://localhost:8057',
                noti: 'http://localhost:8058',
                asm: 'http://localhost:8059',
                wsm: 'http://localhost:8062'
            }
            baseUrl = devBaseUrls[moduleCode]
        }
        return baseUrl
    }

    return { $httpRequest }
}