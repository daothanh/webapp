import { useRequest } from 'dnp-core'

export function useAppRequest() {
    const _request = useRequest()
    _request.setConfigs({
        baseUrl: import.meta.env.VITE_BASE_URL,
        clientId: import.meta.env.VITE_CLIENT_ID,
        mode: import.meta.env.VITE_BASE_URL,
        moduleCode: import.meta.env.VITE_MODULE_CODE
    })
    return _request
}