import {defineStore} from "pinia";
import {useFetch, useFetchWithModule, useLocalStorage} from "../composable";
import {ref} from "vue";
import type {AxiosResponse} from "axios";
import {KEY_LOCAL} from "../contants";

export type ExchangeTokenParams = {
    newClientId?: string
    refreshToken?: string
}

export const useAuthStore = defineStore('authStore', () => {
    const {post} = useFetchWithModule('iam')
    const {post: authPost} = useFetch()
    const lcStorage = useLocalStorage()

    const auth = ref({
        userInfo: {},
        accessToken: '',
        refreshToken: '',
        isAuthentication: false,
        showModalChangePassword: false
    })

    const getUserInfo = async (access_token?: string) => {
        const token = access_token || lcStorage.getItem(`${KEY_LOCAL}access_token`)

        try {
            return await post(`/user/userInfo`, {access_token: token})
        } catch (_error) {
            console.log(_error)
            throw _error
        }
    }

    const changePassword = async () => {
        try {
            const {body} = await post('/user/request-change-pwd')
            return body
        } catch (error) {
            console.error('Error changing password:', error)
            throw error
        }
    }

    const setAuth = (payload: any) => {
        auth.value = payload
    }
    const setUserInfo = (payload: any) => {
        auth.value.userInfo = payload
    }
    const setIsAuthentication = (payload: boolean) => {
        auth.value.isAuthentication = payload
    }
    const setShowModalChangePassword = (payload: boolean) => {
        auth.value.showModalChangePassword = payload
    }
    const exchangeToken = async (params: ExchangeTokenParams) => {
        const res = await authPost('/auth/token-exchange', params)
        return res.body
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
        const res: AxiosResponse = await authPost(
            `/auth/refresh-token`,
            {refreshToken: params.refresh_token, clientId: params.clientId, username: params.username},
            config
        )
        return res.body
    }

    const logOut = () => {
        const clientId = import.meta.env.VITE_CLIENT_ID
        const {pathname, search} = window.location
        const redirectPath = pathname && search ? encodeURIComponent(`${pathname}${search}`) : ''

        setTimeout(() => {
            const userNameQuery = `?redirect=${redirectPath}&u=${auth.value.userInfo?.userName}&clientId=${clientId}`
            lcStorage.clear()
            window.location.replace(import.meta.env.VITE_REDIRECT_URL_LOGOUT + userNameQuery)
        }, 100)
    }

    const logOutServer = async (params: any) => {
        const res: AxiosResponse = await authPost('/auth/logout', params)
        return res.body
    }

    const hasRole = (role: string) => {
        const roles = auth.value.userInfo?.authorization
            ?.filter(({type}) => type === 'web')
            ?.map(({uri}) => uri) || [];
        return role ? roles.includes(role) : true;
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
}, {persist: true})