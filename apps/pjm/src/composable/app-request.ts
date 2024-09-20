import {useRequest} from 'dnp-core'

export function useAppRequest() {
    return useRequest({
        baseUrl: import.meta.env.VITE_BASE_URL,
        clientId: import.meta.env.VITE_CLIENT_ID,
        mode: import.meta.env.VITE_BASE_URL,
        apiPrefix: import.meta.env.VITE_MODULE_CODE,
        logoutUrl: import.meta.env.VITE_REDIRECT_URL_LOGOUT
    })
}