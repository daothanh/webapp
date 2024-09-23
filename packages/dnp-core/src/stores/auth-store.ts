import {defineStore} from "pinia";
import {useRequest} from "../composable";
import {ref} from "vue";
import type { AxiosResponse } from "axios";
import {KEY_LOCAL} from "../contants";
import type {TypeAPIError} from "../../types";
import {useLocalStorage} from "../composable";

export type ExchangeTokenParams = {
    newClientId?: string
    refreshToken?: string
}
const { externalRequest } = useRequest()
export const useAuthStore = defineStore('authStore', () => {
    console.log(import.meta.env)
    const lcStorage = useLocalStorage()
    const auth = ref(lcStorage.getItem(`${KEY_LOCAL}auth_info`) || {
        userInfo: {},
        isAuthentication: false,
        showModalChangePassword: false
    })

    const getUserInfo = async (access_token?: string) => {
        const token = access_token || lcStorage.getItem(`${KEY_LOCAL}access_token`)

        try {
            const res: AxiosResponse = await externalRequest('iam').post(`/user/userInfo`, {
                access_token: token
            })
            return res.data
        } catch (_error: TypeAPIError) {
            console.log(_error)
        }
    }

    const changePassword = async () => {
        const res: AxiosResponse = await externalRequest('iam').post('/user/request-change-pwd')

        return res.data
    }

    const setAuth = (payload: any) => {
        auth.value = payload
        lcStorage.setItem(`${KEY_LOCAL}auth_info`, payload)
    }
    const setUserInfo = (payload: any) => {
        auth.value.userInfo = payload
        lcStorage.setItem(`${KEY_LOCAL}auth_info`, auth)
    }
    const setIsAuthentication = (payload: boolean) => {
        auth.value.isAuthentication = payload
        lcStorage.setItem(`${KEY_LOCAL}auth_info`, auth)
    }
    const setShowModalChangePassword = (payload: boolean) => {
        auth.value.showModalChangePassword = payload
        lcStorage.setItem(`${KEY_LOCAL}auth_info`, auth)
    }
    const exchangeToken = async (params: ExchangeTokenParams) => {
        const res = await externalRequest('auth').post('/auth/token-exchange', params)
        return res.data
    }

    const refreshToken = async (params: {
        refresh_token: string
        clientId: string
        access_token: string
        username: string
    }) => {
        const config = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${params.access_token}`
            }
        }
        const res: AxiosResponse = await externalRequest('auth').post(
            `/auth/refresh-token`,
            {refreshToken: params.refresh_token, clientId: params.clientId, username: params.username},
            config
        )
        return res.data
    }

    const logOut = () => {
        const {userInfo} = auth
        const clientId = import.meta.env.VITE_CLIENT_ID
        const { pathname, search } = window.location
        const redirectPath = pathname && search ? encodeURIComponent(`${pathname}${search}`) : ''
        lcStorage.clear()
        setTimeout(() => {
            const userNameQuery = `?redirect=${redirectPath}&u=${userInfo?.userName}&clientId=${clientId}`
            window.location.replace(import.meta.env.VITE_REDIRECT_URL_LOGOUT + userNameQuery)
        }, 100)
    }

    const logOutServer = async (params: any) => {
        const res: AxiosResponse = await externalRequest('auth').post('/auth/logout', params)
        return res.data
    }

    const hasRole = (role: string) => {
        const roles =
            auth.value.userInfo?.authorization
                ?.filter((item: { type: string }) => item.type === 'web')
                ?.map((item: { uri: string }) => item.uri) || []
        return role ? roles.includes(role) : true
    }

    return {
        auth,
        setAuth,
        exchangeToken,
        setUserInfo,
        setIsAuthentication,
        setShowModalChangePassword,
        logOut,
        logOutServer,
        refreshToken,
        getUserInfo,
        changePassword,
        hasRole
    }
})